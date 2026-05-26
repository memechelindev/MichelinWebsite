import { ethers } from 'ethers';
declare global {
    interface Window {
        ethereum?: {
            isMetaMask?: boolean;
            request: (args: {
                method: string;
                params?: unknown[];
            }) => Promise<unknown>;
            on: (event: string, callback: (...args: unknown[]) => void) => void;
            removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
        };
        okxwallet?: {
            request: (args: {
                method: string;
                params?: unknown[];
            }) => Promise<unknown>;
            on: (event: string, callback: (...args: unknown[]) => void) => void;
            removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
        };
    }
}
export type WalletType = 'metamask' | 'okxwallet' | 'walletconnect';
export declare function isWalletConnected(): boolean;
export declare function getUserAddress(): string | null;
export declare function getContract(): ethers.Contract | null;
export declare function getReadOnlyContract(): ethers.Contract | null;
export declare function getTokenContract(): ethers.Contract | null;
export declare function getReadOnlyTokenContract(): ethers.Contract | null;
export declare function getAvailableWallets(): {
    id: WalletType;
    name: string;
    installed: boolean;
}[];
export declare function connectWallet(walletType?: WalletType): Promise<{
    success: boolean;
    address?: string;
    error?: string;
}>;
export declare function disconnectWallet(): Promise<void>;
export declare function getNetwork(): Promise<ethers.Network | null>;
export declare function onAccountChanged(callback: (accounts: string[]) => void): void;
export declare function onChainChanged(callback: (chainId: string) => void): void;
//# sourceMappingURL=provider.d.ts.map