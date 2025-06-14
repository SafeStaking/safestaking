'use client';

import React from 'react';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

export default function DynamicProvider({ children }) {
  if (!process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID) {
    throw new Error('NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID is not set in .env.local');
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
        walletConnectors: [EthereumWalletConnectors],
        appName: 'SafeStaking',
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}