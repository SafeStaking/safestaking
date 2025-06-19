# SafeStaking - Ethereum Liquid Staking Platform

A Next.js-based liquid staking platform that allows users to stake ETH through a secure wrapper contract and receive stETH tokens with transparent fee structure.

## 🚀 Features

- 🔐 **Multi-Auth Support**: Email, social login, and wallet connection via Dynamic.xyz
- 💰 **Liquid Staking**: Stake ETH through SafeStaking wrapper with transparent fees
- 📊 **Real-time Dashboard**: Live staking statistics, portfolio overview, and animated number displays
- 📈 **Activity Tracking**: View staking history, rewards, and fee transparency
- 🔒 **Secure Wrapper**: Custom smart contract for enhanced fee management
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- ✨ **Smooth Animations**: NumberFlow integration for enhanced UX

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: Dynamic.xyz (supports email, social, and wallet logins)
- **Blockchain**: Ethers.js for Ethereum interaction
- **Staking**: Lido liquid staking protocol with SafeStaking wrapper
- **Animations**: NumberFlow React for smooth number transitions
- **Deployment**: Vercel


## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components (StakingDashboard.tsx)
│   └── staking/        # Staking interface (StakeForm.tsx)
├── hooks/
│   ├── useStaking.ts   # Main staking hook with contract integration
│   └── useDynamic.ts   # Dynamic.xyz authentication hook
├── lib/                # Utility functions and configurations
├── pages/            
├── providers/          # Context providers
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## 🔑 Key Components

### Authentication System
- **Dynamic.xyz Integration**: Seamless wallet connection
- **Multi-provider Support**: Email, social (Google, GitHub), and direct wallet authentication
- **State Management**: Persistent wallet connection handling

### Staking Dashboard (`StakingDashboard.tsx`)
- **Real-time Data**: Live ETH/stETH balances and platform statistics
- **Animated Numbers**: Smooth transitions using NumberFlow React
- **Portfolio Overview**: Comprehensive view of staking positions and rewards
- **Fee Transparency**: Clear breakdown of platform fees and effective rates

### Staking Interface (`StakeForm.tsx`)
- **Interactive Form**: Real-time fee calculation and gas estimation
- **Transaction Breakdown**: Detailed preview before confirmation
- **Success Feedback**: Animated transaction confirmation with details
- **Validation**: Input validation with helpful error messages

### Smart Contract Integration (`useStaking.ts`)
- **SafeStaking Wrapper**: Custom contract for transparent fee collection
- **Lido Integration**: Direct interaction with Lido's stETH protocol
- **Gas Optimization**: Intelligent gas estimation and fee calculation
- **Error Handling**: Comprehensive error management and user feedback

## 🏗 Smart Contract Architecture

### SafeStaking Wrapper Contract
- **Address**: `0x0D9EfFbc5D0C09d7CAbDc5d052250aDd25EcC19f`
- **Purpose**: Transparent fee collection before forwarding to Lido
- **Fee Structure**: 0.50% platform fee with clear breakdown
- **Functions**:
  - `stake()`: Main staking function with fee deduction
  - `calculateFee()`: Returns fee breakdown for any amount
  - `getUserStats()`: Individual user staking statistics
  - `getContractStats()`: Platform-wide statistics

### Lido stETH Integration
- **stETH Contract**: `0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`
- **Liquid Staking**: Receive tradeable stETH tokens
- **Auto-compounding**: Automatic reward accrual
- **Current APR**: ~3.2% (Lido's current rate)

## 💫 NumberFlow Animation Features

### Dashboard Animations
- **Load Animation**: Numbers count up from 0 when page loads
- **Refresh Animation**: Reset to 0 and animate to new values on refresh
- **Real-time Updates**: Smooth transitions when data changes
- **Format Options**: Different precision levels (4 decimals for ETH, 6 for fees)

### Implementation Example
```typescript
<NumberFlow 
  value={animatedValue} 
  format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
  suffix=" ETH"
/>
```

## 🎯 Usage Guide

### Getting Started
1. **Connect Wallet**: Choose from email, social login, or direct wallet connection
2. **View Dashboard**: Check your current staking positions and platform statistics
3. **Stake ETH**: Navigate to staking form and enter desired amount
4. **Review Transaction**: Check fee breakdown and confirm details
5. **Receive stETH**: Get liquid staking tokens that automatically earn rewards

### Fee Structure
- **Platform Fee**: 0.50% of staked amount
- **Gas Fees**: Standard Ethereum network fees
- **No Exit Fees**: Freely trade or use your stETH tokens
- **Transparent Reporting**: All fees clearly displayed before and after transactions

### Monitoring Your Investment
- **Real-time Balances**: Updated ETH and stETH balances
- **Reward Tracking**: Daily and yearly projected rewards
- **Fee History**: Complete breakdown of all fees paid
- **Performance Metrics**: Effective fee rate calculations

## 🔒 Security Features

### Smart Contract Security
- **Audited Protocol**: Built on Lido's proven and audited smart contracts
- **Transparent Fees**: All fee calculations are on-chain and verifiable
- **No Admin Keys**: Immutable fee structure for user protection
- **Contract Verification**: All contracts verified on Etherscan

### Frontend Security
- **Environment Variables**: Sensitive data properly handled
- **Input Validation**: Comprehensive form validation and sanitization
- **Error Handling**: Graceful error management without exposing internals
- **Wallet Security**: No private key handling or storage

## 📊 Current Implementation Status

### ✅ Completed Features
- Full authentication system with Dynamic.xyz
- Complete UI/UX with Tailwind CSS and responsive design
- Real-time dashboard with animated NumberFlow components
- Functional staking form with fee calculation
- Smart contract integration with Lido protocol
- Custom SafeStaking wrapper contract
- Gas estimation and transaction handling
- Error handling and user feedback systems
- Fee transparency and breakdown features

### 🚧 Upcoming Enhancements
- Historical performance charts
- Advanced analytics and reporting
- Enhanced portfolio management


## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🏆 Key Achievements

- **Transparent Fee Structure**: Clear 0.50% platform fee with detailed breakdown
- **Smooth User Experience**: NumberFlow animations enhance user engagement
- **Multi-Auth Support**: Flexible authentication options for broad user access
- **Real-time Data**: Live updates and instant feedback
- **Production Ready**: Deployed on Ethereum Mainnet with real value transactions

**Built with transparency and security in mind. Powered by Lido Protocol on Ethereum Mainnet.**

---

*© 2025 SafeStaking. Professional liquid staking platform for the Ethereum ecosystem.*