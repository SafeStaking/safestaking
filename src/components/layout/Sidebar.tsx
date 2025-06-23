'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { useDynamic } from '../../hooks/useDynamic';

interface SidebarProps {
  currentPage?: 'dashboard' | 'stake';
}

// Icons for the sidebar
const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21V7h8v14H8z" />
  </svg>
);

const StakeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const PortfolioIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const HistoryIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AnalyticsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HelpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const CollapseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export default function Sidebar({ currentPage = 'dashboard' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { primaryWallet, logout } = useDynamic();
  const router = useRouter();

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      icon: DashboardIcon,
      description: 'Overview & Analytics'
    },
    {
      id: 'stake',
      name: 'Stake ETH',
      href: '/stake',
      icon: StakeIcon,
      description: 'Stake your ETH'
    },
    {
      id: 'history',
      name: 'History',
      href: '/history',
      icon: HistoryIcon,
      description: 'Transaction history'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      href: '/analytics',
      icon: AnalyticsIcon,
      description: 'Performance metrics'
    }
  ];

  const bottomMenuItems = [
    {
      id: 'settings',
      name: 'Settings',
      href: '/settings',
      icon: SettingsIcon,
      description: 'Account settings'
    },
    {
      id: 'help',
      name: 'Help & Support',
      href: '/help',
      icon: HelpIcon,
      description: 'Get help'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`fixed top-6 left-6 z-50 md:hidden p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-lg transition-all duration-300 ${
          isMobileOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <Link href="/" className="flex items-center space-x-1">
                  <div className="w-12 h-12">
                    <img 
                      src="/logo.svg" 
                      alt="SafeStaking Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xl relative -ml-5 pr-3 font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    SafeStaking
                  </span>
                </Link>
              )}
              
              {!isCollapsed && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
                >
                  <CollapseIcon className="w-5 h-5 text-gray-600" />
                </button>
              )}
              
              {isCollapsed && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors mx-auto"
                >
                  <CollapseIcon className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Wallet Widget */}
          {!isCollapsed && (
            <div className="px-6 py-4 border-b border-gray-200/50">
              <div className="flex justify-center">
                <DynamicWidget />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 py-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPage === item.id || router.pathname === item.href;
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200/50 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className={`flex-shrink-0 w-5 h-5 ${
                    isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  
                  {!isCollapsed && (
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                        {isActive && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  )}
                  
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="px-6">
            <div className="border-t border-gray-200/50"></div>
          </div>

          {/* Bottom Menu */}
          <div className="px-3 py-4 space-y-1">
            {bottomMenuItems.map((item) => {
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200 relative"
                >
                  <IconComponent className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                  
                  {!isCollapsed && (
                    <div className="ml-3">
                      <span>{item.name}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  )}
                  
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}