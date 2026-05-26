import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, STAKING_TOKEN_ADDRESS, ABI, STAKE_TOKEN_ABI, PID } from './config';

// BSC Mainnet public RPC
const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
    okxwallet?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export type WalletType = 'metamask' | 'okxwallet' | 'walletconnect';

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.JsonRpcSigner | null = null;
let contract: ethers.Contract | null = null;
let readOnlyContract: ethers.Contract | null = null;
let tokenContract: ethers.Contract | null = null;
let readOnlyTokenContract: ethers.Contract | null = null;
let userAddress: string | null = null;
let publicRpcProvider: ethers.JsonRpcProvider | null = null;
let currentWalletType: WalletType | null = null;

export function isWalletConnected(): boolean {
  return userAddress !== null && contract !== null;
}

export function getUserAddress(): string | null {
  return userAddress;
}

export function getContract(): ethers.Contract | null {
  return contract;
}

export function getReadOnlyContract(): ethers.Contract | null {
  if (readOnlyContract) return readOnlyContract;
  if (!publicRpcProvider) {
    publicRpcProvider = new ethers.JsonRpcProvider(BSC_RPC_URL);
  }
  readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, publicRpcProvider);
  return readOnlyContract;
}

export function getTokenContract(): ethers.Contract | null {
  return tokenContract;
}

export function getReadOnlyTokenContract(): ethers.Contract | null {
  if (readOnlyTokenContract) return readOnlyTokenContract;
  if (!publicRpcProvider) {
    publicRpcProvider = new ethers.JsonRpcProvider(BSC_RPC_URL);
  }
  readOnlyTokenContract = new ethers.Contract(STAKING_TOKEN_ADDRESS, STAKE_TOKEN_ABI, publicRpcProvider);
  return readOnlyTokenContract;
}

export function getAvailableWallets(): { id: WalletType; name: string; installed: boolean }[] {
  return [
    { id: 'metamask', name: 'MetaMask', installed: typeof window !== 'undefined' && !!window.ethereum },
    { id: 'okxwallet', name: 'OKX Wallet', installed: typeof window !== 'undefined' && !!window.okxwallet },
    { id: 'walletconnect', name: 'WalletConnect', installed: true } // WalletConnect is always "available" via modal
  ];
}

async function connectWithEthereum(walletType: WalletType): Promise<{ success: boolean; address?: string; error?: string }> {
  let ethereumProvider: Window['ethereum'] | Window['okxwallet'];

  if (walletType === 'metamask') {
    if (!window.ethereum) {
      return { success: false, error: 'MetaMask not installed' };
    }
    ethereumProvider = window.ethereum;
  } else if (walletType === 'okxwallet') {
    if (!window.okxwallet) {
      return { success: false, error: 'OKX Wallet not installed' };
    }
    ethereumProvider = window.okxwallet;
  } else {
    return { success: false, error: 'WalletConnect requires Web3Modal setup' };
  }

  try {
    provider = new ethers.BrowserProvider(ethereumProvider as unknown as ethers.Eip1193Provider);
    await provider.send('eth_requestAccounts', []);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    tokenContract = new ethers.Contract(STAKING_TOKEN_ADDRESS, STAKE_TOKEN_ABI, signer);
    readOnlyTokenContract = new ethers.Contract(STAKING_TOKEN_ADDRESS, STAKE_TOKEN_ABI, provider);
    currentWalletType = walletType;

    ethereumProvider.on('accountsChanged', handleAccountsChanged);
    ethereumProvider.on('chainChanged', handleChainChanged);

    return { success: true, address: userAddress };
  } catch (err: unknown) {
    const error = err as Error;
    const message = error?.message || '';
    if (message.includes('User rejected') || message.includes('user rejected')) {
      return { success: false, error: 'Connection rejected by user' };
    }
    return { success: false, error: message || 'Failed to connect wallet' };
  }
}

export async function connectWallet(walletType?: WalletType): Promise<{ success: boolean; address?: string; error?: string }> {
  if (walletType) {
    return connectWithEthereum(walletType);
  }

  // Auto-detect first available wallet
  if (window.ethereum) {
    return connectWithEthereum('metamask');
  }
  if (window.okxwallet) {
    return connectWithEthereum('okxwallet');
  }

  return { success: false, error: 'No wallet detected' };
}

function handleAccountsChanged(accounts: unknown) {
  const accs = accounts as string[];
  if (accs.length === 0) {
    disconnectWallet();
  } else {
    userAddress = accs[0];
  }
}

function handleChainChanged() {
  window.location.reload();
}

export async function disconnectWallet(): Promise<void> {
  if (currentWalletType === 'metamask' && window.ethereum) {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
  } else if (currentWalletType === 'okxwallet' && window.okxwallet) {
    window.okxwallet.removeListener('accountsChanged', handleAccountsChanged);
    window.okxwallet.removeListener('chainChanged', handleChainChanged);
  }

  userAddress = null;
  signer = null;
  contract = null;
  tokenContract = null;
  provider = null;
  currentWalletType = null;
}

export async function getNetwork(): Promise<ethers.Network | null> {
  if (!provider) return null;
  return await provider.getNetwork();
}

export function onAccountChanged(callback: (accounts: string[]) => void): void {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback as (...args: unknown[]) => void);
  }
}

export function onChainChanged(callback: (chainId: string) => void): void {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback as (...args: unknown[]) => void);
  }
}
