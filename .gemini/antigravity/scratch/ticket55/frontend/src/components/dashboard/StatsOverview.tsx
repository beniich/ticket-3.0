'use client';

import React from 'react';
import { TrendingUp, Clock, Users, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { DashboardStats } from '@/types/dashboard';

interface StatsOverviewProps {
    stats: DashboardStats;
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
    const statItems = [
        {
            title: 'Total Tickets',
            value: stats.totalComplaints,
            icon: Zap,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            trend: '+5.2%',
            trendUp: true
        },
        {
            title: 'New Cases',
            value: stats.newComplaints,
            icon: AlertTriangle,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
            trend: '+2',
            trendUp: true
        },
        {
            title: 'In Progress',
            value: stats.inProgress,
            icon: Clock,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            trend: 'Active',
            trendUp: true
        },
        {
            title: 'Resolved',
            value: stats.resolved,
            icon: CheckCircle,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            trend: '94%',
            trendUp: true
        },
        {
            title: 'Urgent',
            value: stats.urgent,
            icon: AlertTriangle,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            trend: 'Critical',
            trendUp: false
        },
        {
            title: 'AI Accuracy',
            value: `${stats.aiAccuracy}%`,
            icon: TrendingUp,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            trend: 'Optimal',
            trendUp: true
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {statItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                    <div key={index} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${item.bgColor} ${item.color} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>
                                <IconComponent size={20} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${item.trendUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                }`}>
                                {item.trend}
                            </span>
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{item.title}</h3>
                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{item.value}</p>
                    </div>
                );
            })}
        </div>
    );
};
