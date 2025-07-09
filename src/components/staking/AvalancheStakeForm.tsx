import React, { useState, useEffect } from 'react';
import NumberFlow from '@number-flow/react';
import { useAvalanche, DURATION_OPTIONS } from '../../hooks/useAvalanche';

interface AvalancheStakeFormProps {
  onStakeSuccess?: (txHash: string, amount: string) => void;
}

export default function AvalancheStakeForm({ onStakeSuccess }: AvalancheStakeFormProps) {
  const { 
    stakeWithStakely, 
    isLoading, 
    isStaking,
    error, 
    clearError, 
    stakelyConfig,
    balance,
    hasSufficientBalance,
    calculateRewards,
    validateParams,
    fetchBalances
  } = useAvalanche();

  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(90);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  // Validate inputs
  useEffect(() => {
    if (amount) {
      const validation = validateParams(amount, duration);
      setValidationErrors(validation.errors);
    } else {
      setValidationErrors([]);
    }
  }, [amount, duration, validateParams]);

  // Refresh balance when component mounts
  useEffect(() => {
    const refreshBalance = async () => {
      try {
        setIsBalanceLoading(true);
        await fetchBalances();
      } catch (error) {
        console.error('Failed to refresh balance:', error);
      } finally {
        setIsBalanceLoading(false);
      }
    };

    refreshBalance();
  }, [fetchBalances]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      clearError();
      setShowSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setShowSuccess(false);

    if (!amount || validationErrors.length > 0) {
      console.log('Form validation failed:', { amount, validationErrors });
      return;
    }

    try {
      // Check balance first
      console.log('Checking balance before staking...');
      const hasBalance = await hasSufficientBalance(amount);
      if (!hasBalance) {
        setValidationErrors(['Insufficient AVAX balance including gas fees']);
        return;
      }

      console.log('Starting staking process...');
      const result = await stakeWithStakely(amount, duration);
      
      console.log('Staking successful:', result);
      setLastTransaction(result);
      setShowSuccess(true);
      setAmount('');
      
      onStakeSuccess?.(result.txId, amount);
      
      // Auto-hide success after 15 seconds
      setTimeout(() => setShowSuccess(false), 15000);
      
    } catch (error: any) {
      console.error('Staking failed:', error);
      // Error is already set by the hook
    }
  };

  const rewards = amount ? calculateRewards(parseFloat(amount), duration) : null;
  const isFormValid = amount && parseFloat(amount) >= stakelyConfig.minStake && validationErrors.length === 0;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Stake AVAX</h1>
        <p className="text-gray-600 mb-2">
          Stake with Stakely validator - professional infrastructure with proven performance
        </p>
        <div className="mt-2 px-3 py-1 bg-red-100 border border-red-300 rounded-md inline-block">
          <p className="text-sm text-red-800">
            <span className="font-medium mx-2">Avalanche Mainnet</span>•
            <span className="font-medium mx-2">0% SafeStaking Fee</span>•
            <span className="font-medium mx-2">{stakelyConfig.apr}% APR</span>
          </p>
        </div>
      </div>

      {/* Network Status */}
      {isLoading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg className="animate-spin w-4 h-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-blue-800 text-sm">Connecting to Avalanche network...</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && lastTransaction && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1">
              <p className="text-green-800 font-medium">AVAX Staking Successful! 🎉</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-green-700">
                  <span className="font-medium">Amount Staked:</span> 
                  <NumberFlow 
                    value={parseFloat(lastTransaction.amount)} 
                    format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
                    suffix=" AVAX"
                  />
                </p>
                <p className="text-green-700">
                  <span className="font-medium">Duration:</span> {lastTransaction.duration} days
                </p>
                <p className="text-green-700">
                  <span className="font-medium">Validator:</span> Stakely
                </p>
                <p className="text-green-600">
                  <span className="font-medium">Transaction:</span>
                  <a 
                    href={lastTransaction.blockExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 underline hover:text-green-800"
                  >
                    {lastTransaction.txId.slice(0, 10)}...{lastTransaction.txId.slice(-8)}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-800 font-medium">Transaction Failed</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Balance Display */}
      {balance ? (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-blue-900">Your AVAX Balance</h3>
            {isBalanceLoading && (
              <svg className="animate-spin w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">C-Chain Balance:</p>
              <p className="font-medium">
                <NumberFlow 
                  value={parseFloat(balance.cChainBalance)} 
                  format={{ minimumFractionDigits: 4 }}
                  suffix=" AVAX"
                />
              </p>
            </div>
            <div>
              <p className="text-blue-700">Available to Stake:</p>
              <p className="font-medium">
                <NumberFlow 
                  value={Math.max(0, parseFloat(balance.cChainBalance) - 0.002)} 
                  format={{ minimumFractionDigits: 4 }}
                  suffix=" AVAX"
                />
              </p>
              <p className="text-xs text-blue-600">(minus gas estimate)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-yellow-800 text-sm">
              Please ensure you're connected to Avalanche network to view your balance.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Amount to Stake (AVAX)
            </label>
            <span className="text-sm text-gray-500">
              Minimum: {stakelyConfig.minStake} AVAX
            </span>
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder={stakelyConfig.minStake.toString()}
              className={`w-full px-4 py-3 border rounded-lg text-lg font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                validationErrors.length > 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isStaking || isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <span className="text-gray-500 font-medium">AVAX</span>
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              {validationErrors.map((error, index) => (
                <div key={index} className="flex items-center text-red-800 text-sm">
                  <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Staking Duration
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDuration(option.value)}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  duration === option.value
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
                {option.recommended && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full">
                    ⭐
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ⭐ = Recommended for optimal rewards
          </p>
        </div>

        {/* Staking Preview */}
        {amount && parseFloat(amount) >= stakelyConfig.minStake && rewards && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-gray-900">Staking Summary</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Stake Amount:</span>
                <span className="font-medium">
                  <NumberFlow 
                    value={parseFloat(amount)} 
                    format={{ minimumFractionDigits: 4 }}
                    suffix=" AVAX"
                  />
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{duration} days</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Validator:</span>
                <span className="font-medium">Stakely (...{stakelyConfig.nodeID.slice(-6)})</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">APR:</span>
                <span className="font-medium text-green-600">{stakelyConfig.apr}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Effective APR:</span>
                <span className="font-medium text-green-600">
                  <NumberFlow 
                    value={rewards.effectiveAPR} 
                    format={{ minimumFractionDigits: 2 }}
                    suffix="%"
                  />
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Validator Commission:</span>
                <span className="font-medium text-orange-600">{stakelyConfig.commission}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">SafeStaking Fee:</span>
                <span className="font-medium text-green-600">0% (Launch Promo)</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Rewards:</span>
                <span className="font-medium text-green-600">
                  +<NumberFlow 
                    value={rewards.dailyRewards} 
                    format={{ minimumFractionDigits: 6 }}
                    suffix=" AVAX"
                  />
                </span>
              </div>
              
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 font-medium">Total Estimated Rewards:</span>
                <span className="font-medium text-green-600">
                  +<NumberFlow 
                    value={rewards.totalRewards} 
                    format={{ minimumFractionDigits: 6 }}
                    suffix=" AVAX"
                  />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stake Button */}
        <button
          type="submit"
          disabled={!isFormValid || isStaking || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-lg transition-all duration-200 ${
            !isFormValid || isStaking || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {isStaking ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Staking with Stakely...
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Connecting...
            </div>
          ) : (
            'Stake with Stakely Validator'
          )}
        </button>
      </form>

      {/* Info Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h4 className="font-medium text-red-900">Stakely Validator</h4>
          </div>
          <p className="text-sm text-red-800">
            Professional infrastructure with {stakelyConfig.apr}% APR and proven track record. ${stakelyConfig.totalStaked.toLocaleString()} already staked.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h4 className="font-medium text-blue-900">No Slashing Risk</h4>
          </div>
          <p className="text-sm text-blue-800">
            Avalanche has no slashing mechanism - your staked AVAX is safe from validator penalties. Only lock period applies.
          </p>
        </div>
      </div>

      {/* Additional Network Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Network Status:</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-green-600 font-medium">Avalanche Mainnet</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Chain ID:</span>
          <span className="font-mono text-gray-700">43114</span>
        </div>
      </div>
    </div>
  );
}