'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useState, useEffect } from 'react';

export function useDynamic() {
  const context = useDynamicContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!context) {
    return {
      user: null,
      isAuthenticated: false,
      walletAddress: '',
      walletConnected: false,
      logout: () => {},
      mounted: false,
    };
  }

  const { user, handleLogOut, primaryWallet } = context;
  const isAuthenticated = Boolean(user && primaryWallet);
  const walletAddress = primaryWallet?.address || '';

  return {
    user,
    isAuthenticated: mounted && isAuthenticated,
    walletAddress,
    walletConnected: isAuthenticated && walletAddress.length > 0,
    logout: handleLogOut,
    mounted,
  };
}