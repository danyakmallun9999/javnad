// File: src/components/DashboardCard.tsx

import React from 'react';

// Tentukan tipe data (props) yang bisa diterima oleh komponen kartu ini
interface CardProps {
    title: string;
    value: string | number;
    unit?: string; // unit ini opsional, seperti "MON" atau "Gwei"
    icon?: React.ReactNode; // ikon juga opsional
    subtitle?: string; // subtitle opsional untuk info tambahan
    color?: "blue" | "green" | "purple" | "orange" | "pink" | "cyan"; // theme color
    loading?: boolean; // loading state
    clickable?: boolean; // apakah card bisa diklik
    onClick?: () => void; // handler untuk click
}

const DashboardCard: React.FC<CardProps> = ({ 
    title, 
    value, 
    unit, 
    icon, 
    subtitle,
    color = "blue",
    loading = false,
    clickable = false,
    onClick
}) => {
    // Color mapping untuk tema yang berbeda
    const colorMap = {
        blue: { 
            iconBg: "from-blue-500/20 to-cyan-500/20", 
            iconColor: "text-blue-400",
            accent: "border-blue-500/20"
        },
        green: { 
            iconBg: "from-green-500/20 to-emerald-500/20", 
            iconColor: "text-green-400",
            accent: "border-green-500/20"
        }, 
        purple: { 
            iconBg: "from-purple-500/20 to-violet-500/20", 
            iconColor: "text-purple-400",
            accent: "border-purple-500/20"
        },
        orange: { 
            iconBg: "from-orange-500/20 to-red-500/20", 
            iconColor: "text-orange-400",
            accent: "border-orange-500/20"
        },
        pink: { 
            iconBg: "from-pink-500/20 to-rose-500/20", 
            iconColor: "text-pink-400",
            accent: "border-pink-500/20"
        },
        cyan: { 
            iconBg: "from-cyan-500/20 to-teal-500/20", 
            iconColor: "text-cyan-400",
            accent: "border-cyan-500/20"
        }
    };

    const colors = colorMap[color];

    return (
        <div 
            className={`
                bg-white/5 backdrop-blur-lg p-5 rounded-xl border border-white/10 
                transition-all duration-300 group relative overflow-hidden
                ${clickable ? 'cursor-pointer hover:bg-white/8 hover:border-white/20 hover:scale-[1.02]' : 'hover:bg-white/8'}
                ${loading ? 'animate-pulse' : ''}
                ${colors.accent}
            `}
            onClick={clickable ? onClick : undefined}
        >
            {/* Subtle gradient overlay untuk depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
            
            {/* Header dengan title dan icon */}
            <div className="flex items-center justify-between mb-2 relative">
                <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                    {title}
                </p>
                {icon && (
                    <div className={`
                        p-2 rounded-lg bg-gradient-to-r transition-all duration-200
                        ${colors.iconBg} ${clickable ? 'group-hover:scale-110' : ''}
                    `}>
                        <div className={`w-4 h-4 ${colors.iconColor}`}>
                            {icon}
                        </div>
                    </div>
                )}
            </div>

            {/* Content area */}
            <div className="relative">
                {loading ? (
                    // Loading skeleton
                    <div className="space-y-2">
                        <div className="h-8 bg-slate-700/50 rounded animate-pulse"></div>
                        {subtitle && <div className="h-4 bg-slate-700/30 rounded w-2/3 animate-pulse"></div>}
                    </div>
                ) : (
                    <>
                        {/* Main value */}
                        <h2 className="text-2xl font-semibold text-slate-50 group-hover:text-white transition-colors truncate">
                            {value}
                            {unit && (
                                <span className="text-xl text-slate-300 group-hover:text-slate-200 transition-colors ml-1">
                                    {unit}
                                </span>
                            )}
                        </h2>
                        
                        {/* Subtitle jika ada */}
                        {subtitle && (
                            <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors mt-1 truncate">
                                {subtitle}
                            </p>
                        )}
                    </>
                )}
            </div>

            {/* Click indicator untuk clickable cards */}
            {clickable && (
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                </div>
            )}
        </div>
    );
};

export default DashboardCard;