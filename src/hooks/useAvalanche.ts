import { useState, useCallback, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ethers } from 'ethers';

// Avalanche network configuration
const AVALANCHE_CONFIG = {
  chainId: '0xa86a', // 43114 in hex
  chainName: 'Avalanche Network',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowtrace.io/'],
};

// P-Chain specific configuration
const P_CHAIN_CONFIG = {
  rpcUrl: 'https://api.avax.network/ext/P',
  networkID: 1,
  blockchainID: 'P',
};

interface AvalancheBalance {
  cChainBalance: string;
  pChainBalance: string;
  totalBalance: string;
}

interface StakingPosition {
  nodeID: string;
  stakeAmount: string;
  startTime: Date;
  endTime: Date;
  rewardAddress: string;
  isActive: boolean;
  daysRemaining: number;
  estimatedRewards: string;
}

interface StakingTransaction {
  txId: string;
  amount: string;
  duration: number;
  timestamp: Date;
  blockExplorerUrl: string;
}

interface StakingStats {
  totalStaked: string;
  totalRewards: string;
  activePositions: number;
  totalPositions: number;
}

interface StakelyConfig {
  nodeID: string;
  name: string;
  minStake: number;
  minDuration: number;
  maxDuration: number;
  commission: number;
  safestakingFee: number;
  apr: number;
  apy: number;
  totalStaked: number;
}

export const STAKELY_VALIDATOR_ID = 'NodeID-6na5rkzi37wtt5piHV62y11XYfN2kTsTH';

export const STAKELY_CONFIG: StakelyConfig = {
  nodeID: STAKELY_VALIDATOR_ID,
  name: 'Stakely',
  minStake: 25,
  minDuration: 14,
  maxDuration: 365,
  commission: 5,
  safestakingFee: 0,
  apr: 6.72,
  apy: 6.94,
  totalStaked: 45004.14
};

export const DURATION_OPTIONS = [
  { label: '2 weeks', value: 14, recommended: false },
  { label: '1 month', value: 30, recommended: false },
  { label: '3 months', value: 90, recommended: true },
  { label: '6 months', value: 180, recommended: false },
  { label: '1 year', value: 365, recommended: false }
];

export const calculateStakingRewards = (amount: number, durationDays: number) => {
  const yearlyRewards = amount * (STAKELY_CONFIG.apr / 100);
  const dailyRewards = yearlyRewards / 365;
  const totalRewards = dailyRewards * durationDays;
  const effectiveAPR = (totalRewards / amount) * (365 / durationDays) * 100;

  return {
    totalRewards,
    dailyRewards,
    effectiveAPR
  };
};

