import React from 'react';
import { useDynamic } from '../hooks/useDynamic';
import LoginButton from '../components/auth/LoginButton';
import WalletConnect from '../components/auth/WalletConnect';

export default function Home(): JSX.Element {
  const { isAuthenticated, walletConnected, mounted } = useDynamic();

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">SafeStaking</h1>
            {isAuthenticated ? <WalletConnect /> : <LoginButton />}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {walletConnected ? (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Welcome to SafeStaking !</h2>
              <p className="text-gray-600">Your wallet is connected.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <LoginButton />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}