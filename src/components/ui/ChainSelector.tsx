import React from 'react';

interface ChainSelectorProps {
  selectedChain: 'ethereum' | 'avalanche';
  onChainChange: (chain: 'ethereum' | 'avalanche') => void;
  className?: string;
}

export default function ChainSelector({ selectedChain, onChainChange, className = '' }: ChainSelectorProps) {
  return (
    <div className={`flex bg-gray-100 rounded-3xl p-1 ${className}`}>
      <button
        onClick={() => onChainChange('ethereum')}
        className={`flex-1 px-4 py-3 rounded-3xl text-sm font-medium transition-all duration-200 ${
          selectedChain === 'ethereum'
            ? 'bg-white text-gray-900 shadow-sm transform scale-[1.02]'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Ethereum</span>
        </div>
      </button>
      
      <button
        onClick={() => onChainChange('avalanche')}
        className={`flex-1 px-4 py-3 rounded-3xl text-sm font-medium transition-all duration-200 ${
          selectedChain === 'avalanche'
            ? 'bg-white text-gray-900 shadow-sm transform scale-[1.02]'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Avalanche</span>
        </div>
     </button>
    </div>
  );
}