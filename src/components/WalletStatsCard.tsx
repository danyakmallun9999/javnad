// File: src/components/WalletStatsCard.tsx
// Modern wallet statistics cards component

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
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
    border: 'border-blue-200/50',
    icon: 'text-blue-600',
    text: 'text-blue-700',
    trend: 'text-blue-600'
  },
  green: {
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
    border: 'border-emerald-200/50',
    icon: 'text-emerald-600',
    text: 'text-emerald-700',
    trend: 'text-emerald-600'
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50',
    border: 'border-purple-200/50',
    icon: 'text-purple-600',
    text: 'text-purple-700',
    trend: 'text-purple-600'
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50',
    border: 'border-orange-200/50',
    icon: 'text-orange-600',
    text: 'text-orange-700',
    trend: 'text-orange-600'
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-50 to-pink-100/50',
    border: 'border-pink-200/50',
    icon: 'text-pink-600',
    text: 'text-pink-700',
    trend: 'text-pink-600'
  },
  teal: {
    bg: 'bg-gradient-to-br from-teal-50 to-teal-100/50',
    border: 'border-teal-200/50',
    icon: 'text-teal-600',
    text: 'text-teal-700',
    trend: 'text-teal-600'
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50',
    border: 'border-indigo-200/50',
    icon: 'text-indigo-600',
    text: 'text-indigo-700',
    trend: 'text-indigo-600'
  },
  rose: {
    bg: 'bg-gradient-to-br from-rose-50 to-rose-100/50',
    border: 'border-rose-200/50',
    icon: 'text-rose-600',
    text: 'text-rose-700',
    trend: 'text-rose-600'
  }
};

function StatsCard({ title, value, subtitle, trend, icon, color }: StatsCardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className={`${colors.bg} ${colors.border} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.icon} p-3 rounded-xl bg-white/50`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm">
            {trend.isPositive !== false ? (
              <FiTrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <FiTrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={trend.isPositive !== false ? 'text-green-600' : 'text-red-600'}>
              +{trend.value}
            </span>
            <span className="text-gray-500 text-xs">{trend.period}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
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
          <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-8 bg-gray-200 rounded"></div>
              <div className="w-24 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Active Account</h2>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                Wallet Age: <span className="font-semibold">{stats.walletAge}</span>
              </span>
              <span className="flex items-center gap-1">
                <FiActivity className="w-4 h-4" />
                Period: <span className="font-semibold">{stats.timeframe}</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Balance (MON)</p>
            <p className="text-3xl font-bold text-slate-700">{parseFloat(stats.overview.balance).toFixed(4)}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Interactions"
          value={stats.interactions.total.toLocaleString()}
          subtitle={`Approve: ${stats.interactions.approvals}`}
          trend={{
            value: Math.floor(stats.interactions.total * 0.1),
            period: stats.interactions.period,
            isPositive: true
          }}
          icon={<FiActivity className="w-6 h-6" />}
          color="blue"
        />

        <StatsCard
          title="Interacted Contracts"
          value={stats.interactions.uniqueContracts.toLocaleString()}
          subtitle={`Deploy: ${stats.interactions.deployments} • Total: ${stats.interactions.total}`}
          trend={{
            value: Math.floor(stats.interactions.uniqueContracts * 0.15),
            period: stats.interactions.period,
            isPositive: true
          }}
          icon={<FiSettings className="w-6 h-6" />}
          color="green"
        />

        <StatsCard
          title="Volume (MON)"
          value={parseFloat(stats.volume.total).toFixed(4)}
          subtitle={`${parseFloat(stats.volume.total).toFixed(4)} MON`}
          trend={{
            value: Math.floor(parseFloat(stats.volume.total) * 0.2),
            period: stats.volume.period,
            isPositive: true
          }}
          icon={<FiBarChart className="w-6 h-6" />}
          color="purple"
        />

        <StatsCard
          title="NFT Mint"
          value={stats.nfts.minted}
          subtitle={`Unique: ${stats.nfts.unique} • Total: ${stats.nfts.minted}`}
          trend={{
            value: Math.floor(stats.nfts.minted * 0.1),
            period: stats.nfts.period,
            isPositive: true
          }}
          icon={<FiImage className="w-6 h-6" />}
          color="orange"
        />

        <StatsCard
          title="Fees (MON)"
          value={parseFloat(stats.fees.total).toFixed(6)}
          subtitle={`${parseFloat(stats.fees.total).toFixed(6)} MON`}
          trend={{
            value: Math.floor(parseFloat(stats.fees.total) * 100) / 100,
            period: stats.fees.period,
            isPositive: false
          }}
          icon={<FiDollarSign className="w-6 h-6" />}
          color="pink"
        />

        <StatsCard
          title="Daily Activity"
          value={stats.activity.avgPerDay.toFixed(1)}
          subtitle={`${stats.activity.totalDays} active days`}
          trend={{
            value: Math.floor(stats.activity.avgPerDay * 0.2),
            period: stats.timeframe,
            isPositive: true
          }}
          icon={<FiZap className="w-6 h-6" />}
          color="teal"
        />

        <StatsCard
          title="Unique Tokens"
          value={stats.tokens.uniqueTokens}
          subtitle={`Token: ${stats.tokens.uniqueTokens} • NFT: ${stats.tokens.uniqueNFTs}`}
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
          subtitle="All time transactions"
          icon={<FiActivity className="w-6 h-6" />}
          color="rose"
        />
      </div>
    </div>
  );
}
