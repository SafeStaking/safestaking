'use client';

import WalletConnect from '../components/WalletConnect';
import StakingInterface from '../components/StakingInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SafeStaking</h1>
              <span className="ml-2 text-sm text-gray-500">Secure ETH Staking</span>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Stake ETH with Confidence
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Earn rewards by staking your ETH through the trusted Lido protocol. 
            Start earning with just a few clicks.
          </p>
        </div>

        <StakingInterface />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure</h3>
            <p className="text-gray-600">Built on trusted Web3Auth and Lido protocols</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Earn Rewards</h3>
            <p className="text-gray-600">Your stETH automatically earns staking rewards</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">Simple interface, no technical knowledge required</p>
          </div>
        </div>
      </main>
    </div>
  );
}