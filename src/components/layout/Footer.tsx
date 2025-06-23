'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/70 backdrop-blur-sm  border-t border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-2">
             <Link href="/" className="flex items-center">
                             <div className="w-16 h-16">
                               <img 
                                 src="/logo.svg" 
                                 alt="SafeStaking Logo" 
                                 className="w-full h-full object-contain"
                               />
                             </div>
                             <span className="text-2xl relative -ml-3 font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                               SafeStaking
                             </span>
                           </Link>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Secure liquid staking with transparent fees. Built on Lido's proven protocol with enhanced fee management.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live on Ethereum Mainnet</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/stake" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Stake ETH
                </Link>
              </li>
              <li>
                <a href="https://etherscan.io/address/0x0D9EfFbc5D0C09d7CAbDc5d052250aDd25EcC19f" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Smart Contract
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://lido.fi" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Lido Protocol
                </a>
              </li>
              <li>
                <a href="https://ethereum.org" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Ethereum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-400">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-600">
              © {currentYear} SafeStaking. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}