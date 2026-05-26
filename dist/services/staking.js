"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentAPY = getCurrentAPY;
exports.getTotalDeposited = getTotalDeposited;
exports.getPoolInfo = getPoolInfo;
exports.getUserInvestInfo = getUserInvestInfo;
exports.getPendingReward = getPendingReward;
exports.getTokenBalance = getTokenBalance;
exports.getStakeInfo = getStakeInfo;
exports.getStakeInfoPublic = getStakeInfoPublic;
exports.getWithdrawalLockPeriod = getWithdrawalLockPeriod;
exports.getWithdrawalRequests = getWithdrawalRequests;
exports.getPendingWithdrawals = getPendingWithdrawals;
exports.formatTimeRemaining = formatTimeRemaining;
exports.deposit = deposit;
exports.withdraw = withdraw;
exports.claimWithdrawal = claimWithdrawal;
exports.claim = claim;
const provider_1 = require("../web3/provider");
const config_1 = require("../web3/config");
function parseTokenAmount(value, decimals = 18) {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0)
        return BigInt(0);
    const multiplier = BigInt(10 ** decimals);
    return BigInt(Math.floor(num * Number(multiplier)));
}
function formatAPY(apy) {
    return (Number(apy) / 100).toFixed(1) + '%';
}
function formatCurrency(value) {
    const divisor = BigInt(1e18);
    const whole = value / divisor;
    const remainder = value % divisor;
    const num = Number(whole) + Number(remainder) / Number(divisor);
    const formatted = num.toFixed(2);
    if (num >= 1000000) {
        return '$' + (num / 1000000).toFixed(2) + 'M';
    }
    else if (num >= 10000) {
        return '$' + (num / 1000).toFixed(2) + 'K';
    }
    return '$' + formatted;
}
function formatTokenBalance(value, decimals = 18) {
    const num = Number(value) / Math.pow(10, decimals);
    return num.toFixed(4);
}
async function getCurrentAPY() {
    const contract = (0, provider_1.getReadOnlyContract)();
    if (!contract)
        throw new Error('Read-only contract not available');
    return await contract.getCurrentAPY();
}
async function getTotalDeposited() {
    const contract = (0, provider_1.getReadOnlyContract)();
    if (!contract)
        throw new Error('Read-only contract not available');
    return await contract.getTotalDeposited();
}
async function getPoolInfo(pid = config_1.PID) {
    const contract = (0, provider_1.getReadOnlyContract)();
    if (!contract)
        throw new Error('Read-only contract not available');
    const [stakeToken, totalDeposited, accRewardPerToken, lastUpdateTime] = await contract.getPoolInfo(pid);
    return {
        stakeToken,
        totalDeposited,
        accRewardPerToken,
        lastUpdateTime
    };
}
async function getUserInvestInfo(pid = config_1.PID, address) {
    const contract = (0, provider_1.getContract)();
    if (!contract)
        throw new Error('Staking contract not available');
    const userAddress = address || (0, provider_1.getUserAddress)();
    if (!userAddress)
        throw new Error('No user address');
    return await contract.getUserInvestInfo(pid, userAddress);
}
async function getPendingReward(pid = config_1.PID, address) {
    const contract = (0, provider_1.getContract)();
    if (!contract)
        throw new Error('Staking contract not available');
    const userAddress = address || (0, provider_1.getUserAddress)();
    if (!userAddress)
        throw new Error('No user address');
    return await contract.getPendingReward(pid, userAddress);
}
async function getTokenBalance(address) {
    const contract = (0, provider_1.getReadOnlyTokenContract)();
    if (!contract)
        throw new Error('Token read-only contract not available');
    const userAddress = address || (0, provider_1.getUserAddress)();
    if (!userAddress)
        throw new Error('No user address');
    return await contract.balanceOf(userAddress);
}
async function getStakeInfo(pid = config_1.PID) {
    const [tvl, apy] = await Promise.all([
        getTotalDeposited(),
        getCurrentAPY()
    ]);
    let depositedAmount = BigInt(0);
    let pending = BigInt(0);
    let tokenBalance = BigInt(0);
    try {
        if ((0, provider_1.isWalletConnected)()) {
            const [userInfo, pendingReward] = await Promise.all([
                getUserInvestInfo(pid),
                getPendingReward(pid)
            ]);
            depositedAmount = userInfo.depositedAmount;
            pending = pendingReward;
        }
    }
    catch (err) {
        console.warn('Could not load user-specific data:', err);
    }
    try {
        tokenBalance = await getTokenBalance();
    }
    catch (err) {
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
async function getStakeInfoPublic(pid = config_1.PID) {
    const [tvl, apy] = await Promise.all([
        getTotalDeposited(),
        getCurrentAPY()
    ]);
    return {
        tvl: formatCurrency(tvl),
        apy: formatAPY(apy)
    };
}
async function getWithdrawalLockPeriod() {
    const contract = (0, provider_1.getReadOnlyContract)();
    if (!contract)
        throw new Error('Read-only contract not available');
    return await contract.withdrawalLockPeriod();
}
async function getWithdrawalRequests(pid = config_1.PID) {
    const contract = (0, provider_1.getReadOnlyContract)();
    if (!contract)
        throw new Error('Read-only contract not available');
    const userAddress = (0, provider_1.getUserAddress)();
    if (!userAddress)
        throw new Error('No user address');
    const lockPeriod = await contract.withdrawalLockPeriod();
    const result = await contract.withdrawalRequests(userAddress, pid);
    const [reqPid, amount, requestTime, claimed] = result;
    const withdrawals = [];
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
async function getPendingWithdrawals() {
    const contract = (0, provider_1.getContract)();
    if (!contract)
        throw new Error('Staking contract not available');
    const userAddress = (0, provider_1.getUserAddress)();
    if (!userAddress)
        throw new Error('No user address');
    const [pids, amounts, requestTimes, claimableAts] = await contract.getPendingWithdrawals();
    const withdrawals = [];
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
function formatTimeRemaining(seconds) {
    const secs = Number(seconds);
    if (secs <= 0)
        return 'Ready to claim';
    const days = Math.floor(secs / 86400);
    const hours = Math.floor((secs % 86400) / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    if (days > 0)
        return `${days}d ${hours}h`;
    if (hours > 0)
        return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}
async function deposit(amount, pid = config_1.PID) {
    if (!(0, provider_1.isWalletConnected)()) {
        return { success: false, message: 'Please connect your wallet' };
    }
    const contract = (0, provider_1.getContract)();
    const tokenContract = (0, provider_1.getTokenContract)();
    if (!contract)
        return { success: false, message: 'Contract not available' };
    try {
        const amountWei = parseTokenAmount(amount);
        if (amountWei <= BigInt(0)) {
            return { success: false, message: 'Invalid amount' };
        }
        // Check and set allowance if needed
        if (tokenContract) {
            const userAddress = (0, provider_1.getUserAddress)();
            if (userAddress) {
                const allowance = await tokenContract.allowance(userAddress, config_1.CONTRACT_ADDRESS);
                if (allowance < amountWei) {
                    // Approve the staking contract to spend tokens
                    const approveTx = await tokenContract.approve(config_1.CONTRACT_ADDRESS, amountWei);
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
    }
    catch (err) {
        const error = err;
        let message = error.message || 'Deposit failed';
        // Extract cleaner error message
        if (message.includes('user rejected')) {
            message = 'Transaction rejected by user';
        }
        else if (message.includes('insufficient funds')) {
            message = 'Insufficient balance';
        }
        else if (message.includes('execution reverted')) {
            // Extract revert reason if possible
            const match = message.match(/reverted with reason string \'([^\']+)\'/);
            if (match) {
                message = match[1];
            }
        }
        return { success: false, message: message };
    }
}
async function withdraw(amount, pid = config_1.PID) {
    if (!(0, provider_1.isWalletConnected)()) {
        return { success: false, message: 'Please connect your wallet' };
    }
    const contract = (0, provider_1.getContract)();
    if (!contract)
        return { success: false, message: 'Contract not available' };
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
    }
    catch (err) {
        const error = err;
        return { success: false, message: error.message || 'Withdraw failed' };
    }
}
async function claimWithdrawal() {
    if (!(0, provider_1.isWalletConnected)()) {
        return { success: false, message: 'Please connect your wallet' };
    }
    const contract = (0, provider_1.getContract)();
    if (!contract)
        return { success: false, message: 'Contract not available' };
    try {
        const tx = await contract.claimWithdrawal();
        const receipt = await tx.wait();
        return {
            success: true,
            message: 'Withdrawal claimed successfully!',
            hash: receipt.hash
        };
    }
    catch (err) {
        const error = err;
        return { success: false, message: error.message || 'Claim withdrawal failed' };
    }
}
async function claim(pid = config_1.PID) {
    if (!(0, provider_1.isWalletConnected)()) {
        return { success: false, message: 'Please connect your wallet' };
    }
    const contract = (0, provider_1.getContract)();
    if (!contract)
        return { success: false, message: 'Contract not available' };
    try {
        const tx = await contract.claim(pid);
        const receipt = await tx.wait();
        return {
            success: true,
            message: 'Claim successful!',
            hash: receipt.hash
        };
    }
    catch (err) {
        const error = err;
        return { success: false, message: error.message || 'Claim failed' };
    }
}
//# sourceMappingURL=staking.js.map