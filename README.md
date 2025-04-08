# Core Lending App

A decentralized lending protocol built on Base Sepolia, allowing users to supply and borrow assets with competitive interest rates.

## Live Application

The application is currently live and fully functional on Base Sepolia network at:
[https://daniilk11.github.io/core-lending-frontend/dashboard](https://daniilk11.github.io/core-lending-frontend/dashboard)

## Overview

Core Lending App is a modern DeFi application that enables users to:
- Supply assets to earn interest
- Borrow assets against supplied collateral
- View real-time market data and health factors
- Manage lending positions with an intuitive interface

The application is built with Next.js, RainbowKit, and wagmi, providing a seamless Web3 experience.

## Features

- **Asset Markets**: View and interact with multiple lending markets including WETH, LINK, and USDC
- **Supply & Borrow**: Easily supply assets to earn interest or borrow against your collateral
- **Health Factor Monitoring**: Track your account's health factor to prevent liquidation
- **Real-time Data**: View up-to-date market statistics including supply APY, borrow APY, and utilization rates
- **Wallet Integration**: Seamless wallet connection with RainbowKit

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/core-lending-app.git
cd core-lending-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Key Pages

### Markets Page

The Markets page is the core of the application, where users can:
- View all available lending markets
- See current supply and borrow rates
- Check market utilization and liquidity
- Supply or borrow assets

Access the Markets page at: [http://localhost:3000/markets](http://localhost:3000/markets)

### Dashboard

The Dashboard provides an overview of your lending positions, including:
- Total supplied and borrowed amounts
- Current health factor
- Available borrowing capacity
- Interest earned and paid

### User Documentation

Comprehensive guides on how to use the platform:
- How to supply assets
- How to borrow assets
- Understanding health factors
- Avoiding liquidation

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Web3**: RainbowKit, wagmi, viem, ethers.js
- **Styling**: Tailwind CSS, Framer Motion
- **Blockchain**: Base Sepolia (Ethereum L2)

## Development

### Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/config` - Contract addresses and ABIs
- `/hooks` - Custom React hooks
- `/utils` - Utility functions
- `/lib` - Library code and mock data

### Configuration

The application uses several configuration files:
- `config/config.js` - Core contract addresses and ABIs
- `config/contractCallsConfig.js` - Contract call configurations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Base Sepolia for providing the L2 infrastructure
- RainbowKit and wagmi teams for their excellent Web3 libraries
- The open-source DeFi community for inspiration
