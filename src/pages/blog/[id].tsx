import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDynamic } from '../../hooks/useDynamic';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

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

// Icons
const ArrowLeft: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

const Share: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

// Blog post data (in a real app, this would come from a CMS or API)
const blogPosts = {
  'what-is-staking': {
    title: 'What is Staking? A Comprehensive Guide to Crypto Staking',
    author: 'SafeStaking Team',
    date: 'June 22, 2025',
    readTime: '8 min read',
    category: 'Education',
    content: `
      <p className="text-xl text-slate-600 leading-relaxed mb-8">
        Cryptocurrency staking has emerged as one of the most popular ways to earn passive income from digital assets. But what exactly is staking, and how does it work? In this comprehensive guide, we'll break down everything you need to know about crypto staking.
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-slate-900">
        Understanding Proof of Stake
      </h2>
      
      <p className="mb-6">
        To understand staking, we first need to understand Proof of Stake (PoS), the consensus mechanism that makes staking possible. Unlike Proof of Work (used by Bitcoin), which requires miners to solve complex mathematical problems, Proof of Stake selects validators to create new blocks based on their stake in the network.
      </p>

      <p className="mb-8">
        In a PoS system, validators are chosen to propose and validate new blocks based on the amount of cryptocurrency they have "staked" or locked up as collateral. This creates a strong incentive for validators to act honestly, as they risk losing their staked tokens if they attempt to validate fraudulent transactions.
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-slate-900">
        What is Staking?
      </h2>
      
      <p className="mb-6">
        Staking is the process of actively participating in transaction validation on a Proof of Stake blockchain. When you stake your tokens, you're essentially:
      </p>

      <ul className="mb-8 space-y-2">
        <li>• Locking up your cryptocurrency to support network operations</li>
        <li>• Contributing to network security and decentralization</li>
        <li>• Earning rewards for your participation</li>
        <li>• Helping validate transactions and maintain the blockchain</li>
      </ul>
    `
  },
  'ethereum-staking-guide': {
    title: 'Ethereum Staking: Complete Guide for Beginners',
    author: 'Alex Chen',
    date: 'June 20, 2025',
    readTime: '12 min read',
    category: 'Guides',
    content: `
      <p className="text-xl text-slate-600 leading-relaxed mb-8">
        Ethereum's transition to Proof of Stake has opened up new opportunities for earning rewards through staking. This comprehensive guide will walk you through everything you need to know about Ethereum staking, from the basics to advanced strategies.
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-slate-900">
        What is Ethereum Staking?
      </h2>
      
      <p className="mb-6">
        Ethereum staking involves locking up your ETH to help secure the Ethereum network and validate transactions. In return for this service, stakers earn rewards in the form of additional ETH. This process replaced the energy-intensive mining system with a more sustainable and accessible way to participate in network consensus.
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-slate-900">
        Requirements for Ethereum Staking
      </h2>
      
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl mb-8">
        <h3 className="text-xl font-semibold mb-4">Solo Staking Requirements:</h3>
        <ul className="space-y-2">
          <li>• 32 ETH minimum deposit</li>
          <li>• Dedicated hardware (computer running 24/7)</li>
          <li>• Reliable internet connection</li>
          <li>• Technical knowledge for setup and maintenance</li>
          <li>• Ethereum execution and consensus clients</li>
        </ul>
      </div>
    `
  }
};

// Share Buttons Component
const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={shareToTwitter}
        className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
        title="Share on Twitter"
      >
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      </button>
      
      <button
        onClick={shareToLinkedIn}
        className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
        title="Share on LinkedIn"
      >
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>
      
      <button
        onClick={copyToClipboard}
        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
        title="Copy link"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
};

