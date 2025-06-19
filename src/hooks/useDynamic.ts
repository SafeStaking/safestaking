import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useEffect, useState } from 'react';

export function useDynamic() {
  const { 
    user, 
    primaryWallet, 
    handleLogOut,
    isAuthenticated: dynamicIsAuthenticated,
    walletConnector
  } = useDynamicContext();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic Labs connection state
  const isAuthenticated = !!user && !!primaryWallet;
  const walletConnected = !!primaryWallet && !!primaryWallet.address;
  
  return {
    // User info
    user,
    primaryWallet,
    isAuthenticated,
    walletConnected,
    walletAddress: primaryWallet?.address,
    
    // Actions
    logout: handleLogOut,
    
    // State
    mounted,
    
    // Debug info
    dynamicIsAuthenticated,
    walletConnector
  };
}