'use client';

import { useState } from 'react';
import { FiSearch, FiKey, FiHardDrive, FiGitMerge, FiImage, FiDollarSign, FiBarChart, FiChevronRight, FiExternalLink, FiCopy, FiActivity, FiServer, FiUsers, FiTrendingUp } from 'react-icons/fi';
import Image from 'next/image';
import WalletStatsGrid from '@/components/WalletStatsCard';

// Keep all existing interfaces
interface WalletInfo {
  balance: string;
  txCount: number;
  isContract: boolean;
  storageAtSlot0?: string;
  historicalBalance?: string;
}
interface LatestBlockInfo {
  number: string;
  hash: string | null;
  timestamp: number | undefined;
  transactionCount: number | undefined;
}
interface NetworkInfo {
  clientVersion: string;
  chainId: string;
  protocolVersion?: string;
  syncing?: string;
  latestBlock: LatestBlockInfo;
  gasPrice: string;
}
interface TxInfo {
  hash: string;
  status: 'Success' | 'Failed';
  blockNumber: number;
  from: string;
  to: string | null;
  value: string;
  txFee: string;
}
interface NftInfo {
  title: string;
  tokenId: string;
  media: { gateway: string }[];
  contract: { address: string };
  name?: string;
  image?: string;
  collectionName?: string;
  verified?: boolean;
  method?: string;
  transactionHash?: string;
  blockNumber?: number;
  timestamp?: number;
  type?: string;
  qty?: string;
  contractAddress?: string;
}

interface NFTSummary {
  owned: number;
  totalActivities: number;
  collections: number;
  minted: number;
  received: number;
  sent: number;
}
interface TokenInfo {
  symbol: string;
  name: string;
  balance: string;
  contractAddress: string;
  decimals: number;
}

interface WalletStats {
  walletAge: string;
  timeframe: string;
  overview: {
    balance: string;
    totalTransactions: number;
    walletAddress: string;
  };
  interactions: {
    total: number;
    approvals: number;
    uniqueContracts: number;
    deployments: number;
    period: string;
  };
  volume: {
    total: string;
    totalUSD: number;
    period: string;
  };
  fees: {
    total: string;
    totalUSD: number;
    period: string;
  };
  tokens: {
    uniqueTokens: number;
    uniqueNFTs: number;
    period: string;
  };
  nfts: {
    minted: number;
    unique: number;
    period: string;
  };
  activity: {
    dailyBreakdown: Record<string, number>;
    totalDays: number;
    avgPerDay: number;
  };
}

// Modern Card Component
const Card = ({ children, className = "", hover = false }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
  <div className={`bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 ${hover ? 'hover:bg-white/10 transition-all duration-300' : ''} ${className}`}>
    {children}
  </div>
);

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }: { 
  icon: React.ElementType, 
  title: string, 
  value: string | number, 
  subtitle?: string,
  color?: "blue" | "green" | "purple" | "orange" | "pink"
}) => {
  const colorMap = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500", 
    purple: "from-purple-500 to-violet-500",
    orange: "from-orange-500 to-red-500",
    pink: "from-pink-500 to-rose-500"
  };

  return (
    <Card hover className="p-6 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorMap[color]} bg-opacity-20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        <FiChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </Card>
  );
};

