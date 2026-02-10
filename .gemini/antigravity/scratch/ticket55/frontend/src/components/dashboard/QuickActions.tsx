'use client';

import React from 'react';
import {
    Download,
    RefreshCw,
    BarChart3,
    MessageSquare,
    ChevronRight,
    Zap,
    DownloadCloud
} from 'lucide-react';

interface QuickActionsProps {
    onRefresh: () => void;
    onExport: () => void;
    autoRefresh: boolean;
    setAutoRefresh: (value: boolean) => void;
}

export const QuickActions = ({
    onRefresh,
    onExport,
    autoRefresh,
    setAutoRefresh
}: QuickActionsProps) => {
    const actions = [
        {
            icon: RefreshCw,
            label: 'Refresh Data',
            description: 'Sync live metrics',
            onClick: onRefresh,
            color: 'text-primary'
        },
        {
            icon: DownloadCloud,
            label: 'Export Report',
            description: 'Download CSV/PDF',
            onClick: onExport,
            color: 'text-emerald-500'
        },
        {
            icon: BarChart3,
            label: 'Analytics',
            description: 'Deep dive insights',
            onClick: () => console.log('Analyses'),
            color: 'text-purple-500'
        },
        {
            icon: MessageSquare,
            label: 'Feedback',
            description: 'User submissions',
            onClick: () => console.log('Feedback'),
            color: 'text-amber-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/50 transition-all text-left group"
                    >
                        <div className={`p-3 bg-slate-50 dark:bg-slate-800 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                            <IconComponent size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{action.label}</h4>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{action.description}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                    </button>
                );
            })}

            {/* Auto Refresh Toggle Placeholder or Extra feature */}
            <div className="lg:col-span-4 flex items-center justify-between px-6 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <Zap size={14} className={autoRefresh ? "text-primary fill-primary" : "text-slate-400"} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Auto-Sync Status: <span className={autoRefresh ? "text-emerald-500" : "text-slate-400"}>{autoRefresh ? 'ACTIVE' : 'DISABLED'}</span></span>
                </div>
                <div
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${autoRefresh ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                    <div className={`bg-white size-3 rounded-full shadow-sm transform transition-transform ${autoRefresh ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
            </div>
        </div>
    );
};
