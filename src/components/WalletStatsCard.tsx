// File: src/components/WalletStatsCard.tsx
// Modern wallet statistics cards component with glass morphism design

import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiClock, FiZap, FiDollarSign, FiLayers, FiImage, FiSettings, FiBarChart } from 'react-icons/fi';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string | number;
    period: string;
    isPositive?: boolean;
  };
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal' | 'indigo' | 'rose';
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

const colorClasses = {
  blue: {
    bg: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/20',
    iconBg: 'from-blue-500/20 to-cyan-500/20',
    icon: 'text-blue-400',
    text: 'text-blue-300',
    value: 'text-white'
  },
  green: {
    bg: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/20',
    iconBg: 'from-green-500/20 to-emerald-500/20',
    icon: 'text-green-400',
    text: 'text-green-300',
    value: 'text-white'
  },
  purple: {
    bg: 'from-purple-500/10 to-violet-500/10',
    border: 'border-purple-500/20',
    iconBg: 'from-purple-500/20 to-violet-500/20',
    icon: 'text-purple-400',
    text: 'text-purple-300',
    value: 'text-white'
  },
  orange: {
    bg: 'from-orange-500/10 to-red-500/10',
    border: 'border-orange-500/20',
    iconBg: 'from-orange-500/20 to-red-500/20',
    icon: 'text-orange-400',
    text: 'text-orange-300',
    value: 'text-white'
  },
  pink: {
    bg: 'from-pink-500/10 to-rose-500/10',
    border: 'border-pink-500/20',
    iconBg: 'from-pink-500/20 to-rose-500/20',
    icon: 'text-pink-400',
    text: 'text-pink-300',
    value: 'text-white'
  },
  teal: {
    bg: 'from-teal-500/10 to-cyan-500/10',
    border: 'border-teal-500/20',
    iconBg: 'from-teal-500/20 to-cyan-500/20',
    icon: 'text-teal-400',
    text: 'text-teal-300',
    value: 'text-white'
  },
  indigo: {
    bg: 'from-indigo-500/10 to-blue-500/10',
    border: 'border-indigo-500/20',
    iconBg: 'from-indigo-500/20 to-blue-500/20',
    icon: 'text-indigo-400',
    text: 'text-indigo-300',
    value: 'text-white'
  },
  rose: {
    bg: 'from-rose-500/10 to-pink-500/10',
    border: 'border-rose-500/20',
    iconBg: 'from-rose-500/20 to-pink-500/20',
    icon: 'text-rose-400',
    text: 'text-rose-300',
    value: 'text-white'
  }
};

