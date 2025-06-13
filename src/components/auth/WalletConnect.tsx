'use client';

import React from 'react';
import { useDynamic } from '../../hooks/useDynamic';

export default function WalletConnect() {
  const { user, isAuthenticated, walletAddress, logout, mounted } = useDynamic();

  if (!mounted) {
    return (
      <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md"></div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const displayAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : 'No address';

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm">
        <p className="font-medium text-gray-900">
          {user.email || 'Connected User'}
        </p>
        <p className="text-gray-500">{displayAddress}</p>
      </div>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
      >
        Disconnect
      </button>
    </div>
  );
}