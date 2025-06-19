import { useState } from 'react';
import Head from 'next/head';
import { useDynamic } from '../hooks/useDynamic';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import StakeForm from '../components/staking/StakeForm';
import StakingDashboard from '../components/dashboard/StakingDashboard';

export default function Home() {
  const { isAuthenticated, walletConnected, primaryWallet, user, mounted } = useDynamic();
  const [activeTab, setActiveTab] = useState<'stake' | 'dashboard'>('dashboard');

  // True connection state - if we have wallet and address
  const isConnected = !!primaryWallet && !!primaryWallet.address;

  return (
    <>
      <Head>
        <title>SafeStaking </title>
        <meta name="description" content="Stake your ETH securely through SafeStaking's wrapper with transparent fee structure and Lido integration on Ethereum Mainnet." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">SafeStaking</h1>
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Ethereum Mainnet
                </span>
              </div>
              
              {/* Navigation - Show if wallet is connected */}
              {isConnected && (
                <nav className="hidden md:flex space-x-8">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'dashboard'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('stake')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'stake'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Stake ETH
                  </button>
                </nav>
              )}
              
              {/* Wallet Widget in Navbar */}
              <div className="flex items-center">
                <DynamicWidget />
              </div>
            </div>
          </div>
        </header>

      
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isConnected ? (
            /* Welcome Section */
            <div className="text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Secure ETH Staking with Transparent Fees
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Stake your ETH through our secure wrapper contract with clear fee structure. 
                  Your funds are staked with Lido while we collect a small platform fee.
                </p>
                
                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Trusted</h3>
                    <p className="text-gray-600">
                      Built on battle-tested Lido protocol with transparent wrapper contract on Ethereum Mainnet.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent Fees</h3>
                    <p className="text-gray-600">
                      Clear fee structure with no hidden costs. See exactly what you pay before each transaction.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Liquid Staking</h3>
                    <p className="text-gray-600">
                      Receive stETH tokens that remain liquid and can be used in DeFi protocols.
                    </p>
                  </div>
                </div>

                {/* Connect Wallet CTA */}
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect Your Wallet to Get Started</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your Ethereum wallet to start staking ETH with SafeStaking's transparent fee structure.
                  </p><div className="flex justify-center">
                  <DynamicWidget />
                  </div>
                 </div>
              </div>
            </div>
          ) : (
            /* Connected User Content */
            <div>
              {/* Mobile Navigation */}
              <div className="md:hidden mb-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'dashboard'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-500'
                    }`}
                  >
                    📊 Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('stake')}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'stake'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-500'
                    }`}
                  >
                    💰 Stake ETH
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'stake' ? (
                <div className="max-w-2xl mx-auto">
                  <StakeForm onStakeSuccess={(txHash, amount) => {
                    console.log('Stake successful:', { txHash, amount });
                    setTimeout(() => setActiveTab('dashboard'), 2000);
                  }} />
                </div>
              ) : (
                <StakingDashboard />
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 text-sm">
              <p>&copy; 2025 SafeStaking. Built with transparency and security in mind.</p>
              <p className="mt-1">
                Powered by Lido Protocol • Live on Ethereum Mainnet
              </p>
              <div className="mt-2 space-x-4">
                <a 
                  href="https://etherscan.io/address/0x0D9EfFbc5D0C09d7CAbDc5d052250aDd25EcC19f" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Contract
                </a>
                <a 
                  href="https://lido.fi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  About Lido
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}