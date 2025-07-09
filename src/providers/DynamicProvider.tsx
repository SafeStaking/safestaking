'use client';

import React from 'react';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

interface DynamicProviderProps {
  children: React.ReactNode;
}

export default function DynamicProvider({ children }: DynamicProviderProps) {
  if (!process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID) {
    throw new Error('NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID is required');
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
        appName: 'SafeStaking',
        
        // Multi-chain support: Ethereum + Avalanche
        overrides: {
          evmNetworks: [
            {
              // Ethereum Mainnet
              blockExplorerUrls: ['https://etherscan.io/'],
              chainId: 1,
              chainName: 'Ethereum Mainnet',
              iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
              name: 'Ethereum',
              nativeCurrency: {
                decimals: 18,
                name: 'Ether',
                symbol: 'ETH',
              },
              networkId: 1,
              rpcUrls: [
                process.env.NEXT_PUBLIC_RPC_URL,
                'https://ethereum.publicnode.com',
              ].filter(Boolean),
              vanityName: 'Ethereum Mainnet',
            },
            {
              // Avalanche C-Chain
              blockExplorerUrls: ['https://snowtrace.io/'],
              chainId: 43114,
              chainName: 'Avalanche C-Chain',
              iconUrls: ['https://app.dynamic.xyz/assets/networks/avax.svg'],
              name: 'Avalanche',
              nativeCurrency: {
                decimals: 18,
                name: 'Avalanche',
                symbol: 'AVAX',
              },
              networkId: 43114,
              rpcUrls: [
                'https://api.avax.network/ext/bc/C/rpc',
                'https://avalanche-c-chain.publicnode.com',
              ],
              vanityName: 'Avalanche Mainnet',
            }
          ],
        },
        
        events: {
          onAuthSuccess: () => console.log('🚀 Connected to wallet'),
          onLogout: () => console.log('👋 Disconnected'),
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}