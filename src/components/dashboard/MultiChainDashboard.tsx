import React, { useState } from 'react';
import NumberFlow from '@number-flow/react';
import Link from 'next/link';
import { useStaking } from '../../hooks/useStaking';
import { useAvalanche } from '../../hooks/useAvalanche';
import { useDynamic } from '../../hooks/useDynamic';
import ChainSelector from '../ui/ChainSelector';

export default function MultiChainDashboard() {
  const { primaryWallet } = useDynamic();
  const [selectedChain, setSelectedChain] = useState<'ethereum' | 'avalanche'>('ethereum');
  
  // Ethereum data
  const { 
    balance: ethBalance, 
    userStats: ethUserStats, 
    contractStats: ethContractStats, 
    feePercentage: ethFeePercentage, 
    isLoading: ethLoading,
    refreshData: refreshEthData 
  } = useStaking();

  // Avalanche data
  const {
    balance: avaxBalance,
    stakingPositions: avaxPositions,
    stakingStats: avaxStats,
    isLoading: avaxLoading,
    stakelyConfig,
    fetchBalances: refreshAvaxData
  } = useAvalanche();

  const isLoading = ethLoading || avaxLoading;

  const handleRefresh = async () => {
    await Promise.all([
      refreshEthData(),
      refreshAvaxData()
    ]);
  };

  // Calculate totals across chains
  const getTotalPortfolioValue = () => {
    const ethValue = parseFloat(ethBalance?.totalValue || '0');
    const avaxValue = parseFloat(avaxBalance?.totalBalance || '0');
    // Note: In production, you'd convert to USD using price feeds
    return { eth: ethValue, avax: avaxValue };
  };

  const totalPortfolio = getTotalPortfolioValue();

  if (isLoading && !ethBalance && !avaxBalance) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6">
              <div className="animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Header Title */}
            <div className="mb-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Multi-Chain Dashboard</h1>
                            <p className="text-gray-600">
                             Monitor your staking performance
                            </p>
                        </div>
                            <div className="mt-4 lg:mt-0 flex gap-3">
                            {/* Chain Selector */}
                            <div className="flex justify-center">
                                <ChainSelector 
                                    selectedChain={selectedChain}
                                    onChainChange={setSelectedChain}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
     

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Portfolio Value */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 hover:bg-white/80 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Portfolio</p>
            <p className="text-2xl font-bold text-gray-900">
              <NumberFlow 
                value={totalPortfolio.eth + totalPortfolio.avax} 
                format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
              />
            </p>
            <p className="text-sm text-gray-500">
              {totalPortfolio.eth.toFixed(4)} ETH + {totalPortfolio.avax.toFixed(4)} AVAX
            </p>
          </div>
        </div>

        {/* Ethereum Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 hover:bg-white/80 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25l-6.25-3.75z"/>
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Ethereum (Liquid)</p>
            <p className="text-2xl font-bold text-gray-900">
              <NumberFlow 
                value={parseFloat(ethBalance?.stETHBalance || '0')} 
                format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
              />
            </p>
            <p className="text-sm text-gray-500">stETH Balance</p>
          </div>
        </div>

        {/* Avalanche Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 hover:bg-white/80 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Avalanche (Native)</p>
            <p className="text-2xl font-bold text-gray-900">
              <NumberFlow 
                value={parseFloat(avaxStats?.totalStaked || '0')} 
                format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
              />
            </p>
            <p className="text-sm text-gray-500">AVAX Staked</p>
          </div>
        </div>

        {/* Combined APR */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 hover:bg-white/80 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Average APR</p>
            <p className="text-2xl font-bold text-green-600">
              <NumberFlow 
                value={4.96} // Weighted average of 3.2% ETH and 6.72% AVAX
                format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                suffix="%"
              />
            </p>
            <p className="text-sm text-gray-500">Across all positions</p>
          </div>
        </div>
      </div>

      {/* Chain-Specific Dashboard */}
      {selectedChain === 'ethereum' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ethereum Portfolio */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Ethereum Portfolio</h3>
             <button
               onClick={handleRefresh}
               className="text-sm text-gray-500 hover:text-gray-700 flex items-center transition-colors"
             >
               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
               </svg>
               Refresh
             </button>
           </div>

           <div className="space-y-4">
             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">ETH Balance</span>
               <span className="font-medium">
                 <NumberFlow 
                   value={parseFloat(ethBalance?.ethBalance || '0')} 
                   format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                   suffix=" ETH"
                 />
               </span>
             </div>
             
             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">stETH Balance</span>
               <span className="font-medium">
                 <NumberFlow 
                   value={parseFloat(ethBalance?.stETHBalance || '0')} 
                   format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                   suffix=" stETH"
                 />
               </span>
             </div>

             {ethUserStats && parseFloat(ethUserStats.stakedAmount) > 0 ? (
               <>
                 <div className="flex justify-between items-center py-3 border-b border-gray-100">
                   <span className="text-gray-600">Total Staked via SafeStaking</span>
                   <span className="font-medium">
                     <NumberFlow 
                       value={parseFloat(ethUserStats.stakedAmount)} 
                       format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                       suffix=" ETH"
                     />
                   </span>
                 </div>
                 
                 <div className="flex justify-between items-center py-3 border-b border-gray-100">
                   <span className="text-gray-600">Total Fees Paid</span>
                   <span className="font-medium text-orange-600">
                     <NumberFlow 
                       value={parseFloat(ethUserStats.feePaid)} 
                       format={{ minimumFractionDigits: 6, maximumFractionDigits: 6 }}
                       suffix=" ETH"
                     />
                   </span>
                 </div>
               </>
             ) : (
               <div className="py-6 text-center">
                 <p className="text-gray-500 mb-4">No ETH staked through SafeStaking yet</p>
                 <Link href="/stake" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                   Stake ETH
                 </Link>
               </div>
             )}
           </div>
         </div>

         {/* Ethereum Platform Stats */}
         <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6">
           <h3 className="text-lg font-semibold text-gray-900 mb-6">Ethereum Platform Stats</h3>
           
           <div className="space-y-4">
             {ethContractStats ? (
               <>
                 <div className="flex justify-between items-center py-3 border-b border-gray-100">
                   <span className="text-gray-600">Total ETH Staked</span>
                   <span className="font-medium">
                     <NumberFlow 
                       value={parseFloat(ethContractStats.totalStaked)} 
                       format={{ minimumFractionDigits: 3, maximumFractionDigits: 3 }}
                       suffix=" ETH"
                     />
                   </span>
                 </div>

                 <div className="flex justify-between items-center py-3 border-b border-gray-100">
                   <span className="text-gray-600">Total Users</span>
                   <span className="font-medium">
                     <NumberFlow value={ethContractStats.totalUsers} />
                   </span>
                 </div>
                 
                 <div className="flex justify-between items-center py-3 border-b border-gray-100">
                   <span className="text-gray-600">Platform Fee</span>
                   <span className="font-medium">0.50%</span>
                 </div>
               </>
             ) : (
               <div className="text-center py-8">
                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
                 <p className="text-gray-500 text-sm">Loading Ethereum stats...</p>
               </div>
             )}
             
             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">Underlying Protocol</span>
               <span className="font-medium">Lido Finance</span>
             </div>
             
             <div className="flex justify-between items-center py-3">
               <span className="text-gray-600">Current APR</span>
               <span className="font-medium text-green-600">~3.2%</span>
             </div>
           </div>
         </div>
       </div>
     ) : (
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Avalanche Portfolio */}
         <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-semibold text-gray-900">Avalanche Portfolio</h3>
             <button
               onClick={handleRefresh}
               className="text-sm text-gray-500 hover:text-gray-700 flex items-center transition-colors"
             >
               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
               </svg>
               Refresh
             </button>
           </div>

           <div className="space-y-4">
             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">AVAX Balance (C-Chain)</span>
               <span className="font-medium">
                 <NumberFlow 
                   value={parseFloat(avaxBalance?.cChainBalance || '0')} 
                   format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                   suffix=" AVAX"
                 />
               </span>
             </div>
             
             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">AVAX Balance (P-Chain)</span>
               <span className="font-medium">
                 <NumberFlow 
                   value={parseFloat(avaxBalance?.pChainBalance || '0')} 
                   format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                   suffix=" AVAX"
                 />
               </span>
             </div>

             {avaxPositions && avaxPositions.length > 0 ? (
               <>
                 <div className="flex justify-between items-center py-3 border-b border-gray-100">
                   <span className="text-gray-600">Total Staked with Stakely</span>
                   <span className="font-medium">
                     <NumberFlow 
                       value={parseFloat(avaxStats?.totalStaked || '0')} 
                       format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                       suffix=" AVAX"
                     />
                   </span>
                 </div>
                 
                 <div className="flex justify-between items-center py-3 border-b border-gray-100">
                   <span className="text-gray-600">Active Positions</span>
                   <span className="font-medium">{avaxStats?.activePositions} positions</span>
                 </div>

                 <div className="flex justify-between items-center py-3 border-b border-gray-100">
                   <span className="text-gray-600">Estimated Total Rewards</span>
                   <span className="font-medium text-green-600">
                     +<NumberFlow 
                       value={parseFloat(avaxStats?.totalRewards || '0')} 
                       format={{ minimumFractionDigits: 6, maximumFractionDigits: 6 }}
                       suffix=" AVAX"
                     />
                   </span>
                 </div>
               </>
             ) : (
               <div className="py-6 text-center">
                 <p className="text-gray-500 mb-4">No AVAX staked with Stakely yet</p>
                 <Link href="/stake" className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                   Stake AVAX
                 </Link>
               </div>
             )}
           </div>
         </div>

         {/* Stakely Validator Stats */}
         <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6">
           <h3 className="text-lg font-semibold text-gray-900 mb-6">Stakely Validator Stats</h3>
           
           <div className="space-y-4">
             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">Validator NodeID</span>
               <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                 ...{stakelyConfig.nodeID.slice(-6)}
               </span>
             </div>

             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">Current APR</span>
               <span className="font-medium text-green-600">{stakelyConfig.apr}%</span>
             </div>

             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">Current APY</span>
               <span className="font-medium text-green-600">{stakelyConfig.apy}%</span>
             </div>
             
             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">Validator Commission</span>
               <span className="font-medium">{stakelyConfig.commission}%</span>
             </div>

             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">SafeStaking Fee</span>
               <span className="font-medium text-green-600">{stakelyConfig.safestakingFee}% (Launch Promo)</span>
             </div>
             
             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">Total Delegated</span>
               <span className="font-medium">
                 $<NumberFlow 
                   value={stakelyConfig.totalStaked} 
                   format={{ notation: 'compact' }}
                 />
               </span>
             </div>

             <div className="flex justify-between items-center py-3 border-b border-gray-100">
               <span className="text-gray-600">Minimum Stake</span>
               <span className="font-medium">{stakelyConfig.minStake} AVAX</span>
             </div>
             
             <div className="flex justify-between items-center py-3">
               <span className="text-gray-600">Network</span>
               <div className="flex items-center">
                 <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                 <span className="font-medium">Avalanche Mainnet</span>
               </div>
             </div>
           </div>
         </div>
       </div>
     )}

     {/* Staking Positions Details */}
     {selectedChain === 'avalanche' && avaxPositions && avaxPositions.length > 0 && (
       <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6">
         <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Avalanche Staking Positions</h3>
         
         <div className="overflow-x-auto">
           <table className="w-full text-sm">
             <thead>
               <tr className="border-b border-gray-200">
                 <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                 <th className="text-left py-3 px-4 font-medium text-gray-700">Start Date</th>
                 <th className="text-left py-3 px-4 font-medium text-gray-700">End Date</th>
                 <th className="text-left py-3 px-4 font-medium text-gray-700">Days Remaining</th>
                 <th className="text-left py-3 px-4 font-medium text-gray-700">Est. Rewards</th>
                 <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
               </tr>
             </thead>
             <tbody>
               {avaxPositions.map((position, index) => (
                 <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                   <td className="py-3 px-4">
                     <NumberFlow 
                       value={parseFloat(position.stakeAmount)} 
                       format={{ minimumFractionDigits: 4 }}
                       suffix=" AVAX"
                     />
                   </td>
                   <td className="py-3 px-4 text-gray-600">
                     {position.startTime.toLocaleDateString()}
                   </td>
                   <td className="py-3 px-4 text-gray-600">
                     {position.endTime.toLocaleDateString()}
                   </td>
                   <td className="py-3 px-4">
                     {position.isActive ? (
                       <span className="text-blue-600">{position.daysRemaining} days</span>
                     ) : (
                       <span className="text-gray-500">Completed</span>
                     )}
                   </td>
                   <td className="py-3 px-4 text-green-600">
                     +<NumberFlow 
                       value={parseFloat(position.estimatedRewards)} 
                       format={{ minimumFractionDigits: 6 }}
                       suffix=" AVAX"
                     />
                   </td>
                   <td className="py-3 px-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                       position.isActive 
                         ? 'bg-green-100 text-green-800' 
                         : 'bg-gray-100 text-gray-800'
                     }`}>
                       {position.isActive ? 'Active' : 'Completed'}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     )}

     {/* Quick Actions */}
     <div className="bg-gradient-to-r from-blue-50/70 to-red-50/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
       <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
         Multi-Chain Staking Options
       </h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="text-center p-6 bg-white/50 rounded-xl border border-blue-200/50">
           <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
             <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25l-6.25-3.75z"/>
             </svg>
           </div>
           <h4 className="font-medium text-gray-900 mb-2">Ethereum Liquid Staking</h4>
           <p className="text-sm text-gray-600 mb-4">
             Immediate liquidity with stETH tokens, ~3.2% APR
           </p>
           <Link 
             href="/stake"
             onClick={() => setSelectedChain('ethereum')}
             className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
           >
             Stake ETH
           </Link>
         </div>
         
         <div className="text-center p-6 bg-white/50 rounded-xl border border-red-200/50">
           <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
             <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
             </svg>
           </div>
           <h4 className="font-medium text-gray-900 mb-2">Avalanche Native Staking</h4>
           <p className="text-sm text-gray-600 mb-4">
             Direct validator delegation, 6.72% APR with Stakely
           </p>
           <Link 
             href="/stake"
             onClick={() => setSelectedChain('avalanche')}
             className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
           >
             Stake AVAX
           </Link>
         </div>
       </div>
     </div>
   </div>
 );
}