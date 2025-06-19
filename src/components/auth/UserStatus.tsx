'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

export default function UserStatus() {
  const { user, primaryWallet, handleLogOut } = useDynamicContext();

  const isConnected = !!user && !!primaryWallet;

  if (!isConnected) {
    return <DynamicWidget />;
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">Connected</p>
        <p className="text-xs text-gray-600">
          {primaryWallet?.address?.slice(0, 6)}...{primaryWallet?.address?.slice(-4)}
        </p>
        {user?.email && (
          <p className="text-xs text-gray-500">{user.email}</p>
        )}
      </div>
      <button
        onClick={handleLogOut}
        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
}