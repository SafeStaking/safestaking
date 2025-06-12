import { useState, useEffect, useCallback } from 'react';
import { web3auth } from '../lib/web3auth'; // Adjust path as needed
import type { IProvider } from "@web3auth/base";

interface UseWeb3AuthReturn {
  provider: IProvider | null;
  account: string;
  isConnected: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  reconnect: () => Promise<void>;
}

export const useWeb3Auth = (): UseWeb3AuthReturn => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Initialize Web3Auth
  const initializeWeb3Auth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('🔄 Initializing Web3Auth...');
      
      if (!web3auth) {
        throw new Error('Web3Auth instance not found');
      }

      // Add timeout for initialization
      const initPromise = web3auth.initModal();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Initialization timeout')), 10000)
      );

      await Promise.race([initPromise, timeoutPromise]);
      setIsInitialized(true);
      
      console.log('✅ Web3Auth initialized successfully');
      
      // Check if already connected
      if (web3auth.connected) {
        const web3authProvider = web3auth.provider;
        if (web3authProvider) {
          setProvider(web3authProvider);
          await getAccount(web3authProvider);
          setIsConnected(true);
          console.log('✅ Auto-connected to existing session');
        }
      }
    } catch (err: any) {
      console.error('❌ Web3Auth initialization error:', err);
      let errorMessage = 'Failed to initialize Web3Auth';
      
      if (err.message?.includes('timeout')) {
        errorMessage = 'Initialization timeout - please check your internet connection';
      } else if (err.message?.includes('Client ID') || err.message?.includes('400')) {
        errorMessage = 'Configuration error: Please set up your own Web3Auth Client ID';
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to Web3Auth services';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get account address from provider
  const getAccount = async (web3authProvider: IProvider): Promise<string> => {
    try {
      const ethers = await import('ethers');
      const ethersProvider = new ethers.ethers.providers.Web3Provider(web3authProvider as any);
      const signer = ethersProvider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      return address;
    } catch (err) {
      console.error('Error getting account:', err);
      return '';
    }
  };

  // Login function
  const login = async (): Promise<void> => {
    try {
      if (!web3auth || !isInitialized) {
        throw new Error('Web3Auth not initialized');
      }

      setIsLoading(true);
      setError('');
      
      console.log('🔄 Attempting to connect...');
      
      const web3authProvider = await web3auth.connect();
      
      if (web3authProvider) {
        setProvider(web3authProvider);
        await getAccount(web3authProvider);
        setIsConnected(true);
        console.log('✅ Successfully connected');
      } else {
        throw new Error('Failed to get provider from Web3Auth');
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      let errorMessage = 'Failed to connect wallet';
      
      if (err.message?.includes('User closed the modal')) {
        errorMessage = 'Connection cancelled by user';
      } else if (err.message?.includes('popup')) {
        errorMessage = 'Popup blocked. Please allow popups for this site';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsConnected(false);
      setProvider(null);
      setAccount('');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      if (!web3auth || !isConnected) {
        return;
      }

      setIsLoading(true);
      console.log('🔄 Disconnecting...');
      
      await web3auth.logout();
      
      setProvider(null);
      setAccount('');
      setIsConnected(false);
      setError('');
      
      console.log('✅ Successfully disconnected');
    } catch (err: any) {
      console.error('❌ Logout error:', err);
      setError('Failed to disconnect');
    } finally {
      setIsLoading(false);
    }
  };

  // Get user info
  const getUserInfo = async (): Promise<any> => {
    try {
      if (!web3auth || !isConnected) {
        return null;
      }
      
      const userInfo = await web3auth.getUserInfo();
      return userInfo;
    } catch (err) {
      console.error('Error getting user info:', err);
      return null;
    }
  };

  // Reconnect function
  const reconnect = async (): Promise<void> => {
    setError('');
    setIsConnected(false);
    setProvider(null);
    setAccount('');
    await initializeWeb3Auth();
  };

  // Initialize on mount
  useEffect(() => {
    initializeWeb3Auth();
  }, [initializeWeb3Auth]);

  return {
    provider,
    account,
    isConnected,
    isLoading,
    isInitialized,
    error,
    login,
    logout,
    getUserInfo,
    reconnect,
  };
};