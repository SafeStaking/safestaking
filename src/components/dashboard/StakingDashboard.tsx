import React, { useState, useEffect } from 'react';
import NumberFlow from '@number-flow/react';
import { useStaking } from '../../hooks/useStaking';
import { useDynamic } from '../../hooks/useDynamic';

export default function StakingDashboard() {
  const { primaryWallet } = useDynamic();
  const { 
    balance, 
    userStats, 
    contractStats, 
    feePercentage, 
    isLoading, 
    refreshData 
  } = useStaking();

  // Animation state
  const [animatedValues, setAnimatedValues] = useState({
    stETHBalance: 0,
    ethBalance: 0,
    totalValue: 0,
    feePercentage: 0,
    dailyReward: 0,
    yearlyReward: 0,
    stakedAmount: 0,
    feePaid: 0,
    stethReceived: 0,
    totalStaked: 0,
    totalStethDistributed: 0,
    totalFeesCollected: 0,
    totalUsers: 0,
  });

  const [dataLoaded, setDataLoaded] = useState(false);

  const formatNumber = (num: string | number, decimals: number = 4): number => {
    const parsed = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(parsed)) return 0;
    return parsed;
  };

  const calculateDailyReward = (): number => {
    if (!balance?.stETHBalance) return 0;
    const stETHAmount = parseFloat(balance.stETHBalance);
    const estimatedAPR = 3.2;
    return (stETHAmount * (estimatedAPR / 100)) / 365;
  };

  const calculateYearlyReward = (): number => {
    if (!balance?.stETHBalance) return 0;
    const stETHAmount = parseFloat(balance.stETHBalance);
    const estimatedAPR = 3.2;
    return stETHAmount * (estimatedAPR / 100);
  };

  // Initial data load when wallet connects
  useEffect(() => {
    if (primaryWallet?.address && !dataLoaded) {
      console.log('Loading initial data for wallet:', primaryWallet.address);
      refreshData()
        .then(() => {
          console.log('Data loaded successfully');
          setDataLoaded(true);
        })
        .catch(error => {
          console.error('Failed to load initial data:', error);
          setDataLoaded(true); // Set to true even on error to show the UI
        });
    }
  }, [primaryWallet?.address, dataLoaded]);

  // Animate values when data loads or changes
  useEffect(() => {
    if (dataLoaded && !isLoading) {
      console.log('Updating animated values with data:', {
        balance,
        userStats,
        contractStats,
        feePercentage
      });

      const timer = setTimeout(() => {
        setAnimatedValues({
          stETHBalance: formatNumber(balance?.stETHBalance || '0'),
          ethBalance: formatNumber(balance?.ethBalance || '0'),
          totalValue: formatNumber(balance?.totalValue || '0'),
          feePercentage: feePercentage || 0,
          dailyReward: calculateDailyReward(),
          yearlyReward: calculateYearlyReward(),
          stakedAmount: formatNumber(userStats?.stakedAmount || '0'),
          feePaid: formatNumber(userStats?.feePaid || '0', 6),
          stethReceived: formatNumber(userStats?.stethReceived || '0'),
          totalStaked: formatNumber(contractStats?.totalStaked || '0'),
          totalStethDistributed: formatNumber(contractStats?.totalStethDistributed || '0'),
          totalFeesCollected: formatNumber(contractStats?.totalFeesCollected || '0', 6),
          totalUsers: contractStats?.totalUsers || 0,
        });
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [balance, userStats, contractStats, feePercentage, isLoading, dataLoaded]);

  const handleRefresh = async () => {
    console.log('Manual refresh triggered');
    
    // Reset values to 0 for animation
    setAnimatedValues({
      stETHBalance: 0,
      ethBalance: 0,
      totalValue: 0,
      feePercentage: 0,
      dailyReward: 0,
      yearlyReward: 0,
      stakedAmount: 0,
      feePaid: 0,
      stethReceived: 0,
      totalStaked: 0,
      totalStethDistributed: 0,
      totalFeesCollected: 0,
      totalUsers: 0,
    });

    try {
      await refreshData();
      console.log('Refresh completed successfully');
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  // Show loading skeleton only when initially loading
  if (isLoading && !dataLoaded) {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex justify-between items-center py-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* stETH Balance */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 hover:bg-white/80 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">stETH Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              <NumberFlow 
                value={animatedValues.stETHBalance} 
                format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
              />
            </p>
            <p className="text-sm text-gray-500">
              ≈ <NumberFlow 
                value={animatedValues.totalValue} 
                format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                suffix=" ETH"
              />
            </p>
          </div>
        </div>

        {/* ETH Balance */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 hover:bg-white/80 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25l-6.25-3.75z"/>
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">ETH Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              <NumberFlow 
                value={animatedValues.ethBalance} 
                format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
              />
            </p>
            <p className="text-sm text-gray-500">Available to stake</p>
          </div>
        </div>

        {/* Daily Rewards */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 hover:bg-white/80 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Daily Rewards</p>
            <p className="text-2xl font-bold text-green-600">
              +<NumberFlow 
                value={animatedValues.dailyReward} 
                format={{ minimumFractionDigits: 6, maximumFractionDigits: 6 }}
              />
            </p>
            <p className="text-sm text-gray-500">ETH per day</p>
          </div>
        </div>

        {/* Platform Fee */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 hover:bg-white/80 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Platform Fee</p>
            <p className="text-2xl font-bold text-orange-600">
              <NumberFlow 
                value={animatedValues.feePercentage} 
                format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                suffix="%"
              />
            </p>
            <p className="text-sm text-gray-500">SafeStaking fee</p>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Your Portfolio */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Portfolio</h3>
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
            {/* Wallet */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Wallet</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {primaryWallet?.address?.slice(0, 6)}...{primaryWallet?.address?.slice(-4)}
              </span>
            </div>
            
            {/* ETH Balance */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">ETH Balance</span>
              <span className="font-medium">
                <NumberFlow 
                  value={animatedValues.ethBalance} 
                  format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                  suffix=" ETH"
                />
              </span>
            </div>
            
            {/* stETH Balance */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">stETH Balance</span>
              <span className="font-medium">
                <NumberFlow 
                  value={animatedValues.stETHBalance} 
                  format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                  suffix=" stETH"
                />
              </span>
            </div>
            
            {/* Show user stats only if they have actually staked */}
            {userStats && parseFloat(userStats.stakedAmount) > 0 ? (
              <>
                {/* Total Staked */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Staked via SafeStaking</span>
                  <span className="font-medium">
                    <NumberFlow 
                      value={animatedValues.stakedAmount} 
                      format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                      suffix=" ETH"
                    />
                  </span>
                </div>
                
                {/* Fees Paid */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Fees Paid</span>
                  <span className="font-medium text-orange-600">
                    <NumberFlow 
                      value={animatedValues.feePaid} 
                      format={{ minimumFractionDigits: 6, maximumFractionDigits: 6 }}
                      suffix=" ETH"
                    />
                  </span>
                </div>

                {/* stETH Received */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total stETH Received</span>
                  <span className="font-medium text-green-600">
                    <NumberFlow 
                      value={animatedValues.stethReceived} 
                      format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                      suffix=" stETH"
                    />
                  </span>
                </div>
              </>
            ) : (
              <div className="py-6 text-center">
                <p className="text-gray-500 mb-4">You haven't staked through SafeStaking yet</p>
                <a href="/stake" className="inline-block px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Start Staking
                </a>
              </div>
            )}
            
            {/* Yearly Reward Projection */}
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Projected Yearly Rewards</span>
              <span className="font-medium text-green-600">
                +<NumberFlow 
                  value={animatedValues.yearlyReward} 
                  format={{ minimumFractionDigits: 6, maximumFractionDigits: 6 }}
                  suffix=" ETH"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Statistics</h3>
          
          <div className="space-y-4">
            {/* Show real contract stats or loading message */}
            {contractStats ? (
              <>
                {/* Total Staked */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total ETH Staked</span>
                  <span className="font-medium">
                    <NumberFlow 
                      value={animatedValues.totalStaked} 
                      format={{ 
                        minimumFractionDigits: 3, 
                        maximumFractionDigits: 3,
                        notation: animatedValues.totalStaked >= 1000 ? 'compact' : 'standard'
                      }}
                      suffix=" ETH"
                    />
                  </span>
                </div>

                {/* Total stETH Distributed */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total stETH Distributed</span>
                  <span className="font-medium">
                    <NumberFlow 
                      value={animatedValues.totalStethDistributed} 
                      format={{ 
                        minimumFractionDigits: 3, 
                        maximumFractionDigits: 3,
                        notation: animatedValues.totalStethDistributed >= 1000 ? 'compact' : 'standard'
                      }}
                      suffix=" stETH"
                    />
                  </span>
                </div>
                
                {/* Total Users */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-medium">
                    <NumberFlow 
                      value={animatedValues.totalUsers} 
                      format={{ notation: 'standard' }}
                    />
                  </span>
                </div>
                
                {/* Total Fees */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Fees Collected</span>
                  <span className="font-medium text-green-600">
                    <NumberFlow 
                      value={animatedValues.totalFeesCollected} 
                      format={{ minimumFractionDigits: 6, maximumFractionDigits: 6 }}
                      suffix=" ETH"
                    />
                  </span>
                </div>

                {/* Fee Receiver */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Fee Receiver</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {contractStats.feeReceiver?.slice(0, 6)}...{contractStats.feeReceiver?.slice(-4)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading platform statistics...</p>
              </div>
            )}
            
            {/* Protocol Info */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Underlying Protocol</span>
              <span className="font-medium">Lido Finance</span>
            </div>
            
            {/* Network */}
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Network</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="font-medium">Ethereum Mainnet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Transparency Section - Only show if user has staking history */}
      {userStats && parseFloat(userStats.stakedAmount) > 0 && (
        <div className="bg-gradient-to-r from-orange-50/70 to-yellow-50/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Fee Transparency
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                <NumberFlow 
                  value={animatedValues.stakedAmount} 
                  format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                  suffix=" ETH"
                />
              </p>
              <p className="text-gray-600 font-medium">Total Staked by You</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600 mb-2">
                <NumberFlow 
                  value={animatedValues.feePaid} 
                  format={{ minimumFractionDigits: 6, maximumFractionDigits: 6 }}
                  suffix=" ETH"
                />
              </p>
              <p className="text-gray-600 font-medium">Total Fees Paid</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 mb-2">
                <NumberFlow 
                  value={animatedValues.stakedAmount > 0 ? (animatedValues.feePaid / animatedValues.stakedAmount) * 100 : 0} 
                  format={{ minimumFractionDigits: 3, maximumFractionDigits: 3 }}
                  suffix="%"
                />
              </p>
              <p className="text-gray-600 font-medium">Effective Fee Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}