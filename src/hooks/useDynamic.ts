import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useDynamic() {
  const { 
    user, 
    primaryWallet, 
    handleLogOut,
    isAuthenticated: dynamicIsAuthenticated,
    walletConnector
  } = useDynamicContext();
  
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic Labs connection state
  const isAuthenticated = !!user && !!primaryWallet;
  const walletConnected = !!primaryWallet && !!primaryWallet.address;

  // Auto-redirect to dashboard after successful wallet connection (only once per session)
  useEffect(() => {
    if (mounted && walletConnected) {
      const currentPath = router.pathname;
      const walletAddress = primaryWallet?.address;
      
      // Only redirect from home page
      if (currentPath === '/') {
        // Check if we've already redirected for this wallet address
        const redirectKey = `safestaking_redirected_${walletAddress}`;
        const hasAlreadyRedirected = sessionStorage.getItem(redirectKey);
        
        if (!hasAlreadyRedirected) {
          console.log('✅ First time connecting this wallet from home page - redirecting to dashboard');
          
          // Mark as redirected for this session
          sessionStorage.setItem(redirectKey, 'true');
          
          // Redirect to dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 100);
        } else {
          console.log('🏠 Wallet already redirected in this session - staying on home page');
        }
      }
    }
  }, [mounted, walletConnected, primaryWallet?.address, router]);

  // Clean up redirect flags when wallet disconnects
  useEffect(() => {
    if (!walletConnected) {
      // Clear all redirect flags when wallet disconnects
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('safestaking_redirected_')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }, [walletConnected]);

  const logout = async () => {
    try {
      // Clear redirect flags before logout
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('safestaking_redirected_')) {
          sessionStorage.removeItem(key);
        }
      });
      
      await handleLogOut();
      console.log('👋 Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return {
    // User info
    user,
    primaryWallet,
    isAuthenticated,
    walletConnected,
    walletAddress: primaryWallet?.address,
    
    // Actions
    logout,
    
    // State
    mounted,
    
    // Debug info
    dynamicIsAuthenticated,
    walletConnector
  };
}