// Blog Post Detail Component
const BlogPostDetail = ({ postId }: { postId: string }) => {
  const post = blogPosts[postId as keyof typeof blogPosts];
  
  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
        <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white backdrop-blur-sm border-gray-200 shadow-xl">
            <CardContent className="p-8 md:p-12">
              {/* Article Header */}
              <header className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-8">
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

                {/* Share Buttons */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Share className="h-4 w-4" />
                    Share this article:
                  </div>
                  <ShareButtons 
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${postId}`}
                    title={post.title}
                  />
                </div>
              </header>

              {/* Article Content */}
              <article className="prose prose-lg max-w-none">
                <div className="text-xl text-slate-600 leading-relaxed mb-8">
                  Cryptocurrency staking has emerged as one of the most popular ways to earn passive income from digital assets. But what exactly is staking, and how does it work? In this comprehensive guide, we'll break down everything you need to know about crypto staking.
                </div>

                <h2 className="text-3xl font-semibold mb-6 text-slate-900">
                  Understanding Proof of Stake
                </h2>
                
                <p className="mb-6">
                  To understand staking, we first need to understand Proof of Stake (PoS), the consensus mechanism that makes staking possible. Unlike Proof of Work (used by Bitcoin), which requires miners to solve complex mathematical problems, Proof of Stake selects validators to create new blocks based on their stake in the network.
                </p>

                <p className="mb-8">
                  In a PoS system, validators are chosen to propose and validate new blocks based on the amount of cryptocurrency they have "staked" or locked up as collateral. This creates a strong incentive for validators to act honestly, as they risk losing their staked tokens if they attempt to validate fraudulent transactions.
                </p>

                <h2 className="text-3xl font-semibold mb-6 text-slate-900">
                  What is Staking?
                </h2>
                
                <p className="mb-6">
                  Staking is the process of actively participating in transaction validation on a Proof of Stake blockchain. When you stake your tokens, you're essentially:
                </p>

                <ul className="mb-8 space-y-2">
                  <li>• Locking up your cryptocurrency to support network operations</li>
                  <li>• Contributing to network security and decentralization</li>
                  <li>• Earning rewards for your participation</li>
                  <li>• Helping validate transactions and maintain the blockchain</li>
                </ul>

                <h2 className="text-3xl font-semibold mb-6 text-slate-900">
                  How Does Staking Work?
                </h2>
                
                <p className="mb-6">
                  The staking process varies depending on the blockchain, but generally follows these steps:
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl mb-8">
                  <h3 className="text-xl font-semibold mb-4">The Staking Process:</h3>
                  <ol className="space-y-3">
                    <li><strong>1. Choose a Validator:</strong> Select a validator node or run your own</li>
                    <li><strong>2. Delegate Tokens:</strong> Lock up your tokens with the chosen validator</li>
                    <li><strong>3. Validation:</strong> Your validator participates in block validation</li>
                    <li><strong>4. Earn Rewards:</strong> Receive staking rewards based on your contribution</li>
                  </ol>
                </div>

                <h2 className="text-3xl font-semibold mb-6 text-slate-900">
                  Benefits of Staking
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Passive Income</h3>
                    <p className="text-sm text-slate-600">
                      Earn rewards simply by holding and staking your tokens, typically ranging from 3-15% annually.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Network Security</h3>
                    <p className="text-sm text-slate-600">
                      Contribute to the security and decentralization of your favorite blockchain networks.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Lower Energy Consumption</h3>
                    <p className="text-sm text-slate-600">
                      PoS consensus is much more energy-efficient compared to Proof of Work mining.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Governance Rights</h3>
                    <p className="text-sm text-slate-600">
                      Many staking protocols offer voting rights on network upgrades and governance proposals.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 p-8 rounded-2xl border border-blue-200/20 mt-12">
                  <h3 className="text-xl font-semibold mb-4">Start Your Staking Journey with SafeStaking</h3>
                  <p className="mb-4">
                    Ready to start staking? SafeStaking offers a secure, non-custodial platform that makes staking accessible to everyone. With our transparent infrastructure and user-friendly interface, you can start earning staking rewards while maintaining full control of your assets.
                  </p>
                  <p className="text-sm text-slate-600">
                    Remember: This article is for educational purposes only and does not constitute financial advice. Always do your own research before making investment decisions.
                  </p>
                </div>
              </article>

              {/* Bottom Share Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-600">
                    Found this helpful? Share it with others:
                  </div>
                  <ShareButtons 
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${postId}`}
                    title={post.title}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Main Blog Post Page Component
export default function BlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const { mounted } = useDynamic();

  // Show loading during hydration
  if (!mounted || !id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const postId = Array.isArray(id) ? id[0] : id;

  return (
    <>
      <Head>
        <title>{blogPosts[postId as keyof typeof blogPosts]?.title || 'Blog Post'} - SafeStaking</title>
        <meta name="description" content="Deep insights, educational content, and the latest updates from the world of decentralized staking." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/fav.png" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header currentPage="blog" />

        <main className="pt-24">
          <div className="container mx-auto px-4 py-8">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform rotate-180" />
              Back to Blog
            </Link>
          </div>
          
          <BlogPostDetail postId={postId} />
        </main>

        <Footer />
      </div>
    </>
  );
}