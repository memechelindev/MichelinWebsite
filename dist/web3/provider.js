"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWalletConnected = isWalletConnected;
exports.getUserAddress = getUserAddress;
exports.getContract = getContract;
exports.getReadOnlyContract = getReadOnlyContract;
exports.getTokenContract = getTokenContract;
exports.getReadOnlyTokenContract = getReadOnlyTokenContract;
exports.getAvailableWallets = getAvailableWallets;
exports.connectWallet = connectWallet;
exports.disconnectWallet = disconnectWallet;
exports.getNetwork = getNetwork;
exports.onAccountChanged = onAccountChanged;
exports.onChainChanged = onChainChanged;
const ethers_1 = require("ethers");
const config_1 = require("./config");
// BSC Mainnet public RPC
const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/';
let provider = null;
let signer = null;
let contract = null;
let readOnlyContract = null;
let tokenContract = null;
let readOnlyTokenContract = null;
let userAddress = null;
let publicRpcProvider = null;
let currentWalletType = null;
function isWalletConnected() {
    return userAddress !== null && contract !== null;
}
function getUserAddress() {
    return userAddress;
}
function getContract() {
    return contract;
}
function getReadOnlyContract() {
    if (readOnlyContract)
        return readOnlyContract;
    if (!publicRpcProvider) {
        publicRpcProvider = new ethers_1.ethers.JsonRpcProvider(BSC_RPC_URL);
    }
    readOnlyContract = new ethers_1.ethers.Contract(config_1.CONTRACT_ADDRESS, config_1.ABI, publicRpcProvider);
    return readOnlyContract;
}
function getTokenContract() {
    return tokenContract;
}
function getReadOnlyTokenContract() {
    if (readOnlyTokenContract)
        return readOnlyTokenContract;
    if (!publicRpcProvider) {
        publicRpcProvider = new ethers_1.ethers.JsonRpcProvider(BSC_RPC_URL);
    }
    readOnlyTokenContract = new ethers_1.ethers.Contract(config_1.STAKING_TOKEN_ADDRESS, config_1.STAKE_TOKEN_ABI, publicRpcProvider);
    return readOnlyTokenContract;
}
function getAvailableWallets() {
    return [
        { id: 'metamask', name: 'MetaMask', installed: typeof window !== 'undefined' && !!window.ethereum },
        { id: 'okxwallet', name: 'OKX Wallet', installed: typeof window !== 'undefined' && !!window.okxwallet },
        { id: 'walletconnect', name: 'WalletConnect', installed: true } // WalletConnect is always "available" via modal
    ];
}
async function connectWithEthereum(walletType) {
    let ethereumProvider;
    if (walletType === 'metamask') {
        if (!window.ethereum) {
            return { success: false, error: 'MetaMask not installed' };
        }
        ethereumProvider = window.ethereum;
    }
    else if (walletType === 'okxwallet') {
        if (!window.okxwallet) {
            return { success: false, error: 'OKX Wallet not installed' };
        }
        ethereumProvider = window.okxwallet;
    }
    else {
        return { success: false, error: 'WalletConnect requires Web3Modal setup' };
    }
    try {
        provider = new ethers_1.ethers.BrowserProvider(ethereumProvider);
        await provider.send('eth_requestAccounts', []);
        signer = await provider.getSigner();
        userAddress = await signer.getAddress();
        contract = new ethers_1.ethers.Contract(config_1.CONTRACT_ADDRESS, config_1.ABI, signer);
        readOnlyContract = new ethers_1.ethers.Contract(config_1.CONTRACT_ADDRESS, config_1.ABI, provider);
        tokenContract = new ethers_1.ethers.Contract(config_1.STAKING_TOKEN_ADDRESS, config_1.STAKE_TOKEN_ABI, signer);
        readOnlyTokenContract = new ethers_1.ethers.Contract(config_1.STAKING_TOKEN_ADDRESS, config_1.STAKE_TOKEN_ABI, provider);
        currentWalletType = walletType;
        ethereumProvider.on('accountsChanged', handleAccountsChanged);
        ethereumProvider.on('chainChanged', handleChainChanged);
        return { success: true, address: userAddress };
    }
    catch (err) {
        const error = err;
        const message = error?.message || '';
        if (message.includes('User rejected') || message.includes('user rejected')) {
            return { success: false, error: 'Connection rejected by user' };
        }
        return { success: false, error: message || 'Failed to connect wallet' };
    }
}
async function connectWallet(walletType) {
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
function handleAccountsChanged(accounts) {
    const accs = accounts;
    if (accs.length === 0) {
        disconnectWallet();
    }
    else {
        userAddress = accs[0];
    }
}
function handleChainChanged() {
    window.location.reload();
}
async function disconnectWallet() {
    if (currentWalletType === 'metamask' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
    else if (currentWalletType === 'okxwallet' && window.okxwallet) {
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
async function getNetwork() {
    if (!provider)
        return null;
    return await provider.getNetwork();
}
function onAccountChanged(callback) {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', callback);
    }
}
function onChainChanged(callback) {
    if (window.ethereum) {
        window.ethereum.on('chainChanged', callback);
    }
}
//# sourceMappingURL=provider.js.map