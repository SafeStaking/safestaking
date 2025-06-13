import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

export const dynamicConfig = {
  environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
  walletConnectors: [EthereumWalletConnectors],
  appName: 'Staking Platform',
  appLogoUrl: '/logo.png',
  cssOverrides: `
    /* Custom styling to match your design */
    .dynamic-widget-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  `,
};