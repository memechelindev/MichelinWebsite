"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STAKE_TOKEN_ABI = exports.ABI = exports.NETWORK_CHAIN_ID = exports.PID = exports.STAKING_TOKEN_ADDRESS = exports.CONTRACT_ADDRESS = void 0;
const MasterChefStakingABI_json_1 = __importDefault(require("../../abi/MasterChefStakingABI.json"));
const StakeTokenABI_json_1 = __importDefault(require("../../abi/StakeTokenABI.json"));
// Pre-checksummed addresses
exports.CONTRACT_ADDRESS = '0x6B9BA977D5e65a68F3E06C253d0504a932138453';
exports.STAKING_TOKEN_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
exports.PID = 0;
exports.NETWORK_CHAIN_ID = 56; // BSC Mainnet
exports.ABI = MasterChefStakingABI_json_1.default;
exports.STAKE_TOKEN_ABI = StakeTokenABI_json_1.default;
//# sourceMappingURL=config.js.map