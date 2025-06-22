import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useDynamic } from '../hooks/useDynamic';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Utility function for className merging
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Simple Button Component (inline)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'lg' | 'sm';
}

const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
    ghost: "hover:bg-gray-100 text-gray-900",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8 py-6",
    sm: "h-9 px-3",
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Card Components (inline)
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn("rounded-lg border bg-white text-gray-900 shadow-sm", className)}
    {...props}
  />
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-6", className)} {...props} />
);

// Simple Icons (inline)
const ArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Play: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 18.5V21m-7.5-3h15" />
  </svg>
);

const Shield: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Smartphone: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
  </svg>
);

const Cpu: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const Lock: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Eye: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const Zap: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Wallet: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const MousePointer: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);

const TrendingUp: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const Building2: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const Users: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m0 0a4 4 0 017 0M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const FileText: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Headphones: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const Settings: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Simple Accordion Components (inline)
interface AccordionContextValue {
  openItem: string | null;
  setOpenItem: (value: string | null) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const AccordionItemContext = React.createContext<string | null>(null);

const Accordion: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
};

const AccordionItem: React.FC<{ value: string; className?: string; children: React.ReactNode }> = ({ value, className, children }) => (
  <AccordionItemContext.Provider value={value}>
    <div className={className}>{children}</div>
  </AccordionItemContext.Provider>
);

const AccordionTrigger: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  const context = React.useContext(AccordionContext);
  const itemValue = React.useContext(AccordionItemContext);
  
  if (!context || !itemValue) return null;
  
  const isOpen = context.openItem === itemValue;
  
  const handleClick = () => {
    context.setOpenItem(isOpen ? null : itemValue);
  };
  
  return (
    <button
      className={cn("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline w-full text-left", className)}
      onClick={handleClick}
    >
      {children}
      <svg
        className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

const AccordionContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  const context = React.useContext(AccordionContext);
  const itemValue = React.useContext(AccordionItemContext);
  
  if (!context || !itemValue) return null;
  
  const isOpen = context.openItem === itemValue;
  
  return (
    <div className={cn("overflow-hidden text-sm transition-all", isOpen ? "pb-4" : "hidden", className)}>
      {children}
    </div>
  );
};

