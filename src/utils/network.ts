// utils/network.ts
import { ethers } from 'ethers';

export interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export const AVALANCHE_MAINNET: NetworkConfig = {
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

export const ETHEREUM_MAINNET: NetworkConfig = {
  chainId: '0x1', // 1 in hex
  chainName: 'Ethereum Mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_KEY'],
  blockExplorerUrls: ['https://etherscan.io/'],
};

export class NetworkManager {
  private provider: ethers.BrowserProvider | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  async getCurrentNetwork(): Promise<{ chainId: number; name: string } | null> {
    if (!this.provider) return null;

    try {
      const network = await this.provider.getNetwork();
      return {
        chainId: Number(network.chainId),
        name: network.name
      };
    } catch (error) {
      console.error('Failed to get current network:', error);
      return null;
    }
  }

  async switchToNetwork(config: NetworkConfig): Promise<boolean> {
    if (!this.provider) {
      throw new Error('No Ethereum provider found');
    }

    try {
      // Try to switch to the network
      await this.provider.send("wallet_switchEthereumChain", [{ 
        chainId: config.chainId 
      }]);
      return true;
    } catch (switchError: any) {
      // If network doesn't exist (4902), add it
      if (switchError.code === 4902) {
        try {
          await this.provider.send("wallet_addEthereumChain", [config]);
          return true;
        } catch (addError) {
          console.error('Failed to add network:', addError);
          throw addError;
        }
      } else {
        console.error('Failed to switch network:', switchError);
        throw switchError;
      }
    }
  }

  async ensureNetwork(targetChainId: number): Promise<boolean> {
    const current = await this.getCurrentNetwork();
    
    if (!current) {
      throw new Error('Unable to detect current network');
    }

    if (current.chainId === targetChainId) {
      return true;
    }

    // Switch to target network
    const config = targetChainId === 43114 ? AVALANCHE_MAINNET : ETHEREUM_MAINNET;
    return await this.switchToNetwork(config);
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('No provider available');
    }

    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  isAvalanche(chainId: number): boolean {
    return chainId === 43114;
  }

  isEthereum(chainId: number): boolean {
    return chainId === 1;
  }
}

// Singleton instance
export const networkManager = new NetworkManager();

// Utility functions
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatAmount = (amount: string | number, decimals: number = 4): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.0000';
  return num.toFixed(decimals);
};

export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

export const waitForTransaction = async (txHash: string, provider: ethers.BrowserProvider): Promise<ethers.TransactionReceipt | null> => {
  try {
    return await provider.waitForTransaction(txHash);
  } catch (error) {
    console.error('Transaction failed:', error);
    return null;
  }
};

// Error handling utilities
export const parseWeb3Error = (error: any): string => {
  if (!error) return 'Unknown error occurred';
  
  // Handle common error patterns
  if (error.code === 4001) {
    return 'Transaction rejected by user';
  }
  
  if (error.code === -32602) {
    return 'Invalid parameters';
  }
  
  if (error.message?.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  
  if (error.message?.includes('gas')) {
    return 'Gas estimation failed';
  }
  
  if (error.message?.includes('revert')) {
    return 'Transaction would revert';
  }
  
  if (error.message?.includes('network')) {
    return 'Network connection error';
  }
  
  // Return the error message if available, otherwise a generic message
  return error.message || error.reason || 'Transaction failed';
};