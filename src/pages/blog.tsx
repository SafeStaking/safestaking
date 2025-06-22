import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useDynamic } from '../hooks/useDynamic';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Utility function for className merging
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Simple Card Components
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("rounded-lg border bg-white text-gray-900 shadow-sm", className)} {...props} />
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-6", className)} {...props} />
);

// Simple Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ className, variant = 'default', size = 'default', children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8",
  };
  
  return (
    <button className={cn(baseClasses, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};

// Icons
const Search: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Calendar: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Clock: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const User: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// Blog data
const blogPosts = [
  {
    id: 'what-is-staking',
    title: 'What is Staking? A Comprehensive Guide to Crypto Staking',
    excerpt: 'Discover the fundamentals of cryptocurrency staking, how it works, and why it\'s becoming the preferred way to earn passive income from digital assets.',
    author: 'SafeStaking Team',
    date: 'June 22, 2025',
    readTime: '8 min read',
    category: 'Education',
    featured: true
  },
  {
    id: 'ethereum-staking-guide',
    title: 'Ethereum Staking: Complete Guide for Beginners',
    excerpt: 'Learn everything about Ethereum 2.0 staking, from setup requirements to expected returns and best practices for validators.',
    author: 'Alex Chen',
    date: 'June 20, 2025',
    readTime: '12 min read',
    category: 'Guides',
    featured: false
  },
  {
    id: 'liquid-staking-explained',
    title: 'Liquid Staking: The Future of DeFi Participation',
    excerpt: 'Understand how liquid staking tokens are revolutionizing DeFi by allowing stakers to maintain liquidity while earning rewards.',
    author: 'Sarah Johnson',
    date: 'June 18, 2025',
    readTime: '6 min read',
    category: 'DeFi',
    featured: false
  },
  {
    id: 'validator-economics',
    title: 'Validator Economics: Maximizing Your Staking Returns',
    excerpt: 'Deep dive into the economic factors that affect staking rewards and how to optimize your validator performance.',
    author: 'Michael Rodriguez',
    date: 'June 15, 2025',
    readTime: '10 min read',
    category: 'Economics',
    featured: false
  },
  {
    id: 'staking-security',
    title: 'Staking Security: Protecting Your Digital Assets',
    excerpt: 'Essential security practices for stakers, from key management to choosing reliable infrastructure providers.',
    author: 'Emily Zhang',
    date: 'June 12, 2025',
    readTime: '7 min read',
    category: 'Security',
    featured: false
  },
  {
    id: 'multi-chain-staking',
    title: 'Multi-Chain Staking Strategies for 2025',
    excerpt: 'Explore opportunities across different blockchain networks and learn how to diversify your staking portfolio.',
    author: 'David Kim',
    date: 'June 10, 2025',
    readTime: '9 min read',
    category: 'Strategy',
    featured: false
  }
];

// Blog Hero Component
const BlogHero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 bg-clip-text text-transparent">
            SafeStaking Blog
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8 max-w-3xl mx-auto">
            Deep insights, educational content, and the latest updates from the world of decentralized staking
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
              />
            </div>
            <Button variant="outline" className="whitespace-nowrap bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
              All Topics
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Blog Card Component
interface BlogCardProps {
  post: typeof blogPosts[0];
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  if (featured) {
    return (
      <Card className="overflow-hidden bg-white backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="h-64 md:h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  {post.category}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                  Featured
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                <Link href={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              </div>
              
              <Link 
                href={`/blog/${post.id}`}
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Read Full Article
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </CardContent>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-white backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
            {post.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
          <Link href={`/blog/${post.id}`}>
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
        </div>
        
        <Link 
          href={`/blog/${post.id}`}
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm"
        >
          Read More
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </CardContent>
    </Card>
  );
};

// Blog Grid Component
const BlogGrid = () => {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Featured Article</span>
            </div>
            <BlogCard post={featuredPost} featured={true} />
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-1 w-8 bg-gradient-to-r from-slate-600 to-slate-400 rounded-full"></div>
            <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">Latest Articles</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <BlogCard key={post.id} post={post} featured={false} />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
            Load More Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

// Main Blog Page Component
export default function Blog() {
  const { mounted } = useDynamic();

  // Show loading during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Blog - SafeStaking</title>
        <meta name="description" content="Deep insights, educational content, and the latest updates from the world of decentralized staking." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/fav.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50">
        <Header currentPage="blog" />

        <main className="pt-15">
          <BlogHero />
          <BlogGrid />
        </main>

        <Footer />
      </div>
    </>
  );
}