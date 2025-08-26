// File: src/components/DashboardCard.tsx

import React from 'react';

// Tentukan tipe data (props) yang bisa diterima oleh komponen kartu ini
interface CardProps {
    title: string;
    value: string;
    unit?: string; // unit ini opsional, seperti "MON" atau "Gwei"
    icon?: React.ReactNode; // ikon juga opsional
}

const DashboardCard: React.FC<CardProps> = ({ title, value, unit, icon }) => {
    return (
        // Styling menggunakan Tailwind CSS untuk tampilan modern, soft, dan minimalis
        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-400">{title}</p>
                {icon && <div className="text-slate-500">{icon}</div>}
            </div>
            <div>
                <h2 className="text-2xl font-semibold text-slate-50 truncate">
                    {value} <span className="text-xl text-slate-300">{unit}</span>
                </h2>
            </div>
        </div>
    );
};

export default DashboardCard;