'use client';

import React from 'react';
import {
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Filter,
    TrendingUp,
    CreditCard,
    Briefcase,
    PieChart,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Search,
    Eye,
    Receipt,
    Wallet,
    Calendar,
    ArrowRight
} from 'lucide-react';

import { useFinance, FinancialRecord } from '@/hooks/useFinance';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CostTrackingPage() {
    const { records, stats, loading, updateStatus } = useFinance();

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30';
            case 'approved': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30';
            default: return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800';
        }
    };

    const getTotalByType = (type: 'expense' | 'revenue') => {
        return stats?.stats?.find((s: any) => s._id === type)?.total || 0;
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Wallet className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">Finance Center</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cost Tracking & Invoicing</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-medium focus:ring-2 focus:ring-primary/20 transition-all focus:w-80"
                            placeholder="Search invoices, tickets..."
                            type="text"
                        />
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm text-sm font-bold">
                        <Receipt className="w-4 h-4" />
                        Bulk Invoice
                    </button>
                    <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="User" />
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto space-y-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><DollarSign size={20} /></div>
                                <span className="flex items-center gap-1 text-emerald-500 font-bold text-xs"><ArrowUpRight size={14} /> 12.5%</span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dépenses Totales</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {getTotalByType('expense').toLocaleString()} MAD
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl"><Briefcase size={20} /></div>
                                <span className="flex items-center gap-1 text-rose-500 font-bold text-xs"><ArrowDownRight size={14} /> 2.4%</span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matériel</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {(stats?.categoryStats?.find((s: any) => s._id === 'parts')?.total || 0).toLocaleString()} MAD
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl"><CreditCard size={20} /></div>
                                <span className="flex items-center gap-1 text-emerald-500 font-bold text-xs"><ArrowUpRight size={14} /> 18.1%</span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main d'œuvre</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {(stats?.categoryStats?.find((s: any) => s._id === 'labor')?.total || 0).toLocaleString()} MAD
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl"><PieChart size={20} /></div>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenus</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {getTotalByType('revenue').toLocaleString()} MAD
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Operational Spending Chart (Mock) */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Operational Spending</h2>
                                    <p className="text-sm text-slate-500">Monthly breakdown of intervention costs</p>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <button className="px-3 py-1 text-xs font-bold bg-white dark:bg-slate-700 shadow-sm rounded-md">Actual</button>
                                    <button className="px-3 py-1 text-xs font-bold text-slate-500">Forecast</button>
                                </div>
                            </div>
                            <div className="h-64 flex items-end justify-between px-4 pb-8 border-b border-slate-100 dark:border-slate-800/50">
                                {/* Bar Chart Implementation */}
                                {[40, 65, 55, 85, 95, 70].map((h, i) => (
                                    <div key={i} className="w-12 group relative flex flex-col items-center">
                                        <div
                                            className="w-full bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-t-lg shadow-[0_0_20px_rgba(36,36,235,0.1)] group-hover:shadow-[0_0_20px_rgba(36,36,235,0.3)]"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                        <span className="absolute -top-8 text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">${Math.floor(Math.random() * 20 + 20)}k</span>
                                        <span className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Material vs Labor Efficiency (Mock) */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Material vs. Labor</h2>
                                    <p className="text-sm text-slate-500">Year-to-date efficiency trend</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-900 dark:text-white">$165k Total</p>
                                    <p className="text-emerald-500 text-xs font-bold flex items-center justify-end gap-1"><TrendingUp size={12} /> +15% Efficiency</p>
                                </div>
                            </div>
                            <div className="flex-1 relative flex items-center justify-center">
                                <svg className="w-full h-40" viewBox="0 0 500 150">
                                    <path d="M0,130 C50,120 100,140 150,100 C200,60 250,90 300,50 C350,10 400,40 450,20 L500,10" fill="none" stroke="#137fec" strokeWidth="6" strokeLinecap="round" />
                                    <path d="M0,130 C50,120 100,140 150,100 C200,60 250,90 300,50 C350,10 400,40 450,20 L500,10 V150 H0 Z" fill="url(#grad)" opacity="0.1" />
                                    <defs>
                                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: '#137fec', stopOpacity: 1 }} />
                                            <stop offset="100%" style={{ stopColor: '#137fec', stopOpacity: 0 }} />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-x-0 bottom-0 flex justify-between px-2">
                                    <span className="text-[10px] font-bold text-slate-400">Q1 2024</span>
                                    <span className="text-[10px] font-bold text-slate-400">Q2 2024</span>
                                    <span className="text-[10px] font-bold text-slate-400">Q3 2024</span>
                                    <span className="text-[10px] font-bold text-slate-400">Q4 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">Detailed Intervention Costs</h2>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <select className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs appearance-none outline-none focus:ring-2 focus:ring-primary/20">
                                        <option>All Statuses</option>
                                        <option>Invoiced</option>
                                        <option>Pending</option>
                                    </select>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
                                    <Calendar className="w-4 h-4" /> Date Range
                                </button>
                                <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-primary">
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Ticket ID</th>
                                        <th className="px-6 py-4">Title & Location</th>
                                        <th className="px-6 py-4 text-right">Material</th>
                                        <th className="px-6 py-4 text-right">Labor</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {records.map((record) => (
                                        <tr key={record.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all group">
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-primary">{record.id.substring(record.id.length - 6).toUpperCase()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{record.category}</span>
                                                    <span className="text-[10px] text-slate-500 font-medium">{record.description}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-sm">
                                                {record.category === 'parts' ? record.amount.toLocaleString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-sm">
                                                {record.category === 'labor' ? record.amount.toLocaleString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-sm text-slate-900 dark:text-white">
                                                {record.amount.toLocaleString()} {record.currency}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(record.status)}`}>
                                                        {record.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary"><Eye size={16} /></button>
                                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary"><MoreHorizontal size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {records.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm font-bold">
                                                Aucun enregistrement financier trouvé
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center rounded-b-3xl">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 4 of 24 entries</span>
                            <div className="flex gap-2">
                                <button className="size-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-white transition-all"><ChevronLeft size={16} /></button>
                                <button className="size-8 rounded-lg bg-primary text-white text-xs font-bold shadow-md">1</button>
                                <button className="size-8 rounded-lg text-xs font-bold text-slate-500 hover:bg-white transition-all">2</button>
                                <button className="size-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-white transition-all"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
