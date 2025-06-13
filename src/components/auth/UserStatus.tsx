'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

export default function UserStatus() {
  const { user, primaryWallet, handleLogOut } = useDynamicContext();

  const isConnected = !!user && !!primaryWallet;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
        <DynamicWidget />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
      <div className="flex-1">
        <p className="font-medium">Connected</p>
        <p className="text-sm text-gray-600">
          {primaryWallet?.address?.slice(0, 6)}...{primaryWallet?.address?.slice(-4)}
        </p>
        {user?.email && (
          <p className="text-sm text-gray-600">{user.email}</p>
        )}
      </div>
      <button
        onClick={handleLogOut}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Disconnect
      </button>
    </div>
  );
}