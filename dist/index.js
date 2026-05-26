"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Entry point for browser bundle - re-exports all modules
__exportStar(require("./web3/config"), exports);
__exportStar(require("./web3/provider"), exports);
__exportStar(require("./services/staking"), exports);
__exportStar(require("./types/contract"), exports);
// Re-export for browser global
const provider_1 = require("./web3/provider");
const staking_1 = require("./services/staking");
const config_1 = require("./web3/config");
if (typeof window !== 'undefined') {
    window.StakingApp = {
        connectWallet: provider_1.connectWallet,
        disconnectWallet: provider_1.disconnectWallet,
        isWalletConnected: provider_1.isWalletConnected,
        getUserAddress: provider_1.getUserAddress,
        getContract: provider_1.getContract,
        getReadOnlyContract: provider_1.getReadOnlyContract,
        getTokenContract: provider_1.getTokenContract,
        getReadOnlyTokenContract: provider_1.getReadOnlyTokenContract,
        getStakeInfo: staking_1.getStakeInfo,
        getStakeInfoPublic: staking_1.getStakeInfoPublic,
        getTokenBalance: staking_1.getTokenBalance,
        deposit: staking_1.deposit,
        withdraw: staking_1.withdraw,
        claim: staking_1.claim,
        getPendingWithdrawals: staking_1.getPendingWithdrawals,
        getWithdrawalLockPeriod: staking_1.getWithdrawalLockPeriod,
        claimWithdrawal: staking_1.claimWithdrawal,
        formatTimeRemaining: staking_1.formatTimeRemaining,
        getWithdrawalRequests: staking_1.getWithdrawalRequests,
        getAvailableWallets: provider_1.getAvailableWallets,
        CONTRACT_ADDRESS: config_1.CONTRACT_ADDRESS,
        STAKING_TOKEN_ADDRESS: config_1.STAKING_TOKEN_ADDRESS,
        PID: config_1.PID
    };
}
//# sourceMappingURL=index.js.map