import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const SAFE_STAKING_ADDRESS = '0x0D9EfFbc5D0C09d7CAbDc5d052250aDd25EcC19f';
const STETH_ADDRESS = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';

// Updated ABI with correct function signatures
const SAFE_STAKING_ABI = [
  'function stake() external payable',
  'function calculateFee(uint256 _ethAmount) external view returns (uint256 feeAmount, uint256 stakeAmount)',
  'function getUserStats(address _user) external view returns (uint256 stakedAmount, uint256 feePaid, uint256 stethReceived)',
  'function getContractStats() external view returns (uint256 _totalStaked, uint256 _totalFeesCollected, uint256 _totalStethDistributed, uint256 _totalUsers, uint256 _currentFeeBps, address _feeReceiver)',
  'function currentFeeBps() external view returns (uint256)',
  'function feeReceiver() external view returns (address)'
];

const ERC20_ABI = [
  'function balanceOf(address owner) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)'
];

// Ethereum mainnet configuration
const ETHEREUM_CONFIG = {
  chainId: '0x1',
  chainName: 'Ethereum Mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.infura.io/v3/YOUR_KEY'],
  blockExplorerUrls: ['https://etherscan.io/'],
};

export function useStaking() {
  const { primaryWallet } = useDynamicContext();
  
  const [balance, setBalance] = useState<{
    ethBalance: string;
    stETHBalance: string;
    totalValue: string;
  } | null>(null);
  
  const [userStats, setUserStats] = useState<{
    stakedAmount: string;
    feePaid: string;
    stethReceived: string;
  } | null>(null);
  
  const [contractStats, setContractStats] = useState<{
    totalStaked: string;
    totalStethDistributed: string;
    totalFeesCollected: string;
    totalUsers: number;
    currentFeeBps: number;
    feeReceiver: string;
  } | null>(null);
  
  const [feePercentage, setFeePercentage] = useState(0.5); // Default fallback
  const [isLoading, setIsLoading] = useState(true);
  const [isStaking, setIsStaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure Ethereum network
  const ensureEthereumNetwork = useCallback(async (provider: ethers.BrowserProvider): Promise<boolean> => {
    try {
      const network = await provider.getNetwork();
      
      if (network.chainId !== BigInt(1)) {
        console.log('Switching to Ethereum mainnet...');
        
        try {
          await provider.send("wallet_switchEthereumChain", [{ 
            chainId: ETHEREUM_CONFIG.chainId 
          }]);
          return true;
        } catch (switchError: any) {
          console.error('Failed to switch to Ethereum:', switchError);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Network check failed:', error);
      return false;
    }
  }, []);

  // Get provider with network validation
  const getProvider = useCallback(async (): Promise<ethers.BrowserProvider | null> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.error('No Ethereum provider found');
      return null;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const networkSwitched = await ensureEthereumNetwork(provider);
      
      if (!networkSwitched) {
        throw new Error('Failed to connect to Ethereum network');
      }
      
      return provider;
    } catch (error) {
      console.error('Provider error:', error);
      return null;
    }
  }, [ensureEthereumNetwork]);

  const getSigner = useCallback(async () => {
    if (!primaryWallet?.connector) throw new Error('No wallet connected');
    const provider = await getProvider();
    if (!provider) throw new Error('Provider not available');
    return await provider.getSigner();
  }, [primaryWallet, getProvider]);

  const getContract = useCallback(async (needsSigner = false) => {
    if (needsSigner) {
      const signer = await getSigner();
      return new ethers.Contract(SAFE_STAKING_ADDRESS, SAFE_STAKING_ABI, signer);
    } else {
      const provider = await getProvider();
      if (!provider) throw new Error('Provider not available');
      return new ethers.Contract(SAFE_STAKING_ADDRESS, SAFE_STAKING_ABI, provider);
    }
  }, [getSigner, getProvider]);

  // Fetch balances with improved error handling
  const fetchBalance = useCallback(async () => {
    if (!primaryWallet?.address) {
      console.log('No wallet address available');
      return;
    }
    
    try {
      console.log('Fetching balances for:', primaryWallet.address);
      
      const provider = await getProvider();
      if (!provider) {
        throw new Error('Provider not available');
      }

      // Get ETH balance
      let ethBalance = '0';
      try {
        const ethBal = await provider.getBalance(primaryWallet.address);
        ethBalance = ethers.formatEther(ethBal);
        console.log('ETH balance:', ethBalance);
      } catch (error) {
        console.error('Error fetching ETH balance:', error);
      }

      // Get stETH balance
      let stETHBalance = '0';
      try {
        const stethContract = new ethers.Contract(STETH_ADDRESS, ERC20_ABI, provider);
        const stethBal = await stethContract.balanceOf(primaryWallet.address);
        stETHBalance = ethers.formatEther(stethBal);
        console.log('stETH balance:', stETHBalance);
      } catch (error) {
        console.error('Error fetching stETH balance:', error);
        // Don't throw, just log the error
      }
      
      const totalValue = (parseFloat(ethBalance) + parseFloat(stETHBalance)).toString();
      
      setBalance({
        ethBalance,
        stETHBalance,
        totalValue
      });
      
      console.log('Balances updated successfully');
      
    } catch (error: any) {
      console.error('Error fetching balances:', error);
      setError(`Failed to fetch balances: ${error.message}`);
      
      // Set default values on error
      setBalance({
        ethBalance: '0.0000',
        stETHBalance: '0.0000',
        totalValue: '0.0000'
      });
    }
  }, [primaryWallet?.address, getProvider]);

  // Fetch user stats with error handling
  const fetchUserStats = useCallback(async () => {
    if (!primaryWallet?.address) {
      console.log('No wallet address for user stats');
      return;
    }
    
    try {
      console.log('Fetching user stats for:', primaryWallet.address);
      
      const contract = await getContract();
      const [stakedAmount, feePaid, stethReceived] = await contract.getUserStats(primaryWallet.address);
      
      const stats = {
        stakedAmount: ethers.formatEther(stakedAmount),
        feePaid: ethers.formatEther(feePaid),
        stethReceived: ethers.formatEther(stethReceived)
      };
      
      setUserStats(stats);
      console.log('User stats updated:', stats);
      
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      // Set default values on error
      setUserStats({
        stakedAmount: '0',
        feePaid: '0',
        stethReceived: '0'
      });
    }
  }, [primaryWallet?.address, getContract]);

  // Fetch contract stats with error handling
  const fetchContractStats = useCallback(async () => {
    try {
      console.log('Fetching contract stats...');
      
      const contract = await getContract();
      
      const [
        totalStaked,
        totalFeesCollected,
        totalStethDistributed,
        totalUsers,
        currentFeeBps,
        feeReceiver
      ] = await contract.getContractStats();
      
      const stats = {
        totalStaked: ethers.formatEther(totalStaked),
        totalStethDistributed: ethers.formatEther(totalStethDistributed),
        totalFeesCollected: ethers.formatEther(totalFeesCollected),
        totalUsers: Number(totalUsers),
        currentFeeBps: Number(currentFeeBps),
        feeReceiver: feeReceiver
      };
      
      setContractStats(stats);
      
      // Update fee percentage from contract
      const feePercentageFromContract = Number(currentFeeBps) / 100;
      setFeePercentage(feePercentageFromContract);
      
      console.log('Contract stats updated:', stats);
      console.log('Fee percentage from contract:', feePercentageFromContract);
      
    } catch (error: any) {
      console.error('Error fetching contract stats:', error);
      
      // Try to get fee percentage separately if main call fails
      try {
        const contract = await getContract();
        const feeBps = await contract.currentFeeBps();
        const feePercentageFromContract = Number(feeBps) / 100;
        setFeePercentage(feePercentageFromContract);
        console.log('Fee percentage fetched separately:', feePercentageFromContract);
      } catch (feeError) {
        console.error('Failed to fetch fee percentage separately:', feeError);
        setFeePercentage(0.5); // Fallback to 0.5%
      }
      
      // Set default values for other stats
      setContractStats({
        totalStaked: '0',
        totalStethDistributed: '0',
        totalFeesCollected: '0',
        totalUsers: 0,
        currentFeeBps: 50, // Default 0.5%
        feeReceiver: '0x0000000000000000000000000000000000000000'
      });
    }
  }, [getContract]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    console.log('Refreshing all data...');
    setError(null);
    
    try {
      await Promise.all([
        fetchBalance(),
        fetchUserStats(),
        fetchContractStats()
      ]);
      console.log('All data refreshed successfully');
    } catch (error: any) {
      console.error('Error refreshing data:', error);
      setError(`Failed to refresh data: ${error.message}`);
    }
  }, [fetchBalance, fetchUserStats, fetchContractStats]);

  // Estimate gas for staking
  const estimateGas = useCallback(async (amount: string): Promise<string> => {
    try {
      if (!primaryWallet?.address || !amount || parseFloat(amount) <= 0 || parseFloat(amount) < 0.001) {
        return '0.003';
      }

      const provider = await getProvider();
      if (!provider) return '0.003';

      const balance = await provider.getBalance(primaryWallet.address);
      const balanceFormatted = parseFloat(ethers.formatEther(balance));
      
      if (parseFloat(amount) > balanceFormatted) {
        return '0.003';
      }

      const contract = await getContract(true);
      const amountWei = ethers.parseEther(amount);
      
      const gasEstimate = await contract.stake.estimateGas({ value: amountWei });
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');
      
      const totalGasCost = (gasEstimate * gasPrice * BigInt(120)) / BigInt(100);
      
      return ethers.formatEther(totalGasCost);
    } catch (error) {
      console.error('Gas estimation error:', error);
      return '0.003';
    }
  }, [primaryWallet?.address, getContract, getProvider]);

  // Check sufficient balance
  const hasSufficientBalance = useCallback(async (amount: string): Promise<boolean> => {
    try {
      if (!primaryWallet?.address || !amount || parseFloat(amount) <= 0) {
        return false;
      }

      if (parseFloat(amount) < 0.001) {
        return false;
      }

      const provider = await getProvider();
      if (!provider) return false;

      const ethBalance = await provider.getBalance(primaryWallet.address);
      const ethBalanceFormatted = parseFloat(ethers.formatEther(ethBalance));
      
      const gasEstimate = await estimateGas(amount);
      const totalRequired = parseFloat(amount) + parseFloat(gasEstimate);
      
      return ethBalanceFormatted >= totalRequired;
    } catch (error) {
      console.error('Balance check error:', error);
      return false;
    }
  }, [primaryWallet?.address, getProvider, estimateGas]);

  // Calculate fee
  const calculateFee = useCallback(async (amount: string) => {
    try {
      if (!amount || parseFloat(amount) <= 0) return null;
      
      const contract = await getContract();
      const amountWei = ethers.parseEther(amount);
      
      const [feeAmountWei, stakeAmountWei] = await contract.calculateFee(amountWei);
      
      const feeAmount = ethers.formatEther(feeAmountWei);
      const stakeAmount = ethers.formatEther(stakeAmountWei);
      
      return {
        feeAmount,
        stakeAmount,
        feePercentage
      };
    } catch (error) {
      console.error('Fee calculation error:', error);
      return null;
    }
  }, [getContract, feePercentage]);

  // Stake function
  const stake = useCallback(async (amount: string) => {
    if (!primaryWallet?.address) throw new Error('No wallet connected');
    
    setIsStaking(true);
    setError(null);
    
    try {
      const hasBalance = await hasSufficientBalance(amount);
      if (!hasBalance) {
        throw new Error('Insufficient ETH balance (including gas fees)');
      }

      const contract = await getContract(true);
      const amountWei = ethers.parseEther(amount);
      
      const feeBreakdown = await calculateFee(amount);
      if (!feeBreakdown) throw new Error('Failed to calculate fees');
      
      console.log('Submitting stake transaction:', { amount, feeBreakdown });
      
      const tx = await contract.stake({ value: amountWei });
      console.log('Transaction submitted:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);
      
      // Refresh data after successful staking
      setTimeout(() => {
        refreshData();
      }, 2000);
      
      return {
        hash: receipt.hash,
        blockExplorerUrl: `https://etherscan.io/tx/${receipt.hash}`,
        ...feeBreakdown,
        stETHReceived: feeBreakdown.stakeAmount
      };
    } catch (error: any) {
      console.error('Staking error:', error);
      const errorMessage = error?.reason || error?.message || 'Transaction failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsStaking(false);
    }
  }, [primaryWallet?.address, getContract, calculateFee, refreshData, hasSufficientBalance]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize data when wallet connects
  useEffect(() => {
    const initialize = async () => {
      if (primaryWallet?.address) {
        console.log('Initializing staking data for wallet:', primaryWallet.address);
        setIsLoading(true);
        
        try {
          await refreshData();
        } catch (error) {
          console.error('Failed to initialize data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('No wallet connected, clearing data');
        setIsLoading(false);
        setBalance(null);
        setUserStats(null);
        setContractStats(null);
        setFeePercentage(0.5);
      }
    };

    initialize();
  }, [primaryWallet?.address, refreshData]);

  return {
    balance,
    userStats,
    contractStats,
    feePercentage,
    stake,
    refreshData,
    estimateGas,
    calculateFee,
    hasSufficientBalance,
    clearError,
    isLoading,
    isStaking,
    error
  };
}