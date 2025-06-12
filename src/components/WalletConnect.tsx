'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';

const WalletConnect: React.FC = () => {
  const { 
    account, 
    isLoading, 
    login, 
    logout, 
    isConnected, 
    getUserInfo, 
    error, 
    reconnect,
    isInitialized 
  } = useWeb3Auth();
  
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isConnected) {
        try {
          const info = await getUserInfo();
          setUserInfo(info); 
        } catch (err) {
          console.error('Error fetching user info:', err);
        }
      }
    };
    fetchUserInfo();
  }, [isConnected, getUserInfo]);

  const handleConnect = async () => {
    try {
      await login();
    } catch (err: any) {
      console.error('Connection error:', err);
    }
  };

  const handleReconnect = async () => {
    try {
      await reconnect();
    } catch (err: any) {
      console.error('Reconnection error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">
          {isInitialized ? 'Connecting...' : 'Initializing Web3Auth...'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Status Indicator */}
      <div className="flex items-center space-x-2 text-sm">
        <div className={`w-3 h-3 rounded-full ${
          isInitialized ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className="text-gray-600">
          Web3Auth {isInitialized ? 'Ready' : 'Not Ready'}
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <div className="flex items-start space-x-2">
            <span className="text-red-500 text-lg">⚠️</span>
            <div className="flex-1">
              <p className="text-red-700 text-sm font-medium">{error}</p>
              
              {/* Specific error help */}
              {error.includes('Configuration error') && (
                <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
                  <p className="font-semibold">Quick Fix:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Go to <a href="https://dashboard.web3auth.io/" target="_blank" rel="noopener noreferrer" className="underline">Web3Auth Dashboard</a></li>
                    <li>Create a new project</li>
                    <li>Add <code className="bg-red-200 px-1 rounded">http://localhost:3000</code> to whitelist</li>
                    <li>Copy your Client ID</li>
                    <li>Add to <code className="bg-red-200 px-1 rounded">.env.local</code>: <br/>
                        <code className="bg-red-200 px-1 rounded text-xs">NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_client_id</code>
                    </li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
              )}
              
              {error.includes('Network error') && (
                <div className="mt-2 text-xs text-red-600">
                  <p>• Check your internet connection</p>
                  <p>• Try refreshing the page</p>
                  <p>• Disable any VPN or proxy</p>
                </div>
              )}
              
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={handleReconnect}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded"
                >
                  Retry
                </button>
                <button
                  onClick={() => setShowDebugInfo(!showDebugInfo)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                >
                  {showDebugInfo ? 'Hide' : 'Show'} Debug Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Information */}
      {showDebugInfo && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-w-md text-xs">
          <h4 className="font-semibold mb-2">Debug Information:</h4>
          <div className="space-y-1 font-mono">
            <p>Initialized: {isInitialized ? '✅' : '❌'}</p>
            <p>Connected: {isConnected ? '✅' : '❌'}</p>
            <p>Account: {account || 'None'}</p>
            <p>Client ID: {process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ? '✅ Set' : '❌ Missing'}</p>
            <p>Environment: {process.env.NODE_ENV}</p>
            <p>Origin: {typeof window !== 'undefined' ? window.location.origin : 'Unknown'}</p>
          </div>
        </div>
      )}

      {/* Main Connection Interface */}
      <div className="flex items-center space-x-4">
        {isConnected ? (
          <div className="flex items-center space-x-4">
            {userInfo && (
              <div className="flex items-center space-x-2">
                {userInfo.profileImage && (
                  <img
                    src={userInfo.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-600">
                  {userInfo.name || userInfo.email || 'User'}
                </span>
              </div>
            )}
            <div className="bg-green-100 px-4 py-2 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-green-800">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={handleConnect}
              disabled={isLoading || !isInitialized}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>
            
            {!isInitialized && (
              <p className="text-xs text-gray-500 text-center">
                Waiting for Web3Auth to initialize...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Environment Notice */}
      {!process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-500">⚠️</span>
            <div className="text-xs text-yellow-800">
              <p className="font-semibold">Using Demo Configuration</p>
              <p>For production, please set up your own Web3Auth project and add the Client ID to your environment variables.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;