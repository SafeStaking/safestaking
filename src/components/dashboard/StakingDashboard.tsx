import React from 'react';
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

  const formatNumber = (num: string | number, decimals: number = 4): string => {
    const parsed = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(parsed)) return '0';
    return parsed.toFixed(decimals);
  };

  const formatLargeNumber = (num: string | number): string => {
    const parsed = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(parsed)) return '0';
    
    if (parsed >= 1000000) {
      return `${(parsed / 1000000).toFixed(2)}M`;
    } else if (parsed >= 1000) {
      return `${(parsed / 1000).toFixed(2)}K`;
    }
    return parsed.toFixed(2);
  };

  const calculateDailyReward = (): string => {
    if (!balance?.stETHBalance) return '0';
    const stETHAmount = parseFloat(balance.stETHBalance);
    const estimatedAPR = 3.2; // Lido's approximate APR
    const dailyReward = (stETHAmount * (estimatedAPR / 100)) / 365;
    return dailyReward.toFixed(6);
  };

  const calculateYearlyReward = (): string => {
    if (!balance?.stETHBalance) return '0';
    const stETHAmount = parseFloat(balance.stETHBalance);
    const estimatedAPR = 3.2;
    const yearlyReward = stETHAmount * (estimatedAPR / 100);
    return yearlyReward.toFixed(4);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SafeStaking Dashboard</h1>
          <p className="text-gray-600">Monitor your stETH balance, rewards, and platform statistics</p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Mainnet Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium text-green-800">Live on Ethereum Mainnet</h4>
            <p className="text-green-700 text-sm">
              You are using real ETH on Ethereum Mainnet. All transactions involve actual value.
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* stETH Balance */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">stETH Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(balance?.stETHBalance || '0')}
              </p>
              <p className="text-sm text-gray-500">
                ≈ {formatNumber(balance?.totalValue || '0')} ETH Total
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Platform Fee */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Fee</p>
              <p className="text-2xl font-bold text-orange-600">
                {feePercentage.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-500">SafeStaking Fee</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* ETH Balance */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ETH Balance</p>
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(balance?.ethBalance || '0')}
              </p>
              <p className="text-sm text-gray-500">Available to Stake</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Daily Rewards */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Rewards</p>
              <p className="text-2xl font-bold text-purple-600">
                +{calculateDailyReward()}
              </p>
              <p className="text-sm text-gray-500">ETH per day</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Staking Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your SafeStaking Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Wallet Address</span>
              <span className="font-mono text-sm">
                {primaryWallet?.address?.slice(0, 6)}...{primaryWallet?.address?.slice(-4)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">ETH Balance</span>
              <span className="font-medium">{formatNumber(balance?.ethBalance || '0')} ETH</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">stETH Balance</span>
              <span className="font-medium">{formatNumber(balance?.stETHBalance || '0')} stETH</span>
            </div>
            
            {userStats && (
              <>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total Staked via SafeStaking</span>
                  <span className="font-medium">{formatNumber(userStats.stakedAmount)} ETH</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total Fees Paid</span>
                  <span className="font-medium text-orange-600">{formatNumber(userStats.feePaid, 6)} ETH</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total stETH Received</span>
                  <span className="font-medium text-green-600">{formatNumber(userStats.stethReceived)} stETH</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Projected Yearly Reward</span>
              <span className="font-medium text-green-600">+{calculateYearlyReward()} ETH</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Reward Mechanism</span>
              <span className="font-medium">Auto-compounding stETH</span>
            </div>
          </div>
        </div>

        {/* SafeStaking Platform Statistics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SafeStaking Platform Stats</h3>
          <div className="space-y-4">
            {contractStats ? (
              <>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total ETH Staked</span>
                  <span className="font-medium">{formatLargeNumber(contractStats.totalStaked)} ETH</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total stETH Distributed</span>
                  <span className="font-medium">{formatLargeNumber(contractStats.totalStethDistributed)} stETH</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total Fees Collected</span>
                  <span className="font-medium text-green-600">{formatNumber(contractStats.totalFeesCollected, 6)} ETH</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-medium">{contractStats.totalUsers.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Current Fee Rate</span>
                  <span className="font-medium">{(contractStats.currentFeeBps / 100).toFixed(2)}%</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Fee Receiver</span>
                  <span className="font-mono text-sm">
                    {contractStats.feeReceiver.slice(0, 6)}...{contractStats.feeReceiver.slice(-4)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading platform statistics...</p>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Underlying Protocol</span>
              <span className="font-medium">Lido Finance</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Platform Fee</span>
              <span className="font-medium text-orange-600">{feePercentage.toFixed(2)}%</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Network</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="font-medium">Ethereum Mainnet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Transparency Section */}
      {userStats && parseFloat(userStats.stakedAmount) > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Fee Transparency
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{formatNumber(userStats.stakedAmount)} ETH</p>
              <p className="text-sm text-gray-600">Total Staked by You</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{formatNumber(userStats.feePaid, 6)} ETH</p>
              <p className="text-sm text-gray-600">Total Fees Paid</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {((parseFloat(userStats.feePaid) / parseFloat(userStats.stakedAmount)) * 100).toFixed(3)}%
              </p>
              <p className="text-sm text-gray-600">Effective Fee Rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Staking Performance</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded">7D</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded">30D</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded">90D</button>
          </div>
        </div>
        
        {/* Chart placeholder */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500">Performance chart will be available</p>
            <p className="text-gray-400 text-sm">After comprehensive analytics integration</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Ready to stake more?</h3>
            <p className="text-blue-100">
              Continue earning rewards through SafeStaking's secure platform with transparent fees.
            </p>
            <p className="text-blue-200 text-sm mt-1">
              Platform fee: {feePercentage.toFixed(2)}% • Powered by Lido Protocol • Live on Mainnet
            </p>
          </div>
          <button
            onClick={() => window.location.hash = '#stake'}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Stake More ETH
          </button>
        </div>
      </div>
    </div>
  );
}