// Copy Button Component
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
      title="Copy to clipboard"
    >
      <FiCopy className={`w-4 h-4 ${copied ? 'text-green-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
    </button>
  );
};

// Detail Row Component with modern styling
const DetailRow = ({ 
  label, 
  value, 
  isMono = false, 
  isHash = false,
  copyable = false
}: { 
  label: string, 
  value: string | number | null | undefined, 
  isMono?: boolean, 
  isHash?: boolean,
  copyable?: boolean
}) => (
  <div className="flex items-center justify-between py-4 px-6 hover:bg-white/5 transition-colors group">
    <span className="text-sm font-medium text-gray-400">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`text-sm text-gray-200 ${isMono ? 'font-mono' : ''} ${isHash ? 'truncate max-w-32 md:max-w-none' : ''}`}>
        {value ?? 'N/A'}
      </span>
      {copyable && value && <CopyButton text={value.toString()} />}
    </div>
  </div>
);

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'wallet' | 'transaction'>('wallet');
  const [address, setAddress] = useState('');
  const [txHash, setTxHash] = useState('');

  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [txInfo, setTxInfo] = useState<TxInfo | null>(null);
  const [nfts, setNfts] = useState<NftInfo[] | null>(null);
  const [nftSummary, setNftSummary] = useState<NFTSummary | null>(null);
  const [nftProvider, setNftProvider] = useState<'alchemy' | 'blockvision'>('blockvision');
  const [tokens, setTokens] = useState<TokenInfo[] | null>(null);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);

  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Token pagination state
  const [currentTokenPage, setCurrentTokenPage] = useState(1);
  const tokensPerPage = 9;
  
  // NFT image loading state
  const [nftImageErrors, setNftImageErrors] = useState<Set<string>>(new Set());

  // Keep existing handler functions
  const handleCheckWallet = async () => {
    setIsWalletLoading(true);
    setError(null);
    setWalletInfo(null);
    setNetworkInfo(null);
    setNfts(null);
    setTokens(null);
    setCurrentTokenPage(1); // Reset pagination
    setNftImageErrors(new Set()); // Reset image errors
    try {
      let nftEndpoint = `/api/get-nfts?address=${address}`;
      if (nftProvider === 'blockvision') {
        nftEndpoint = `/api/get-nfts-blockvision?address=${address}&limit=50`;
      }
        
      const [walletRes, nftRes, tokenRes, statsRes] = await Promise.all([
        fetch(`/api/check-wallet?address=${address}`),
        fetch(nftEndpoint),
        fetch(`/api/get-tokens?address=${address}`),
        fetch(`/api/wallet-stats?address=${address}&timeframe=all`)
      ]);

      const walletData = await walletRes.json();
      if (!walletRes.ok) throw new Error(walletData.error);
      setWalletInfo(walletData.wallet);
      setNetworkInfo(walletData.network);

      const nftData = await nftRes.json();
      if (!nftRes.ok) {
        console.warn('NFT fetch failed:', nftData.error);
        setNfts([]);
        setNftSummary(null);
      } else {
        if (nftProvider === 'blockvision') {
          setNfts(nftData.nfts || []);
          setNftSummary(nftData.summary || null);
        } else {
          setNfts(nftData.ownedNfts || []);
          setNftSummary(null);
        }
      }

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) {
        console.warn('Token fetch failed:', tokenData.error);
        setTokens([]);
      } else {
        setTokens(tokenData.tokens);
      }

      const statsData = await statsRes.json();
      if (!statsRes.ok) {
        console.warn('Wallet stats fetch failed:', statsData.error);
        setWalletStats(null);
      } else {
        setWalletStats(statsData);
      }

    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsWalletLoading(false);
    }
  };

  const handleCheckTx = async () => {
    setIsTxLoading(true);
    setError(null);
    setTxInfo(null);
    try {
      const res = await fetch(`/api/get-tx?hash=${txHash}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTxInfo(data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsTxLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-blue-300">Live on Monad Testnet</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Explore <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">JAV</span>nad ( Java Monad )
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Powerful on-chain analytics and exploration tools for the Monad testnet. 
            Discover wallets, transactions, tokens, and NFTs with ease.
          </p>

          {/* Developer Info Card */}
          <Card className="max-w-md mx-auto p-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-300">
                  Developed by <a href="https://twitter.com/ipvdan" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold">@ipvdan</a>
                </p>
                <p className="text-xs text-gray-500">Actively maintained & updated</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <Card className="p-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('wallet');
                  setError(null);
                  setTxInfo(null);
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 ${
                  activeTab === 'wallet'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <FiKey className="w-5 h-5" />
                Wallet Explorer
              </button>
              <button
                onClick={() => {
                  setActiveTab('transaction');
                  setError(null);
                  // Keep wallet data when switching tabs
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 ${
                  activeTab === 'transaction'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <FiActivity className="w-5 h-5" />
                Transaction Lookup
              </button>
            </div>
          </Card>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16">
          {activeTab === 'wallet' ? (
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiKey className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Wallet Address</h2>
                <p className="text-gray-400">Enter any Ethereum address to explore wallet details</p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x316eEF7088c434F8DB78FfeCf312F60e3A710879"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-white placeholder-gray-500"
                  />
                </div>
                
                <button
                  onClick={handleCheckWallet}
                  disabled={isWalletLoading || !address}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
                >
                  {isWalletLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Exploring...
                    </>
                  ) : (
                    <>
                      <FiSearch className="w-5 h-5" />
                      Explore Wallet
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  Example: 0x316eEF7088c434F8DB78FfeCf312F60e3A710879 (65 tokens)
                </p>
              </div>
            </Card>
          ) : (
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiActivity className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Transaction Hash</h2>
                <p className="text-gray-400">Look up any transaction on Monad testnet</p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="0x..."
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm text-white placeholder-gray-500"
                />
                
                <button
                  onClick={handleCheckTx}
                  disabled={isTxLoading || !txHash}
                  className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
                >
                  {isTxLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Looking up...
                    </>
                  ) : (
                    <>
                      <FiSearch className="w-5 h-5" />
                      Look Up Transaction
                    </>
                  )}
                </button>
              </div>
            </Card>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="p-6 border-red-500/20 bg-red-500/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-red-400">⚠</span>
                </div>
                <p className="text-red-300">{error}</p>
              </div>
            </Card>
          </div>
        )}

        {/* Results Section */}
        {activeTab === 'wallet' && (
          <div className="space-y-12">
            {/* Wallet Stats */}
            {walletStats && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <FiBarChart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Wallet Analytics</h2>
                </div>
                <WalletStatsGrid stats={walletStats} isLoading={false} />
              </section>
            )}

            {/* Quick Stats */}
            {walletInfo && (
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    icon={FiDollarSign}
                    title="Balance"
                    value={`${parseFloat(walletInfo.balance).toFixed(4)} MON`}
                    color="blue"
                  />
                  <StatCard
                    icon={FiActivity}
                    title="Transactions"
                    value={walletInfo.txCount}
                    color="green"
                  />
                  <StatCard
                    icon={FiServer}
                    title="Account Type"
                    value={walletInfo.isContract ? 'Contract' : 'EOA'}
                    color="purple"
                  />
                  <StatCard
                    icon={FiTrendingUp}
                    title="Token Count"
                    value={tokens?.length || 0}
                    color="orange"
                  />
                </div>
              </section>
            )}

            {/* Wallet Details */}
            {walletInfo && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FiKey className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Wallet Details</h3>
                </div>
                
                <Card className="divide-y divide-white/10">
                  <DetailRow label="Current Balance" value={`${parseFloat(walletInfo.balance).toFixed(6)} MON`} isMono />
                  <DetailRow label="Transaction Count" value={walletInfo.txCount} copyable />
                  <DetailRow label="Account Type" value={walletInfo.isContract ? '📄 Smart Contract' : '👤 Externally Owned Account'} />
                  {walletInfo.historicalBalance && (
                    <DetailRow label="Balance 1000 Blocks Ago" value={`${parseFloat(walletInfo.historicalBalance).toFixed(6)} MON`} isMono />
                  )}
                  {walletInfo.storageAtSlot0 && walletInfo.storageAtSlot0 !== '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                    <DetailRow label="Storage Slot 0" value={walletInfo.storageAtSlot0} isMono isHash copyable />
                  )}
                </Card>
              </section>
            )}

            {/* Token Portfolio */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <FiDollarSign className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Token Portfolio</h3>
                </div>
                {tokens && tokens.length > 0 && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    {tokens.length} tokens
                  </span>
                )}
              </div>

              {isWalletLoading ? (
                <Card className="p-12 text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading tokens...</p>
                </Card>
              ) : tokens && tokens.length > 0 ? (
                <div className="space-y-6">
                  {/* Token Grid with Pagination */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tokens
                      .slice((currentTokenPage - 1) * tokensPerPage, currentTokenPage * tokensPerPage)
                      .map((token, index) => (
                        <Card key={`${token.contractAddress}-${index}`} hover className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {token.symbol.charAt(0)}
                              </span>
                            </div>
                            <FiExternalLink className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white mb-1">{token.symbol}</h4>
                            <p className="text-sm text-gray-400 mb-3 truncate">{token.name}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-white">
                                {parseFloat(token.balance).toFixed(4)}
                              </span>
                              <span className="text-sm text-gray-500">{token.symbol}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>

                  {/* Pagination Controls */}
                  {tokens.length > tokensPerPage && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Showing {((currentTokenPage - 1) * tokensPerPage) + 1} to {Math.min(currentTokenPage * tokensPerPage, tokens.length)} of {tokens.length} tokens
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentTokenPage(prev => Math.max(1, prev - 1))}
                          disabled={currentTokenPage === 1}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-2 text-sm text-gray-400">
                          {currentTokenPage} / {Math.ceil(tokens.length / tokensPerPage)}
                        </span>
                        <button
                          onClick={() => setCurrentTokenPage(prev => Math.min(Math.ceil(tokens.length / tokensPerPage), prev + 1))}
                          disabled={currentTokenPage >= Math.ceil(tokens.length / tokensPerPage)}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : tokens !== null ? (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiDollarSign className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">No tokens found</p>
                  <p className="text-gray-500 text-sm">This wallet doesn&apos;t hold any tokens</p>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-400">Search for a wallet to view token portfolio</p>
                </Card>
              )}
            </section>

            {/* NFT Gallery */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <FiImage className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">NFT Collection</h3>
                </div>
                <div className="flex items-center gap-4">
                  {nfts && nfts.length > 0 && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                      {nfts.length} NFTs
                    </span>
                  )}
                  <select
                    value={nftProvider}
                    onChange={(e) => setNftProvider(e.target.value as 'alchemy' | 'blockvision')}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="blockvision">Blockvision</option>
                    <option value="alchemy">Alchemy</option>
                  </select>
                </div>
              </div>

              {isWalletLoading ? (
                <Card className="p-12 text-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading NFTs...</p>
                </Card>
              ) : nfts && nfts.length > 0 ? (
                <div className="space-y-6">
                  {/* NFT Summary */}
                  {nftProvider === 'blockvision' && nftSummary && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <StatCard icon={FiImage} title="Owned" value={nftSummary.owned} color="blue" />
                      <StatCard icon={FiTrendingUp} title="Minted" value={nftSummary.minted} color="green" />
                      <StatCard icon={FiActivity} title="Received" value={nftSummary.received} color="purple" />
                      <StatCard icon={FiGitMerge} title="Sent" value={nftSummary.sent} color="orange" />
                      <StatCard icon={FiUsers} title="Collections" value={nftSummary.collections} color="pink" />
                    </div>
                  )}

                  {/* NFT Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {nfts.slice(0, 16).map((nft) => (
                      <Card key={`${nft.contract?.address || nft.contractAddress}-${nft.tokenId}`} hover className="group overflow-hidden">
                        <div className="relative aspect-square overflow-hidden">
                          {nftImageErrors.has(`${nft.contract?.address || nft.contractAddress}-${nft.tokenId}`) ? (
                            // Fallback when image fails to load
                            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                              <div className="text-center">
                                <FiImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-400">Image unavailable</p>
                              </div>
                            </div>
                          ) : (
                            <Image
                              src={nft.image || nft.media?.[0]?.gateway || 'https://via.placeholder.com/200?text=NFT'}
                              alt={nft.title || nft.name || 'Untitled NFT'}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              unoptimized
                              onError={(e) => {
                                const nftKey = `${nft.contract?.address || nft.contractAddress}-${nft.tokenId}`;
                                setNftImageErrors(prev => new Set(prev).add(nftKey));
                              }}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Badges */}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium backdrop-blur-sm ${
                              nftProvider === 'blockvision' 
                                ? 'bg-blue-500/80 text-white' 
                                : 'bg-purple-500/80 text-white'
                            }`}>
                              {nftProvider === 'blockvision' ? 'BV' : 'AL'}
                            </span>
                            {nft.verified && (
                              <span className="bg-green-500/80 text-white px-2 py-1 text-xs rounded-full font-medium backdrop-blur-sm">
                                ✓
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-semibold text-white text-sm truncate mb-1">
                            {nft.title || nft.name || nft.collectionName || 'Untitled NFT'}
                          </h4>
                          <p className="text-xs text-gray-400 font-mono">#{nft.tokenId}</p>
                          {nft.collectionName && nft.collectionName !== nft.title && (
                            <p className="text-xs text-gray-500 truncate mt-1">{nft.collectionName}</p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : nfts !== null ? (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiImage className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">No NFTs found</p>
                  <p className="text-gray-500 text-sm">This wallet doesn&apos;t own any NFTs</p>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-400">Search for a wallet to view NFT collection</p>
                </Card>
              )}
            </section>

            {/* Network Status */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <FiServer className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Network Status</h3>
              </div>

              {isWalletLoading ? (
                <Card className="p-12 text-center">
                  <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading network info...</p>
                </Card>
              ) : networkInfo ? (
                <Card className="divide-y divide-white/10">
                  <DetailRow label="Latest Block" value={`#${networkInfo.latestBlock.number}`} isMono copyable />
                  <DetailRow label="Block Timestamp" value={networkInfo.latestBlock.timestamp ? new Date(networkInfo.latestBlock.timestamp * 1000).toLocaleString() : 'N/A'} />
                  <DetailRow label="Transactions in Block" value={networkInfo.latestBlock.transactionCount} />
                  <DetailRow label="Block Hash" value={networkInfo.latestBlock.hash || 'N/A'} isMono isHash copyable />
                  <DetailRow label="Chain ID" value={networkInfo.chainId} isMono />
                  <DetailRow label="Protocol Version" value={networkInfo.protocolVersion || 'N/A'} />
                  <DetailRow label="Sync Status" value={networkInfo.syncing || 'Synced'} />
                  <DetailRow label="Gas Price" value={`${parseFloat(networkInfo.gasPrice).toFixed(2)} Gwei`} isMono />
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-400">Search for a wallet to view network status</p>
                </Card>
              )}
            </section>
          </div>
        )}

        {/* Transaction Details */}
        {activeTab === 'transaction' && (
          <div className="max-w-4xl mx-auto">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FiActivity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
              </div>

              {isTxLoading ? (
                <Card className="p-12 text-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Looking up transaction...</p>
                </Card>
              ) : txInfo ? (
                <div className="space-y-6">
                  {/* Transaction Status */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          txInfo.status === 'Success' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          <span className="text-2xl">
                            {txInfo.status === 'Success' ? '✓' : '✗'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Transaction {txInfo.status}</h3>
                          <p className="text-gray-400">Block #{txInfo.blockNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{txInfo.value} MON</p>
                        <p className="text-sm text-gray-400">Fee: {parseFloat(txInfo.txFee).toPrecision(5)} MON</p>
                      </div>
                    </div>
                  </Card>

                  {/* Transaction Details */}
                  <Card className="divide-y divide-white/10">
                    <DetailRow label="Transaction Hash" value={txInfo.hash} isMono isHash copyable />
                    <DetailRow label="Status" value={txInfo.status} />
                    <DetailRow label="Block Number" value={txInfo.blockNumber} isMono copyable />
                    <DetailRow label="From Address" value={txInfo.from} isMono isHash copyable />
                    <DetailRow label="To Address" value={txInfo.to} isMono isHash copyable />
                    <DetailRow label="Value" value={`${txInfo.value} MON`} isMono />
                    <DetailRow label="Transaction Fee" value={`${parseFloat(txInfo.txFee).toPrecision(5)} MON`} isMono />
                  </Card>
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiActivity className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">No transaction data</p>
                  <p className="text-gray-500 text-sm">Enter a transaction hash to view details</p>
                </Card>
              )}
            </section>
          </div>
        )}

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 mb-4">
            Built for the Monad community with ❤️
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <a href="https://twitter.com/ipvdan" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
              Twitter
            </a>
            <span>•</span>
            <span>Monad Testnet Explorer</span>
            <span>•</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}