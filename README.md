# SafeStaking - Ethereum Liquid Staking Platform

A Next.js-based liquid staking platform that allows users to stake ETH using Lido's protocol and receive stETH tokens in return.

## Features

- 🔐 **Multi-Auth Support**: Email, social login, and wallet connection via Dynamic.xyz
- 💰 **Liquid Staking**: Stake ETH and receive liquid stETH tokens
- 📊 **Dashboard**: Real-time staking statistics and portfolio overview
- 📈 **Activity Tracking**: View staking history and rewards
- 🔒 **Secure**: Built on Lido's proven liquid staking protocol
- 📱 **Responsive**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: Dynamic.xyz (supports email, social, and wallet logins)
- **Blockchain**: Ethers.js for Ethereum interaction
- **Staking**: Lido liquid staking protocol
- **Deployment**: Vercel

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd safestaking
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Add your Dynamic.xyz environment ID:

```env
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here
```

### 3. Get Dynamic.xyz Credentials

1. Go to [Dynamic.xyz](https://app.dynamic.xyz/)
2. Create a new project
3. Copy your Environment ID
4. Enable Ethereum wallet connectors
5. Configure email/social login providers as needed

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── staking/        # Staking interface components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── pages/             # Next.js pages
├── providers/         # Context providers
├── styles/           # Global styles
└── types/            # TypeScript type definitions
```

## Key Components

### Authentication
- Uses Dynamic.xyz for seamless wallet connection
- Supports email, social (Google, GitHub), and wallet authentication
- Handles wallet connection state management

### Staking Interface
- **StakeForm**: Main staking interface for ETH → stETH conversion
- **StakingDashboard**: Overview of staking positions and rewards
- Real-time balance updates and APR display

### Smart Contract Integration
- Connects to Lido's stETH contract (`0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`)
- Handles ETH staking transactions
- Fetches user balances and staking data

## Usage

1. **Connect Wallet**: Use email, social login, or direct wallet connection
2. **View Dashboard**: Check your staking stats and rewards
3. **Stake ETH**: Enter amount and confirm transaction
4. **Receive stETH**: Get liquid staking tokens that earn rewards
5. **Track Performance**: Monitor your staking history and returns

## Configuration

### Environment Variables

- `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID`: Required for Dynamic.xyz authentication
- `NEXT_PUBLIC_GRAPH_API_KEY`: Optional, for enhanced data queries
- `NEXT_PUBLIC_INFURA_API_KEY`: Optional, for better RPC performance

### Network Configuration

The app is configured for Ethereum Mainnet by default. The Lido contract addresses are:
- **stETH Contract**: `0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

## Development Notes

### Current Implementation Status

✅ **Completed**:
- Authentication system with Dynamic.xyz
- Basic UI/UX with Tailwind CSS
- Wallet connection and user management
- Dashboard with mock data
- Staking form interface

🚧 **In Progress/Next Steps**:
- Live contract integration with Lido
- Real-time data fetching from The Graph
- Custom wrapper contract for additional features
- Enhanced error handling and user feedback
- Mobile optimization

### Testing

The current version includes mock data for development. For production:

1. Ensure you're connected to Ethereum Mainnet
2. Have test ETH available for staking
3. Verify all environment variables are set
4. Test wallet connections thoroughly

## Security Considerations

- Always verify contract addresses before mainnet deployment
- Use hardware wallets for large transactions
- Keep private keys secure and never commit them
- Test thoroughly on testnets before mainnet use

## Support

For issues or questions:
1. Check the Dynamic.xyz documentation for auth issues
2. Review Lido documentation for staking queries
3. Create an issue in this repository

## License

This project is private and proprietary. All rights reserved.

---

**Note**: This is an MVP version. Additional features and optimizations will be added based on client feedback and requirements.