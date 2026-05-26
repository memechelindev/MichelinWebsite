# MEMEchelin Staking Platform

A decentralized staking application built on BNB Chain (BSC), enabling users to stake tokens and earn rewards through a secure and transparent smart contract system.

![Staking Banner](https://img.shields.io/badge/Platform-BNB%20Chain-F0B90B?style=for-the-badge&logo=binance)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## 🚀 Features

- **Multi-Wallet Support** - Connect using MetaMask, OKX Wallet, or WalletConnect
- **Real-Time APY Display** - Live staking rewards calculation
- **Total Value Locked (TVL)** - Transparent pool statistics
- **Secure Staking** - Built on audited smart contracts with role-based access control
- **Withdrawal Protection** - Lock period ensures fund security
- **Instant Reward Claims** - Claim pending rewards with one click

## 🛠️ Technology Stack

- **Frontend**: TypeScript, HTML5, CSS3
- **Blockchain**: ethers.js v6, Ethers.js Provider
- **Smart Contracts**: Solidity (MasterChef Staking)
- **Build Tool**: esbuild, TypeScript Compiler
- **Deployment**: Vercel, GitHub Pages

## 📁 Project Structure

```
MichelinWebsite/
├── src/
│   ├── web3/
│   │   ├── config.ts      # Contract addresses & ABIs
│   │   └── provider.ts    # Wallet connection providers
│   ├── services/
│   │   └── staking.ts      # Staking interaction logic
│   └── types/
│       └── contract.ts     # TypeScript interfaces
├── abi/
│   ├── MasterChefStakingABI.json
│   └── StakeTokenABI.json
├── dist/                   # Compiled output
├── stake.html             # Main staking page
└── index.html             # Landing page
```

## 🔗 Smart Contract Addresses (BSC Mainnet)

| Contract | Address |
|----------|---------|
| MasterChefStaking | `0x6B9BA977D5e65a68F3E06C253d0504a932138453` |
| StakeToken (USDT) | `0x55d398326f99059fF775485246999027B3197955` |

## 🚦 Getting Started

### Prerequisites

- Node.js v18+ (recommended)
- npm or yarn
- MetaMask / OKX Wallet / WalletConnect compatible wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/memechelindev/MichelinWebsite.git

# Navigate to project directory
cd MichelinWebsite

# Install dependencies
npm install

# Build the project
npm run build

# Start local server
npm start
```

### Configuration

Update `src/web3/config.ts` to modify:
- Contract addresses
- Network chain ID (56 = BSC Mainnet, 97 = BSC Testnet)
- ABI definitions

## 📖 Usage Guide

### Connecting Wallet

1. Click the wallet connect button in the header
2. Select your preferred wallet (MetaMask, OKX Wallet, or WalletConnect)
3. Approve the connection request in your wallet

### Staking Tokens

1. Ensure your wallet is connected to BSC Mainnet
2. Enter the amount you wish to stake
3. Click "Deposit" and confirm the transaction
4. Wait for transaction confirmation

### Claiming Rewards

1. View your pending rewards in the "Pending Reward" section
2. Click "Claim" to withdraw accumulated rewards
3. Rewards are automatically calculated based on APY

### Withdrawing Funds

1. Navigate to the "Withdraw" tab
2. Enter the amount to withdraw
3. Click "Withdraw" - funds enter a lock period
4. After lock period expires, click "Claim" to receive funds

## 🔒 Security Features

- **ReentrancyGuard** - Protects against reentrancy attacks
- **Ownable** - Owner-only functions for administrative tasks
- **Access Control** - Role-based permissions for sensitive operations
- **Withdrawal Lock Period** - Prevents immediate withdrawal attacks

## 🌐 Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| BSC Mainnet | 56 | ✅ Production |
| BSC Testnet | 97 | 🧪 Testing |

## 📊 Analytics

The platform displays:
- **Total Value Locked (TVL)** - Total deposits in the pool
- **APY Yield** - Annual percentage yield
- **Your Stake** - User's current deposit amount
- **Pending Reward** - Unclaimed reward amount

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contact

- **Twitter**: [@MEMECHELIN1](https://x.com/MEMECHELIN1)
- **Website**: [four.meme](https://four.meme/)

## ⚠️ Disclaimer

This software is provided "as is", without warranty of any kind. Users should conduct their own due diligence before interacting with any smart contracts. Cryptocurrency investments carry risk.