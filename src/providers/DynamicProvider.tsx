'use client';

import React, { type ReactNode } from 'react';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

interface Props {
  children: ReactNode;
}

export default function DynamicProvider({ children }: Props): JSX.Element {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
        walletConnectors: [EthereumWalletConnectors],
        appName: 'Staking Platform',
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}