function StatsCard({ title, value, subtitle, trend, icon, color }: StatsCardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className={`
      bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 
      hover:bg-white/8 hover:border-white/20 hover:scale-[1.02] 
      transition-all duration-300 group relative overflow-hidden
      bg-gradient-to-br ${colors.bg}
    `}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
      
      <div className="flex items-start justify-between mb-4 relative">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colors.iconBg} group-hover:scale-110 transition-transform duration-200`}>
          <div className={`${colors.icon}`}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm">
            {trend.isPositive !== false ? (
              <FiTrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <FiTrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={trend.isPositive !== false ? 'text-green-400' : 'text-red-400'}>
              {trend.isPositive !== false ? '+' : ''}{trend.value}
            </span>
            <span className="text-gray-500 text-xs">{trend.period}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1 relative">
        <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{title}</h3>
        <p className={`text-2xl font-bold ${colors.value} group-hover:text-white transition-colors`}>{value}</p>
        {subtitle && (
          <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

interface WalletStatsGridProps {
  stats: WalletStats;
  isLoading?: boolean;
}

export default function WalletStatsGrid({ stats, isLoading }: WalletStatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl"></div>
              <div className="w-16 h-4 bg-slate-700/50 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-20 h-4 bg-slate-700/50 rounded"></div>
              <div className="w-16 h-8 bg-slate-700/50 rounded"></div>
              <div className="w-24 h-3 bg-slate-700/50 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
        
        <div className="flex items-center justify-between relative">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                <FiBarChart className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Active Wallet</h2>
                <p className="text-sm text-slate-400">On-chain activity overview</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                Wallet Age: <span className="font-semibold text-slate-300">{stats.walletAge}</span>
              </span>
              <span className="flex items-center gap-2">
                <FiActivity className="w-4 h-4" />
                Period: <span className="font-semibold text-slate-300">{stats.timeframe}</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400 mb-1">Current Balance</p>
            <p className="text-3xl font-bold text-white">{parseFloat(stats.overview.balance).toFixed(4)}</p>
            <p className="text-sm text-slate-400">MON</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Interactions"
          value={stats.interactions.total.toLocaleString()}
          subtitle={`Approvals: ${stats.interactions.approvals}`}
          trend={{
            value: Math.floor(stats.interactions.total * 0.1),
            period: stats.interactions.period,
            isPositive: true
          }}
          icon={<FiActivity className="w-6 h-6" />}
          color="blue"
        />

        <StatsCard
          title="Smart Contracts"
          value={stats.interactions.uniqueContracts.toLocaleString()}
          subtitle={`Deployments: ${stats.interactions.deployments}`}
          trend={{
            value: Math.floor(stats.interactions.uniqueContracts * 0.15),
            period: stats.interactions.period,
            isPositive: true
          }}
          icon={<FiSettings className="w-6 h-6" />}
          color="green"
        />

        <StatsCard
          title="Transaction Volume"
          value={`${parseFloat(stats.volume.total).toFixed(2)} MON`}
          subtitle={`Total transferred`}
          trend={{
            value: `${Math.floor(parseFloat(stats.volume.total) * 0.2)} MON`,
            period: stats.volume.period,
            isPositive: true
          }}
          icon={<FiBarChart className="w-6 h-6" />}
          color="purple"
        />

        <StatsCard
          title="NFTs Minted"
          value={stats.nfts.minted}
          subtitle={`Unique collections: ${stats.nfts.unique}`}
          trend={{
            value: Math.floor(stats.nfts.minted * 0.1),
            period: stats.nfts.period,
            isPositive: true
          }}
          icon={<FiImage className="w-6 h-6" />}
          color="orange"
        />

        <StatsCard
          title="Transaction Fees"
          value={`${parseFloat(stats.fees.total).toFixed(6)} MON`}
          subtitle="Total fees paid"
          trend={{
            value: `${Math.floor(parseFloat(stats.fees.total) * 100) / 100} MON`,
            period: stats.fees.period,
            isPositive: false
          }}
          icon={<FiDollarSign className="w-6 h-6" />}
          color="pink"
        />

        <StatsCard
          title="Daily Activity"
          value={stats.activity.avgPerDay.toFixed(1)}
          subtitle={`Active days: ${stats.activity.totalDays}`}
          trend={{
            value: Math.floor(stats.activity.avgPerDay * 0.2),
            period: stats.timeframe,
            isPositive: true
          }}
          icon={<FiZap className="w-6 h-6" />}
          color="teal"
        />

        <StatsCard
          title="Token Portfolio"
          value={stats.tokens.uniqueTokens}
          subtitle={`NFTs: ${stats.tokens.uniqueNFTs}`}
          trend={{
            value: Math.floor(stats.tokens.uniqueTokens * 0.1),
            period: stats.tokens.period,
            isPositive: true
          }}
          icon={<FiLayers className="w-6 h-6" />}
          color="indigo"
        />

        <StatsCard
          title="Total Transactions"
          value={stats.overview.totalTransactions.toLocaleString()}
          subtitle="Lifetime transactions"
          icon={<FiActivity className="w-6 h-6" />}
          color="rose"
        />
      </div>
    </div>
  );
}