import MasterChefStakingABI from '../../abi/MasterChefStakingABI.json';
import StakeTokenABI from '../../abi/StakeTokenABI.json';

// Pre-checksummed addresses
export const CONTRACT_ADDRESS: string = '0x6B9BA977D5e65a68F3E06C253d0504a932138453';
export const STAKING_TOKEN_ADDRESS: string = '0x55d398326f99059fF775485246999027B3197955';
export const PID = 0;
export const NETWORK_CHAIN_ID = 56; // BSC Mainnet

export const ABI = MasterChefStakingABI;
export const STAKE_TOKEN_ABI = StakeTokenABI;

export type ContractMethod = typeof ABI[number]['name'];
