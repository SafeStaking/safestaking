'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';
import { ethers } from 'ethers';
import { getContract, LIDO_CONTRACT_ADDRESS, LIDO_ABI } from '../lib/contracts';

const StakingInterface: React.FC = () => {
  const { provider, account, isConnected } = useWeb3Auth();
  const [stakeAmount, setStakeAmount] = useState('');
  const [stEthBalance, setStEthBalance] = useState('0');
  const [ethBalance, setEthBalance] = useState('0');
  const [isStaking, setIsStaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isConnected && provider) {
      fetchBalances();
    }
  }, [isConnected, provider, account]);

  const fetchBalances = async () => {
    if (!provider || !account) return;

    try {
      setIsLoading(true);
      setError('');
      
      const ethersProvider = new ethers.providers.Web3Provider(provider as any);
      
      // Get ETH balance
      const ethBal = await ethersProvider.getBalance(account);
      setEthBalance(ethers.utils.formatEther(ethBal));
      
      // Get stETH balance
      const contract = getContract(LIDO_CONTRACT_ADDRESS, LIDO_ABI, ethersProvider);
      const stEthBal = await contract.balanceOf(account);
      setStEthBalance(ethers.utils.formatEther(stEthBal));
      
    } catch (error) {
      console.error('Error fetching balances:', error);
      setError('Failed to fetch balances');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStake = async () => {
    if (!provider || !stakeAmount || parseFloat(stakeAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(stakeAmount) > parseFloat(ethBalance)) {
      setError('Insufficient ETH balance');
      return;
    }

    try {
      setIsStaking(true);
      setError('');
      
      const ethersProvider = new ethers.providers.Web3Provider(provider as any);
      const signer = ethersProvider.getSigner();
      const contract = getContract(LIDO_CONTRACT_ADDRESS, LIDO_ABI, signer);

      // Estimate gas first
      const gasEstimate = await contract.estimateGas.submit(ethers.constants.AddressZero, {
        value: ethers.utils.parseEther(stakeAmount),
      });

      const tx = await contract.submit(ethers.constants.AddressZero, {
        value: ethers.utils.parseEther(stakeAmount),
        gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
      });

      await tx.wait();
      
      // Refresh balances after successful stake
      await fetchBalances();
      setStakeAmount('');
      
      alert('Staking successful! 🎉');
    } catch (error: any) {
      console.error('Staking error:', error);
      setError(error.reason || error.message || 'Staking failed');
    } finally {
      setIsStaking(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-yellow-700">
            Please connect your wallet to start staking ETH and earning rewards.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Stake ETH with Lido</h2>
      
      {/* Balances */}
      <div className="mb-6 space-y-3">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ETH Balance:</span>
            <span className="font-semibold text-green-700">
              {isLoading ? '...' : parseFloat(ethBalance).toFixed(4)} ETH
            </span>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">stETH Balance:</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-blue-700">
                {isLoading ? '...' : parseFloat(stEthBalance).toFixed(4)} stETH
              </span>
              <button
                onClick={fetchBalances}
                className="text-blue-600 hover:text-blue-800 text-sm"
                disabled={isLoading}
                title="Refresh balances"
              >
                🔄
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Staking Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to Stake (ETH)
        </label>
        <div className="relative">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => {
              setStakeAmount(e.target.value);
              setError('');
            }}
            placeholder="0.1"
            step="0.01"
            min="0"
            max={ethBalance}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
          />
          <button
            onClick={() => setStakeAmount(ethBalance)}
            className="absolute right-2 top-2 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            MAX
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Available: {parseFloat(ethBalance).toFixed(4)} ETH
        </p>
      </div>

      {/* Stake Button */}
      <button
        onClick={handleStake}
        disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) <= 0 || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {isStaking ? 'Staking...' : 'Stake ETH'}
      </button>

      {/* Info */}
      <div className="mt-4 text-sm text-gray-600 text-center space-y-1">
        <p>✨ Staking through Lido protocol</p>
        <p>🎯 You&apos;ll receive stETH tokens that automatically earn rewards</p>
        <p>📈 Current APR: ~3-5% (varies with network conditions)</p>
      </div>
    </div>
  );
};

export default StakingInterface;