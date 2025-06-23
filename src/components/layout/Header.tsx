'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { useDynamic } from '../../hooks/useDynamic';

interface HeaderProps {
  currentPage?: 'home' | 'dashboard' | 'stake' | 'blog';
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, walletConnected, primaryWallet } = useDynamic();
  const router = useRouter();

  const isConnected = !!primaryWallet && !!primaryWallet.address;

  const navItems = [
    { name: 'How It Works', href: '/#how-it-works', key: 'how-it-works' },
    ...(isConnected ? [
      { name: 'Dashboard', href: '/dashboard', key: 'dashboard' },
      { name: 'Stake ETH', href: '/stake', key: 'stake' },
    ] : []),
    { name: 'Blog', href: '/blog', key: 'blog' },
     { name: 'FAQ', href: '/#faq', key: 'faq' },
  ];

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg shadow-black/5">
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo */}
            <div className="flex items-center space-x-8 ">
              <Link href="/" className="flex items-center">
                <div className="w-16 h-16 ">
                  <img 
                    src="/logo.svg" 
                    alt="SafeStaking Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-2xl relative -ml-3 mr-3 font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  SafeStaking
                </span>
              </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`text-md font-medium transition-colors duration-200 ${
                    currentPage === item.key
                      ? 'text-gray-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dynamic Widget for Desktop */}
            <div className="hidden md:block">
              <DynamicWidget />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/80 backdrop-blur-xl border-t border-white/30 rounded-b-2xl p-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`transition-colors ${
                    currentPage === item.key
                      ? 'text-gray-900 font-medium'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Dynamic Widget */}
              <div className="pt-4 border-t border-gray-200/50">
                <DynamicWidget />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}