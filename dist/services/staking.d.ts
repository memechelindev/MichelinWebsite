import type { PoolInfo, UserInvestInfo, StakeInfo, TransactionResult, PendingWithdrawal } from '../types/contract';
export declare function getCurrentAPY(): Promise<bigint>;
export declare function getTotalDeposited(): Promise<bigint>;
export declare function getPoolInfo(pid?: number): Promise<PoolInfo>;
export declare function getUserInvestInfo(pid?: number, address?: string): Promise<UserInvestInfo>;
export declare function getPendingReward(pid?: number, address?: string): Promise<bigint>;
export declare function getTokenBalance(address?: string): Promise<bigint>;
export declare function getStakeInfo(pid?: number): Promise<StakeInfo>;
export declare function getStakeInfoPublic(pid?: number): Promise<{
    tvl: string;
    apy: string;
}>;
export declare function getWithdrawalLockPeriod(): Promise<bigint>;
export interface WithdrawalRequestInfo {
    pid: bigint;
    amount: bigint;
    requestTime: bigint;
    claimed: boolean;
    claimableAt: bigint;
}
export declare function getWithdrawalRequests(pid?: number): Promise<WithdrawalRequestInfo[]>;
export declare function getPendingWithdrawals(): Promise<PendingWithdrawal[]>;
export declare function formatTimeRemaining(seconds: bigint): string;
export declare function deposit(amount: string, pid?: number): Promise<TransactionResult>;
export declare function withdraw(amount: string, pid?: number): Promise<TransactionResult>;
export declare function claimWithdrawal(): Promise<TransactionResult>;
export declare function claim(pid?: number): Promise<TransactionResult>;
//# sourceMappingURL=staking.d.ts.map