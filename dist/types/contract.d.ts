export interface PoolInfo {
    stakeToken: string;
    totalDeposited: bigint;
    accRewardPerToken: bigint;
    lastUpdateTime: bigint;
}
export interface UserInfo {
    amount: bigint;
    lastClaimTime: bigint;
    totalEarned: bigint;
    rewardPerToken: bigint;
    pendingReward: bigint;
}
export interface UserInvestInfo {
    depositedAmount: bigint;
    pendingReward: bigint;
    totalEarned: bigint;
    lastClaimTime: bigint;
    roi: bigint;
}
export interface StakeInfo {
    tvl: string;
    apy: string;
    yourStake: string;
    pendingReward: string;
    depositedAmount: bigint;
    tokenBalance: string;
}
export interface WithdrawalRequest {
    pid: bigint;
    amount: bigint;
    requestTime: bigint;
    claimed: boolean;
}
export interface PendingWithdrawal {
    pid: bigint;
    amount: bigint;
    requestTime: bigint;
    claimableAt: bigint;
}
export interface TransactionResult {
    success: boolean;
    message: string;
    hash?: string;
}
//# sourceMappingURL=contract.d.ts.map