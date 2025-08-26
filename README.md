# 🚀 JAVnad - Monad Testnet Explorer

A powerful on-chain analytics and exploration tool for the Monad testnet. Discover wallets, transactions, tokens, and NFTs with ease.

## ✨ Features

- **🔍 Wallet Explorer**: Comprehensive wallet analysis with balance, transactions, and activity
- **📊 Real-time Analytics**: Detailed wallet statistics and metrics
- **🪙 Token Portfolio**: View all ERC-20 tokens with balances
- **🖼️ NFT Gallery**: Explore NFT collections with Blockvision integration
- **⚡ Transaction Lookup**: Detailed transaction information and status
- **🌐 Network Status**: Live network information and block details

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4
- **Blockchain**: Ethers.js for RPC calls
- **APIs**: Alchemy SDK, Blockvision API
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Alchemy API key
- Blockvision API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/monad-wallet-checker.git
cd monad-wallet-checker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

### Environment Variables

Create `.env.local` file with:

```env
# Alchemy API Key untuk Monad Testnet
ALCHEMY_API_KEY=your_alchemy_api_key_here

# Blockvision API Key untuk NFT data
BLOCKVISION_API_KEY=31oQM4udr0oty6ywiMD2ZUIxPMl

# Monad RPC URL (optional, fallback)
NEXT_PUBLIC_MONAD_RPC_URL=https://rpc.testnet.monad.xyz
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard

3. **Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add the same variables from `.env.local`

### API Endpoints

The application includes several API routes:

- `/api/check-wallet` - Wallet information and balance
- `/api/get-tokens` - Token balances using Alchemy
- `/api/get-nfts-blockvision` - NFT data from Blockvision
- `/api/get-nfts` - NFT data using event scanning
- `/api/get-tx` - Transaction details
- `/api/wallet-stats` - Comprehensive wallet statistics

## 🎯 Usage

1. **Wallet Explorer**: Enter any Ethereum address to view comprehensive wallet data
2. **Transaction Lookup**: Search for transaction hashes to get detailed information
3. **Real-time Data**: All data is fetched live from Monad testnet

## 🔧 Development

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

## 📱 Features Overview

### Wallet Analytics
- Balance tracking
- Transaction history
- Token portfolio
- NFT collection
- Network status

### Transaction Details
- Hash verification
- Block information
- Gas fees
- Status tracking

### NFT Integration
- Blockvision API for comprehensive NFT data
- Collection verification
- Activity tracking
- Image display

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Developer

Built with ❤️ by [@ipvdan](https://twitter.com/ipvdan)

---

**Status**: Actively maintained and updated for Monad testnet