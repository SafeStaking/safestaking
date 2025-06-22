import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useDynamic } from '../hooks/useDynamic';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StakingDashboard from '../components/dashboard/StakingDashboard';

export default function Dashboard() {
  const { isAuthenticated, walletConnected, primaryWallet, user, mounted } = useDynamic();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // True connection state
  const isConnected = !!primaryWallet && !!primaryWallet.address && !!user;

  // Handle loading state - give more time for wallet to connect
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 1000); // Increased timeout for better connection detection
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Show loading during hydration
  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>SafeStaking Dashboard</title>
        <meta name="description" content="Monitor your ETH staking performance, rewards, and platform statistics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="icon" type="image/png" href="/fav.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <Header currentPage="dashboard" />

        <main className="pt-20">
          {!isConnected ? (
            /* Connection Required */
            <div className="py-10">
              <div className="max-w-md mx-auto px-4 text-center">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Connect your wallet
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Connect your wallet to view your staking dashboard and monitor performance.
                  </p>
                  <DynamicWidget />
                  <p className="text-sm text-gray-500 mt-6">
                    New to SafeStaking? <Link href="/" className="text-blue-600 hover:text-blue-700">Learn more</Link>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard Content */
            <div className="py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                        <p className="text-gray-600">
                          Monitor your staking performance and rewards.
                        </p>
                      </div>
                      <div className="mt-4 lg:mt-0">
                        <Link
                          href="/stake"
                          className="inline-block px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                        >
                          Stake More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Component */}
                <StakingDashboard />
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}