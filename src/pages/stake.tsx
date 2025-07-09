import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDynamic } from '../hooks/useDynamic';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import StakeForm from '../components/staking/StakeForm';
import AvalancheStakeForm from '../components/staking/AvalancheStakeForm';
import ChainSelector from '../components/ui/ChainSelector';

export default function Stake() {
  const { isAuthenticated, walletConnected, primaryWallet, user, mounted } = useDynamic();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedChain, setSelectedChain] = useState<'ethereum' | 'avalanche'>('ethereum');
  
  // True connection state
  const isConnected = !!primaryWallet && !!primaryWallet.address && !!user;

  // Handle loading state
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Handle successful staking
  const handleStakeSuccess = (txHash: string, amount: string) => {
    console.log('Stake successful:', { txHash, amount, chain: selectedChain });
    setShowSuccess(true);
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 5000);
  };

  // Show loading during hydration
  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staking interface...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Stake ETH & AVAX - SafeStaking</title>
        <meta name="description" content="Stake your ETH and AVAX securely through SafeStaking's multi-chain platform with transparent fees." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/fav.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        {!isConnected ? (
          <>
            <Header currentPage="stake" />
            {/* Connection Required */}
            <div className="pt-40 py-10">
              <div className="max-w-md mx-auto px-4 text-center">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Connect to start staking
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Connect your wallet to start staking ETH and AVAX through SafeStaking's secure multi-chain platform.
                  </p>
                  <div className="flex items-center justify-center">
                  <DynamicWidget />
                  </div>
                  <p className="text-sm text-gray-500 mt-6">
                    New to staking? <Link href="/#how-it-works" className="text-blue-600 hover:text-blue-700">Learn how it works</Link>
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Sidebar Layout */}
            <div className="flex h-screen">
              <Sidebar currentPage="stake" />
              
              {/* Main Content */}
              <div className="flex-1 md:ml-72 transition-all duration-300">
                <main className="h-full overflow-y-auto">
                  <div className="p-4 md:p-8 pt-20 md:pt-8">
                    {/* Success Message */}
                    {showSuccess && (
                      <div className="mb-6">
                        <div className="bg-green-50/70 backdrop-blur-sm border border-green-200/50 rounded-2xl p-4">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <p className="font-medium text-green-800">Staking successful!</p>
                              <p className="text-green-700 text-sm">Redirecting to dashboard...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Staking Interface */}
                    <div className="max-w-2xl mx-auto">
                      {/* Chain Selector */}
                      <ChainSelector 
                        selectedChain={selectedChain}
                        onChainChange={setSelectedChain}
                        className="mb-6"
                      />

                      {/* Conditional Form Rendering */}
                      {selectedChain === 'ethereum' ? (
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden">
                          <StakeForm onStakeSuccess={handleStakeSuccess} />
                        </div>
                      ) : (
                        <AvalancheStakeForm onStakeSuccess={handleStakeSuccess} />
                      )}

                      {/* Info Section */}
                      <div className="mt-8">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-4">
                                {selectedChain === 'ethereum' ? 'How it works' : 'Avalanche Staking'}
                              </h3>
                              {selectedChain === 'ethereum' ? (
                                <ol className="space-y-2 text-sm text-gray-600">
                                  <li>1. Send ETH to our transparent wrapper</li>
                                  <li>2. We collect 0.50% platform fee</li>
                                  <li>3. Remaining ETH staked with Lido</li>
                                  <li>4. Receive liquid stETH tokens</li>
                                </ol>
                              ) : (
                                <ol className="space-y-2 text-sm text-gray-600">
                                  <li>1. Connect to Avalanche network</li>
                                  <li>2. Delegate to Stakely validator</li>
                                  <li>3. Earn 6.72% APR rewards</li>
                                  <li>4. 0% SafeStaking fee (launch promo)</li>
                                </ol>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-4">Benefits</h3>
                              {selectedChain === 'ethereum' ? (
                                <ul className="space-y-2 text-sm text-gray-600">
                                  <li>• Liquid staking - keep tokens tradeable</li>
                                  <li>• Auto-compounding rewards</li>
                                  <li>• Use in DeFi protocols</li>
                                  <li>• No lock-up periods</li>
                                </ul>
                              ) : (
                                <ul className="space-y-2 text-sm text-gray-600">
                                  <li>• Higher APR (6.72% vs ~3.2%)</li>
                                  <li>• Professional Stakely validator</li>
                                  <li>• No slashing risk on Avalanche</li>
                                  <li>• Direct blockchain interaction</li>
                                </ul>
                              )}
                            </div>
                          </div>

                          {/* Quick Links */}
                          <div className="mt-6 pt-6 border-t border-gray-200/50">
                            <div className="flex flex-wrap justify-center gap-4 text-sm">
                              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
                                View Dashboard
                              </Link>
                              <span className="text-gray-300">•</span>
                              {selectedChain === 'ethereum' ? (
                                <a
                                  href="https://etherscan.io/address/0x0D9EfFbc5D0C09d7CAbDc5d052250aDd25EcC19f"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  View ETH Contract
                                </a>
                              ) : (
                                <a
                                  href="https://snowtrace.io/validator/NodeID-6na5rkzi37wtt5piHV62y11XYfN2kTsTH"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  View Stakely Validator
                                </a>
                              )}
                              <span className="text-gray-300">•</span>
                              <Link href="/#how-it-works" className="text-blue-600 hover:text-blue-700">
                                Learn More
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}