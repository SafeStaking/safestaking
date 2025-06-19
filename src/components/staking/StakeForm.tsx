import React, { useState, useEffect } from 'react';
import { useStaking } from '../../hooks/useStaking';
import { useDynamic } from '../../hooks/useDynamic';

interface StakeFormProps {
  onStakeSuccess?: (txHash: string, amount: string) => void;
}

export default function StakeForm({ onStakeSuccess }: StakeFormProps) {
  const { primaryWallet, walletConnected } = useDynamic();
  const { 
    stake, 
    isStaking, 
    error, 
    clearError, 
    estimateGas, 
    calculateFee,
    hasSufficientBalance,
    feePercentage,
    isLoading 
  } = useStaking();

  const [amount, setAmount] = useState('');
  const [estimatedGas, setEstimatedGas] = useState('0.003');
  const [showMinimumError, setShowMinimumError] = useState(false);
  const [showInsufficientError, setShowInsufficientError] = useState(false);
  const [feeBreakdown, setFeeBreakdown] = useState<{
    feeAmount: string;
    stakeAmount: string;
    feePercentage: number;
  } | null>(null);
  
  // Transaction feedback state
  const [txState, setTxState] = useState<{
    showSuccess: boolean;
    showConfirming: boolean;
    txHash: string;
    stakeDetails: any;
  }>({
    showSuccess: false,
    showConfirming: false,
    txHash: '',
    stakeDetails: null,
  });

  // Update estimates and validation when amount changes
  useEffect(() => {
    const validateAndEstimate = async () => {
      if (amount && parseFloat(amount) > 0 && walletConnected) {
        try {
          // Check minimum amount (0.001 ETH)
          const isMinimumMet = parseFloat(amount) >= 0.001;
          setShowMinimumError(!isMinimumMet);

          // Check sufficient balance
          if (isMinimumMet) {
            const hasSufficient = await hasSufficientBalance(amount);
            setShowInsufficientError(!hasSufficient);
          } else {
            setShowInsufficientError(false);
          }

          // Calculate fee breakdown
          if (isMinimumMet) {
            const feeData = await calculateFee(amount);
            if (feeData) {
              setFeeBreakdown(feeData);
            }
          } else {
            setFeeBreakdown(null);
          }

          // Estimate gas
          const gas = await estimateGas(amount);
          setEstimatedGas(gas);
          
        } catch (error) {
          console.error('Error updating estimates:', error);
          setEstimatedGas('0.015');
          setFeeBreakdown(null);
          setShowInsufficientError(true);
        }
      } else {
        setEstimatedGas('0.015');
        setFeeBreakdown(null);
        setShowMinimumError(false);
        setShowInsufficientError(false);
      }
    };

    const debounce = setTimeout(validateAndEstimate, 500);
    return () => clearTimeout(debounce);
  }, [amount, calculateFee, estimateGas, hasSufficientBalance, walletConnected]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow valid decimal numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      clearError();
      setTxState(prev => ({ ...prev, showSuccess: false }));
    }
  };

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!walletConnected) {
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    // Don't proceed if validation errors exist
    if (showMinimumError || showInsufficientError) {
      return;
    }

    try {
      // Show confirming state
      setTxState(prev => ({ 
        ...prev, 
        showConfirming: true, 
        showSuccess: false 
      }));

      const result = await stake(amount);
      
      if (result) {
        // Show success state
        setTxState({
          showSuccess: true,
          showConfirming: false,
          txHash: result.hash,
          stakeDetails: result,
        });
        
        setAmount('');
        
        // Call success callback
        onStakeSuccess?.(result.hash, amount);
        
        // Auto-hide success message after 15 seconds
        setTimeout(() => {
          setTxState(prev => ({ ...prev, showSuccess: false }));
        }, 15000);
      }
    } catch (error) {
      console.error('Staking failed:', error);
      setTxState(prev => ({ 
        ...prev, 
        showConfirming: false 
      }));
    }
  };

  const calculateRewards = () => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    const annualReward = parseFloat(amount) * (3.2 / 100); // 3.2% APR
    return (annualReward / 12).toFixed(6); // Monthly reward
  };

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Show wallet connection prompt if not connected
  if (!walletConnected) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-4">
            Please connect your wallet to start staking ETH with SafeStaking on Ethereum Mainnet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Stake ETH with SafeStaking</h2>
        <p className="text-gray-600">
          Stake your ETH through our secure wrapper with transparent fee structure.
        </p>
        <div className="mt-2 px-3 py-1 bg-green-100 border border-green-300 rounded-md inline-block">
          <p className="text-sm text-green-800">
            <span className="font-medium">🚀 Ethereum Mainnet</span> - Live production environment
          </p>
        </div>
      </div>

    

      {/* Transaction Confirming State */}
      {txState.showConfirming && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg className="animate-spin w-5 h-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div>
              <p className="text-blue-800 font-medium">Transaction Confirming...</p>
              <p className="text-blue-600 text-sm">
                Please wait while your transaction is being processed on Ethereum Mainnet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {txState.showSuccess && txState.stakeDetails && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1">
              <p className="text-green-800 font-medium">Staking Successful! 🎉</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-green-700">
                  <span className="font-medium">Amount Staked:</span> {txState.stakeDetails.stakeAmount} ETH
                </p>
                <p className="text-green-700">
                  <span className="font-medium">Platform Fee:</span> {txState.stakeDetails.feeAmount} ETH
                </p>
                <p className="text-green-700">
                  <span className="font-medium">stETH Received:</span> {txState.stakeDetails.stETHReceived} stETH
                </p>
                <p className="text-green-600">
                  <span className="font-medium">Transaction:</span>
                  <a 
                    href={txState.stakeDetails.blockExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 underline hover:text-green-800"
                  >
                    {txState.txHash.slice(0, 10)}...{txState.txHash.slice(-8)}
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

      <form onSubmit={handleStake} className="space-y-6">
        {/* Amount Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount to Stake (ETH)
            </label>
            <span className="text-sm text-gray-500">
              Minimum: 0.001 ETH
            </span>
          </div>
          
          <div className="relative">
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.001"
              className={`w-full px-4 py-3 border rounded-lg text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                (showMinimumError || showInsufficientError) ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isStaking || txState.showConfirming}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <span className="text-gray-500 font-medium">ETH</span>
            </div>
          </div>

          {/* Validation Error Messages */}
          {showMinimumError && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-yellow-800 text-sm font-medium">
                  Minimum stake amount is 0.001 ETH
                </p>
              </div>
            </div>
          )}

          {showInsufficientError && !showMinimumError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-800 text-sm font-medium">
                  Insufficient ETH balance (including gas fees)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fee Breakdown */}
        {amount && parseFloat(amount) > 0 && feeBreakdown && !showMinimumError && !showInsufficientError && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-gray-900">Transaction Breakdown</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">You pay:</span>
                <span className="font-medium">{amount} ETH</span>
              </div>
              
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">SafeStaking fee ({feeBreakdown.feePercentage.toFixed(2)}%):</span>
                <span className="font-medium text-orange-600">-{feeBreakdown.feeAmount} ETH</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Amount staked with Lido:</span>
                <span className="font-medium text-green-600">{feeBreakdown.stakeAmount} ETH</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">You receive:</span>
                <span className="font-medium">~{feeBreakdown.stakeAmount} stETH</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Gas:</span>
                <span className="font-medium text-red-600">{estimatedGas} ETH</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Current APR:</span>
                <span className="font-medium text-green-600">3.20%</span>
              </div>
              
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Est. monthly rewards:</span>
                <span className="font-medium text-green-600">+{calculateRewards()} ETH</span>
              </div>
              
              <div className="flex justify-between border-t pt-2 font-medium">
                <span className="text-gray-900">Total Cost:</span>
                <span className="text-red-600">{(parseFloat(amount) + parseFloat(estimatedGas)).toFixed(6)} ETH</span>
              </div>
            </div>
          </div>
        )}

        {/* Stake Button */}
        <button
          type="submit"
          disabled={
            isStaking || 
            txState.showConfirming ||
            !amount || 
            parseFloat(amount) <= 0 || 
            parseFloat(amount) < 0.001 ||
            !walletConnected ||
            showMinimumError ||
            showInsufficientError
          }
          className={`w-full py-3 px-4 rounded-lg font-medium text-lg transition-colors duration-200 ${
            isStaking || 
            txState.showConfirming || 
            !amount || 
            parseFloat(amount) <= 0 || 
            parseFloat(amount) < 0.001 || 
            !walletConnected ||
            showMinimumError ||
            showInsufficientError
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isStaking || txState.showConfirming ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {txState.showConfirming ? 'Confirming...' : 'Staking...'}
            </div>
          ) : (
            'Stake ETH'
          )}
        </button>
      </form>

      {/* Info Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h4 className="font-medium text-blue-900">SafeStaking Wrapper</h4>
          </div>
          <p className="text-sm text-blue-800">
            Your ETH is staked through our secure wrapper contract with transparent fee collection before forwarding to Lido.
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h4 className="font-medium text-green-900">Transparent Fees</h4>
          </div>
          <p className="text-sm text-green-800">
            Platform fee: {feePercentage.toFixed(2)}% - clearly displayed before each transaction with detailed breakdown.
          </p>
        </div>
      </div>

      {/* Contract Information */}
      <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Contract Information</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium">SafeStaking Wrapper:</span> 0x0D9EfFbc5D0C09d7CAbDc5d052250aDd25EcC19f</p>
          <p><span className="font-medium">Lido stETH:</span> 0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84</p>
          <p><span className="font-medium">Network:</span> Ethereum Mainnet (Chain ID: 1)</p>
        </div>
      </div>
    </div>
  );
}