// Hero Component
const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const { isAuthenticated, walletConnected, primaryWallet } = useDynamic();
  const isConnected = !!primaryWallet && !!primaryWallet.address;
  
  const rotatingTexts = ['Stake ETH.', 'Track positions.', 'Manage portfolios.', 'Grow confidently.'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 md:pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent leading-tight">
            The safest way to
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              stake crypto.
            </span>
          </h1>
          
          <div className="h-12 md:h-16 mb-6 md:mb-8 flex items-center justify-center">
            <p className="text-lg md:text-xl lg:text-2xl text-slate-700 font-medium">
              {rotatingTexts[currentText]}
            </p>
          </div>
          
          <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-12 max-w-2xl mx-auto">
            Stake confidently with decentralized infrastructure, full ownership, and transparent fees. SafeStaking never takes custody of user funds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isConnected ? (
              <Link href="/stake">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold group w-full sm:w-auto"
                >
                  Start Staking
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Link href="/stake">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold group w-full sm:w-auto"
                >
                  Start Staking
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold border-gray-300 hover:border-gray-400 group w-full sm:w-auto"
            >
              <Play className="mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Component
const Features = () => {
  const features = [
    {
      icon: Lock,
      title: 'Non-Custodial by Default',
      description: 'You keep full ownership of your assets — always.',
    },
    {
      icon: Cpu,
      title: 'Smart Wallet Infrastructure',
      description: 'Social login, email login, and user-controlled wallet UX via Dynamic.xyz',
    },
    {
      icon: Zap,
      title: 'Decentralized Staking Access',
      description: 'Staking is routed through decentralized infrastructure via audited contracts. Your wallet reflects your updated balance.*',
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Stake from anywhere, anytime — no extensions or wallets required.',
    },
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'Verified contracts, open logic, clear transaction history.',
    },
    {
      icon: Eye,
      title: 'Full Transparency',
      description: 'All transactions and fees are visible on-chain with detailed reporting.',
    },
  ];

  return (
    <section id="features" className="py-20 relative bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Why SafeStaking?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Built with security, transparency, and user experience at the core.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white/50 backdrop-blur-sm border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 group"
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-slate-500">
            *Currently routing through Lido's open staking protocol
          </p>
        </div>
      </div>
    </section>
  );
};

// How It Works Component
const HowItWorks = () => {
  const steps = [
    {
      icon: Wallet,
      title: 'Connect Your Wallet',
      description: 'Sign in using email, social, or wallet — powered by smart wallet tech.',
      number: '01',
    },
    {
      icon: MousePointer,
      title: 'Stake ETH in One Click',
      description: 'Your ETH is staked through audited smart contracts. You maintain custody and control.',
      number: '02',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Position',
      description: 'Watch your staking position evolve over time. Your balance updates automatically as the network processes rewards.',
      number: '03',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto">
            Start staking in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="bg-white/30 backdrop-blur-sm border-gray-200 hover:border-gray-300 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-6xl font-bold text-slate-200 group-hover:text-blue-500/30 transition-colors">
                {step.number}
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-gray-200 rounded-lg p-6">
            <p className="text-lg font-medium text-slate-900 mb-2">Platform Fee</p>
            <p className="text-slate-700">We charge a transparent <span className="text-blue-600 font-semibold">0.5%</span> platform fee — no surprises.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Institutions Component
const Institutions = () => {
  const benefits = [
    {
      icon: Building2,
      title: 'On-chain non-custodial control',
    },
    {
      icon: FileText,
      title: 'Audited smart contracts',
    },
    {
      icon: Zap,
      title: 'Institutional-grade staking interface',
    },
    {
      icon: Headphones,
      title: 'Optional technical support for qualified organizations',
    },
    {
      icon: Settings,
      title: 'Scalable fee & API access options',
    },
    {
      icon: Users,
      title: 'Compatible with multi-signature wallets and DAO frameworks',
    },
  ];

  return (
    <section id="institutions" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Institutional Crypto Staking
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              SafeStaking offers compliant access to decentralized staking tools. 
              Ideal for DAOs, funds, and treasury managers seeking institutional-grade infrastructure.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-6 text-lg font-semibold"
            >
              Contact Institutional Team
            </Button>
          </div>
          <div>
            <Card className="bg-white/30 backdrop-blur-sm border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-8 text-slate-900">
                  Institutional Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <benefit.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {benefit.title}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ Component
const FAQ = () => {
  const faqs = [
    {
      question: 'Is this custodial?',
      answer: 'No. Your assets are yours — we never touch your keys. SafeStaking is built as a non-custodial platform where you maintain full control of your funds at all times.',
    },
    {
      question: 'What do I get from staking?',
      answer: 'You receive stETH in your wallet and earn ETH staking rewards. The stETH token represents your staked ETH plus accumulated rewards, and its value grows over time.',
    },
    {
      question: 'What do you charge?',
      answer: 'A flat 0.5% fee per stake transaction — transparent and built-in. There are no hidden fees, subscription costs, or surprise charges.',
    },
    {
      question: 'Can I unstake or withdraw?',
      answer: 'You can use Lido\'s or Curve\'s liquidity to swap your stETH if needed. Full withdraw flows will follow Ethereum protocol changes and will be available as the network evolves.',
    },
    {
      question: 'Is this audited?',
      answer: 'Yes. Smart contracts are verified, and backend logic is open. We work with leading security firms to ensure our protocols meet the highest security standards.',
    },
    {
      question: 'Will more chains be supported?',
      answer: 'Yes — we\'re building multi-chain infrastructure now. While we currently focus on Ethereum staking, our roadmap includes support for other major proof-of-stake networks.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-white-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about SafeStaking
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white/30 backdrop-blur-sm border border-gray-200 rounded-lg px-6 hover:border-gray-300 transition-colors"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

// Main Home Component
export default function Home() {
  const { mounted } = useDynamic();

  // Show loading during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>SafeStaking - Liquid Staking with Transparent Fees</title>
        <meta name="description" content="Secure liquid staking with transparent fees. Stake ETH and receive stETH tokens through our verified wrapper on Ethereum." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/fav.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-blue-50/40 to-cyan-50/30">
        <Header currentPage="home" />

        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <Institutions />
          <FAQ />
        </main>

        <Footer />
      </div>
    </>
  );
}