export const validateStakingParams = (amount: string, duration: number) => {
  const errors: string[] = [];
  const numAmount = parseFloat(amount);

  if (!amount || isNaN(numAmount)) {
    errors.push('Please enter a valid amount');
  } else if (numAmount < STAKELY_CONFIG.minStake) {
    errors.push(`Minimum stake is ${STAKELY_CONFIG.minStake} AVAX`);
  }

  if (duration < STAKELY_CONFIG.minDuration) {
    errors.push(`Minimum duration is ${STAKELY_CONFIG.minDuration} days`);
  } else if (duration > STAKELY_CONFIG.maxDuration) {
    errors.push(`Maximum duration is ${STAKELY_CONFIG.maxDuration} days`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility function to ensure Avalanche network
const ensureAvalancheNetwork = async (provider: ethers.BrowserProvider): Promise<boolean> => {
  try {
    const network = await provider.getNetwork();
    
    if (network.chainId !== BigInt(43114)) {
      console.log('Switching to Avalanche network...');
      
      try {
        await provider.send("wallet_switchEthereumChain", [{ 
          chainId: AVALANCHE_CONFIG.chainId 
        }]);
        return true;
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await provider.send("wallet_addEthereumChain", [AVALANCHE_CONFIG]);
          return true;
        }
        throw switchError;
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to switch to Avalanche network:', error);
    return false;
  }
};

export function useAvalanche() {
  const { primaryWallet } = useDynamicContext();
  
  const [balance, setBalance] = useState<AvalancheBalance | null>(null);
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get provider with error handling
  const getProvider = useCallback(async (): Promise<ethers.BrowserProvider | null> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No Ethereum provider found');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const networkSwitched = await ensureAvalancheNetwork(provider);
      
      if (!networkSwitched) {
        throw new Error('Failed to connect to Avalanche network');
      }
      
      return provider;
    } catch (error) {
      console.error('Provider error:', error);
      throw error;
    }
  }, []);

  // Get Avalanche balances with improved error handling
  const fetchBalances = useCallback(async () => {
    if (!primaryWallet?.address) {
      console.log('No wallet address available');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching balances for:', primaryWallet.address);
      
      const provider = await getProvider();
      if (!provider) {
        throw new Error('Failed to get provider');
      }

      // Get C-Chain balance with retry logic
      let cChainBalance = '0';
      try {
        const balance = await provider.getBalance(primaryWallet.address);
        cChainBalance = ethers.formatEther(balance);
        console.log('C-Chain balance:', cChainBalance);
      } catch (balanceError) {
        console.error('Error getting C-Chain balance:', balanceError);
        // Don't throw, just log and continue with 0 balance
      }
      
      // P-Chain balance (placeholder - requires P-Chain API)
      const pChainBalance = '0.0000';
      const totalBalance = (parseFloat(cChainBalance) + parseFloat(pChainBalance)).toFixed(4);
      
      setBalance({
        cChainBalance,
        pChainBalance,
        totalBalance
      });
      
      console.log('Balances updated:', { cChainBalance, pChainBalance, totalBalance });
      
    } catch (error: any) {
      console.error('Error fetching Avalanche balances:', error);
      setError(`Failed to fetch balances: ${error.message}`);
      
      // Set default values on error
      setBalance({
        cChainBalance: '0.0000',
        pChainBalance: '0.0000',
        totalBalance: '0.0000'
      });
    } finally {
      setIsLoading(false);
    }
  }, [primaryWallet?.address, getProvider]);

  // Mock staking positions (will be implemented with real P-Chain data)
  const fetchStakingPositions = useCallback(async () => {
    try {
      // For now, return empty array - will be implemented with P-Chain API
      setStakingPositions([]);
      console.log('Staking positions fetched (mock)');
    } catch (error) {
      console.error('Error fetching staking positions:', error);
    }
  }, []);

  // Check if user has sufficient balance
  const hasSufficientBalance = useCallback(async (amount: string): Promise<boolean> => {
    try {
      if (!balance || !amount) {
        console.log('No balance or amount provided');
        return false;
      }
      
      const requiredAmount = parseFloat(amount);
      const availableBalance = parseFloat(balance.cChainBalance);
      const estimatedGasFee = 0.002; // Conservative estimate
      
      const hasBalance = availableBalance >= (requiredAmount + estimatedGasFee);
      console.log('Balance check:', { 
        required: requiredAmount, 
        available: availableBalance, 
        hasBalance 
      });
      
      return hasBalance;
    } catch (error) {
      console.error('Balance check error:', error);
      return false;
    }
  }, [balance]);

  // Improved staking function with better error handling
  const stakeWithStakely = useCallback(async (
    amount: string, 
    durationDays: number
  ): Promise<StakingTransaction> => {
    if (!primaryWallet?.address) {
      throw new Error('No wallet connected');
    }
    
    const validation = validateStakingParams(amount, durationDays);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    const hasBalance = await hasSufficientBalance(amount);
    if (!hasBalance) {
      throw new Error('Insufficient AVAX balance for staking and gas fees');
    }
    
    setIsStaking(true);
    setError(null);
    
    try {
      console.log('Starting staking process:', { 
        amount, 
        durationDays, 
        validator: STAKELY_CONFIG.nodeID,
        wallet: primaryWallet.address
      });
      
      const provider = await getProvider();
      if (!provider) {
        throw new Error('Failed to get provider for staking');
      }

      // For now, this is a placeholder implementation
      // In production, this would interact with Avalanche P-Chain
      console.log('Simulating P-Chain staking transaction...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful transaction
      const mockTxId = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const transaction: StakingTransaction = {
        txId: mockTxId,
        amount,
        duration: durationDays,
        timestamp: new Date(),
        blockExplorerUrl: `https://snowtrace.io/tx/${mockTxId}`
      };
      
      console.log('Staking transaction successful:', transaction);
      
      // Refresh data after successful staking
      setTimeout(() => {
        fetchBalances();
        fetchStakingPositions();
      }, 1000);
      
      return transaction;
      
    } catch (error: any) {
      console.error('Staking error:', error);
      const errorMessage = error?.message || 'Staking transaction failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsStaking(false);
    }
  }, [primaryWallet, hasSufficientBalance, getProvider, fetchBalances, fetchStakingPositions]);

  // Get staking statistics
  const getStakingStats = useCallback((): StakingStats => {
    const totalStaked = stakingPositions.reduce(
      (sum, position) => sum + parseFloat(position.stakeAmount), 
      0
    );
    
    const totalRewards = stakingPositions.reduce(
      (sum, position) => sum + parseFloat(position.estimatedRewards), 
      0
    );
    
    const activePositions = stakingPositions.filter(p => p.isActive).length;
    
    return {
      totalStaked: totalStaked.toFixed(4),
      totalRewards: totalRewards.toFixed(6),
      activePositions,
      totalPositions: stakingPositions.length
    };
  }, [stakingPositions]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize data when wallet connects
  useEffect(() => {
    if (primaryWallet?.address) {
      console.log('Wallet connected, initializing Avalanche data...');
      fetchBalances();
      fetchStakingPositions();
    } else {
      console.log('No wallet connected');
      setBalance(null);
      setStakingPositions([]);
    }
  }, [primaryWallet?.address, fetchBalances, fetchStakingPositions]);

  return {
    // Data
    balance,
    stakingPositions,
    stakingStats: getStakingStats(),
    
    // Loading states
    isLoading,
    isStaking,
    error,
    
    // Actions
    stakeWithStakely,
    fetchBalances,
    fetchStakingPositions,
    hasSufficientBalance,
    clearError,
    
    // Configuration
    stakelyConfig: STAKELY_CONFIG,
    
    // Utilities
    calculateRewards: calculateStakingRewards,
    validateParams: validateStakingParams
  };
}