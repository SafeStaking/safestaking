import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const SAFE_STAKING_ADDRESS = '0x0D9EfFbc5D0C09d7CAbDc5d052250aDd25EcC19f';
const STETH_ADDRESS = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';

// **FIXED: Correct ABI matching your actual contract**
const SAFE_STAKING_ABI = [
  'function stake() external payable',
  'function calculateFee(uint256 _ethAmount) external view returns (uint256 feeAmount, uint256 stakeAmount)',
  'function getUserStats(address _user) external view returns (uint256 stakedAmount, uint256 feePaid, uint256 stethReceived)',
  'function getContractStats() external view returns (uint256 _totalStaked, uint256 _totalFeesCollected, uint256 _totalStethDistributed, uint256 _totalUsers, uint256 _currentFeeBps, address _feeReceiver)'
];

const ERC20_ABI = [
  'function balanceOf(address owner) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)'
];

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
  
  const [feePercentage, setFeePercentage] = useState(2.0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStaking, setIsStaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProvider = useCallback(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/your-api-key');
  }, []);

  const getSigner = useCallback(async () => {
    if (!primaryWallet?.connector) throw new Error('No wallet connected');
    const provider = getProvider();
    return await provider.getSigner();
  }, [primaryWallet, getProvider]);

  const getContract = useCallback(async (needsSigner = false) => {
    const provider = getProvider();
    if (needsSigner) {
      const signer = await getSigner();
      return new ethers.Contract(SAFE_STAKING_ADDRESS, SAFE_STAKING_ABI, signer);
    }
    return new ethers.Contract(SAFE_STAKING_ADDRESS, SAFE_STAKING_ABI, provider);
  }, [getProvider, getSigner]);

  const fetchBalance = useCallback(async () => {
    if (!primaryWallet?.address) return;
    
    try {
      const provider = getProvider();
      const stethContract = new ethers.Contract(STETH_ADDRESS, ERC20_ABI, provider);
      
      const [ethBal, stethBal] = await Promise.all([
        provider.getBalance(primaryWallet.address),
        stethContract.balanceOf(primaryWallet.address)
      ]);
      
      const ethBalance = ethers.formatEther(ethBal);
      const stETHBalance = ethers.formatEther(stethBal);
      
      setBalance({
        ethBalance,
        stETHBalance,
        totalValue: (parseFloat(ethBalance) + parseFloat(stETHBalance)).toString()
      });
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, [primaryWallet?.address, getProvider]);

  const fetchUserStats = useCallback(async () => {
    if (!primaryWallet?.address) return;
    
    try {
      const contract = await getContract();
      
      // **FIXED: Use correct function from your contract**
      const [stakedAmount, feePaid, stethReceived] = await contract.getUserStats(primaryWallet.address);
      
      setUserStats({
        stakedAmount: ethers.formatEther(stakedAmount),
        feePaid: ethers.formatEther(feePaid),
        stethReceived: ethers.formatEther(stethReceived)
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, [primaryWallet?.address, getContract]);

  const fetchContractStats = useCallback(async () => {
    try {
      const contract = await getContract();
      
      // **FIXED: Use correct function from your contract**
      const [
        totalStaked,
        totalFeesCollected,
        totalStethDistributed,
        totalUsers,
        currentFeeBps,
        feeReceiver
      ] = await contract.getContractStats();
      
      setContractStats({
        totalStaked: ethers.formatEther(totalStaked),
        totalStethDistributed: ethers.formatEther(totalStethDistributed),
        totalFeesCollected: ethers.formatEther(totalFeesCollected),
        totalUsers: Number(totalUsers),
        currentFeeBps: Number(currentFeeBps),
        feeReceiver
      });
      
      // **FIXED: Calculate fee percentage from basis points**
      setFeePercentage(Number(currentFeeBps) / 100); // Convert BPS to percentage
    } catch (error) {
      console.error('Error fetching contract stats:', error);
    }
  }, [getContract]);

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchBalance(),
      fetchUserStats(),
      fetchContractStats()
    ]);
  }, [fetchBalance, fetchUserStats, fetchContractStats]);

  const estimateGas = useCallback(async (amount: string): Promise<string> => {
    try {
      // Always return fallback for invalid amounts
      if (!primaryWallet?.address || !amount || parseFloat(amount) <= 0 || parseFloat(amount) < 0.001) {
        return '0.003';
      }

      // Only try gas estimation for valid amounts that won't fail
      const provider = getProvider();
      const balance = await provider.getBalance(primaryWallet.address);
      const balanceFormatted = parseFloat(ethers.formatEther(balance));
      
      // If user doesn't have enough for the amount, don't estimate gas
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
      return '0.003'; // Always return fallback
    }
  }, [primaryWallet?.address, getContract, getProvider]);

  const hasSufficientBalance = useCallback(async (amount: string): Promise<boolean> => {
    try {
      if (!primaryWallet?.address || !amount || parseFloat(amount) <= 0) {
        return false;
      }

      // **FIXED: Use correct minimum from your contract (0.001 ETH)**
      if (parseFloat(amount) < 0.001) {
        return false;
      }

      const provider = getProvider();
      const ethBalance = await provider.getBalance(primaryWallet.address);
      const ethBalanceFormatted = parseFloat(ethers.formatEther(ethBalance));
      
      const gasEstimate = await estimateGas(amount);
      const totalRequired = parseFloat(amount) + parseFloat(gasEstimate);
      
      // Check if user has enough ETH for stake amount + gas
      return ethBalanceFormatted >= totalRequired;
    } catch (error) {
      console.error('Balance check error:', error);
      return false;
    }
  }, [primaryWallet?.address, getProvider, estimateGas]);

  const calculateFee = useCallback(async (amount: string) => {
    try {
      if (!amount || parseFloat(amount) <= 0) return null;
      
      const contract = await getContract();
      const amountWei = ethers.parseEther(amount);
      
      // **FIXED: Your contract returns tuple (feeAmount, stakeAmount)**
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
      
      const tx = await contract.stake({ value: amountWei });
      const receipt = await tx.wait();
      
      await refreshData();
      
      return {
        hash: receipt.hash,
        blockExplorerUrl: `https://etherscan.io/tx/${receipt.hash}`,
        ...feeBreakdown,
        stETHReceived: feeBreakdown.stakeAmount
      };
    } catch (error: any) {
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

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        await refreshData();
      } finally {
        setIsLoading(false);
      }
    };

    if (primaryWallet?.address) {
      initialize();
    } else {
      setIsLoading(false);
    }
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