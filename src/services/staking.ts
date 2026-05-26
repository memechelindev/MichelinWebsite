import { getContract, getReadOnlyContract, getReadOnlyTokenContract, getUserAddress, getTokenContract, isWalletConnected } from '../web3/provider';
import { CONTRACT_ADDRESS, PID } from '../web3/config';
import type { PoolInfo, UserInvestInfo, StakeInfo, TransactionResult, PendingWithdrawal } from '../types/contract';

function parseTokenAmount(value: string, decimals: number = 18): bigint {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return BigInt(0);
  const multiplier = BigInt(10 ** decimals);
  return BigInt(Math.floor(num * Number(multiplier)));
}

function formatAPY(apy: bigint): string {
  return (Number(apy) / 100).toFixed(1) + '%';
}

function formatCurrency(value: bigint): string {
  const divisor = BigInt(1e18);
  const whole = value / divisor;
  const remainder = value % divisor;

  const num = Number(whole) + Number(remainder) / Number(divisor);
  const formatted = num.toFixed(2);

  if (num >= 1000000) {
    return '$' + (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 10000) {
    return '$' + (num / 1000).toFixed(2) + 'K';
  }
  return '$' + formatted;
}

function formatTokenBalance(value: bigint, decimals: number = 18): string {
  const num = Number(value) / Math.pow(10, decimals);
  return num.toFixed(4);
}

export async function getCurrentAPY(): Promise<bigint> {
  const contract = getReadOnlyContract();
  if (!contract) throw new Error('Read-only contract not available');
  return await contract.getCurrentAPY();
}

export async function getTotalDeposited(): Promise<bigint> {
  const contract = getReadOnlyContract();
  if (!contract) throw new Error('Read-only contract not available');
  return await contract.getTotalDeposited();
}

export async function getPoolInfo(pid: number = PID): Promise<PoolInfo> {
  const contract = getReadOnlyContract();
  if (!contract) throw new Error('Read-only contract not available');
  const [stakeToken, totalDeposited, accRewardPerToken, lastUpdateTime] = await contract.getPoolInfo(pid);
  return {
    stakeToken,
    totalDeposited,
    accRewardPerToken,
    lastUpdateTime
  };
}

export async function getUserInvestInfo(pid: number = PID, address?: string): Promise<UserInvestInfo> {
  const contract = getContract();
  if (!contract) throw new Error('Staking contract not available');
  const userAddress = address || getUserAddress();
  if (!userAddress) throw new Error('No user address');
  return await contract.getUserInvestInfo(pid, userAddress);
}

export async function getPendingReward(pid: number = PID, address?: string): Promise<bigint> {
  const contract = getContract();
  if (!contract) throw new Error('Staking contract not available');
  const userAddress = address || getUserAddress();
  if (!userAddress) throw new Error('No user address');
  return await contract.getPendingReward(pid, userAddress);
}

export async function getTokenBalance(address?: string): Promise<bigint> {
  const contract = getReadOnlyTokenContract();
  if (!contract) throw new Error('Token read-only contract not available');
  const userAddress = address || getUserAddress();
  if (!userAddress) throw new Error('No user address');
  return await contract.balanceOf(userAddress);
}

export async function getStakeInfo(pid: number = PID): Promise<StakeInfo> {
  const [tvl, apy] = await Promise.all([
    getTotalDeposited(),
    getCurrentAPY()
  ]);

  let depositedAmount = BigInt(0);
  let pending = BigInt(0);
  let tokenBalance = BigInt(0);

  try {
    if (isWalletConnected()) {
      const [userInfo, pendingReward] = await Promise.all([
        getUserInvestInfo(pid),
        getPendingReward(pid)
      ]);
      depositedAmount = userInfo.depositedAmount;
      pending = pendingReward;
    }
  } catch (err) {
    console.warn('Could not load user-specific data:', err);
  }

  try {
    tokenBalance = await getTokenBalance();
  } catch (err) {
    console.warn('Could not load token balance:', err);
  }

  return {
    tvl: formatCurrency(tvl),
    apy: formatAPY(apy),
    yourStake: formatCurrency(depositedAmount),
    pendingReward: formatCurrency(pending),
    depositedAmount: depositedAmount,
    tokenBalance: formatTokenBalance(tokenBalance)
  };
}

// Public stake info (TVL, APY) without wallet connection
export async function getStakeInfoPublic(pid: number = PID): Promise<{ tvl: string; apy: string }> {
  const [tvl, apy] = await Promise.all([
    getTotalDeposited(),
    getCurrentAPY()
  ]);

  return {
    tvl: formatCurrency(tvl),
    apy: formatAPY(apy)
  };
}

export async function getWithdrawalLockPeriod(): Promise<bigint> {
  const contract = getReadOnlyContract();
  if (!contract) throw new Error('Read-only contract not available');
  return await contract.withdrawalLockPeriod();
}

export interface WithdrawalRequestInfo {
  pid: bigint;
  amount: bigint;
  requestTime: bigint;
  claimed: boolean;
  claimableAt: bigint;
}

export async function getWithdrawalRequests(pid: number = PID): Promise<WithdrawalRequestInfo[]> {
  const contract = getReadOnlyContract();
  if (!contract) throw new Error('Read-only contract not available');
  const userAddress = getUserAddress();
  if (!userAddress) throw new Error('No user address');

  const lockPeriod = await contract.withdrawalLockPeriod();
  const result = await contract.withdrawalRequests(userAddress, pid);
  const [reqPid, amount, requestTime, claimed] = result;

  const withdrawals: WithdrawalRequestInfo[] = [];
  if (amount > BigInt(0) && !claimed) {
    withdrawals.push({
      pid: reqPid,
      amount: amount,
      requestTime: requestTime,
      claimed: claimed,
      claimableAt: requestTime + lockPeriod
    });
  }
  return withdrawals;
}

export async function getPendingWithdrawals(): Promise<PendingWithdrawal[]> {
  const contract = getContract();
  if (!contract) throw new Error('Staking contract not available');
  const userAddress = getUserAddress();
  if (!userAddress) throw new Error('No user address');

  const [pids, amounts, requestTimes, claimableAts] = await contract.getPendingWithdrawals();

  const withdrawals: PendingWithdrawal[] = [];
  for (let i = 0; i < pids.length; i++) {
    if (amounts[i] > BigInt(0)) {
      withdrawals.push({
        pid: pids[i],
        amount: amounts[i],
        requestTime: requestTimes[i],
        claimableAt: claimableAts[i]
      });
    }
  }
  return withdrawals;
}

export function formatTimeRemaining(seconds: bigint): string {
  const secs = Number(seconds);
  if (secs <= 0) return 'Ready to claim';

  const days = Math.floor(secs / 86400);
  const hours = Math.floor((secs % 86400) / 3600);
  const minutes = Math.floor((secs % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export async function deposit(amount: string, pid: number = PID): Promise<TransactionResult> {
  if (!isWalletConnected()) {
    return { success: false, message: 'Please connect your wallet' };
  }

  const contract = getContract();
  const tokenContract = getTokenContract();
  if (!contract) return { success: false, message: 'Contract not available' };

  try {
    const amountWei = parseTokenAmount(amount);
    if (amountWei <= BigInt(0)) {
      return { success: false, message: 'Invalid amount' };
    }

    // Check and set allowance if needed
    if (tokenContract) {
      const userAddress = getUserAddress();
      if (userAddress) {
        const allowance = await tokenContract.allowance(userAddress, CONTRACT_ADDRESS);
        if (allowance < amountWei) {
          // Approve the staking contract to spend tokens
          const approveTx = await tokenContract.approve(CONTRACT_ADDRESS, amountWei);
          await approveTx.wait();
        }
      }
    }

    const tx = await contract.deposit(pid, amountWei);
    const receipt = await tx.wait();

    return {
      success: true,
      message: 'Deposit successful!',
      hash: receipt.hash
    };
  } catch (err: unknown) {
    const error = err as Error;
    let message = error.message || 'Deposit failed';

    // Extract cleaner error message
    if (message.includes('user rejected')) {
      message = 'Transaction rejected by user';
    } else if (message.includes('insufficient funds')) {
      message = 'Insufficient balance';
    } else if (message.includes('execution reverted')) {
      // Extract revert reason if possible
      const match = message.match(/reverted with reason string \'([^\']+)\'/);
      if (match) {
        message = match[1];
      }
    }

    return { success: false, message: message };
  }
}

export async function withdraw(amount: string, pid: number = PID): Promise<TransactionResult> {
  if (!isWalletConnected()) {
    return { success: false, message: 'Please connect your wallet' };
  }

  const contract = getContract();
  if (!contract) return { success: false, message: 'Contract not available' };

  try {
    const amountWei = parseTokenAmount(amount);
    if (amountWei <= BigInt(0)) {
      return { success: false, message: 'Invalid amount' };
    }

    const tx = await contract.withdraw(pid, amountWei);
    const receipt = await tx.wait();

    return {
      success: true,
      message: 'Withdrawal request submitted! You can claim after the lock period.',
      hash: receipt.hash
    };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || 'Withdraw failed' };
  }
}

export async function claimWithdrawal(): Promise<TransactionResult> {
  if (!isWalletConnected()) {
    return { success: false, message: 'Please connect your wallet' };
  }

  const contract = getContract();
  if (!contract) return { success: false, message: 'Contract not available' };

  try {
    const tx = await contract.claimWithdrawal();
    const receipt = await tx.wait();

    return {
      success: true,
      message: 'Withdrawal claimed successfully!',
      hash: receipt.hash
    };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || 'Claim withdrawal failed' };
  }
}

export async function claim(pid: number = PID): Promise<TransactionResult> {
  if (!isWalletConnected()) {
    return { success: false, message: 'Please connect your wallet' };
  }

  const contract = getContract();
  if (!contract) return { success: false, message: 'Contract not available' };

  try {
    const tx = await contract.claim(pid);
    const receipt = await tx.wait();

    return {
      success: true,
      message: 'Claim successful!',
      hash: receipt.hash
    };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || 'Claim failed' };
  }
}
