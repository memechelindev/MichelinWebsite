// Entry point for browser bundle - re-exports all modules
export * from './web3/config';
export * from './web3/provider';
export * from './services/staking';
export * from './types/contract';

// Re-export for browser global
import { connectWallet, disconnectWallet, isWalletConnected, getUserAddress, getContract, getReadOnlyContract, getTokenContract, getReadOnlyTokenContract, getAvailableWallets, type WalletType } from './web3/provider';
import { getStakeInfo, getStakeInfoPublic, getTokenBalance, deposit, withdraw, claim, getPendingWithdrawals, getWithdrawalLockPeriod, claimWithdrawal, formatTimeRemaining, getWithdrawalRequests } from './services/staking';
import { CONTRACT_ADDRESS, STAKING_TOKEN_ADDRESS, PID } from './web3/config';

if (typeof window !== 'undefined') {
  (window as unknown as { StakingApp: object }).StakingApp = {
    connectWallet,
    disconnectWallet,
    isWalletConnected,
    getUserAddress,
    getContract,
    getReadOnlyContract,
    getTokenContract,
    getReadOnlyTokenContract,
    getStakeInfo,
    getStakeInfoPublic,
    getTokenBalance,
    deposit,
    withdraw,
    claim,
    getPendingWithdrawals,
    getWithdrawalLockPeriod,
    claimWithdrawal,
    formatTimeRemaining,
    getWithdrawalRequests,
    getAvailableWallets,
    CONTRACT_ADDRESS,
    STAKING_TOKEN_ADDRESS,
    PID
  };
}
