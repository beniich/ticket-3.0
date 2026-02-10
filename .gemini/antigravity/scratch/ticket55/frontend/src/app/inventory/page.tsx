'use client';

import React, { useState } from 'react';
import {
    Package,
    Search,
    AlertTriangle,
    ArrowUpRight,
    Filter,
    Plus,
    Truck,
    Gauge,
    Fuel,
    CheckCircle2,
    Box,
    Wrench,
    ClipboardList,
    DollarSign,
    MoreVertical,
    Download,
    RefreshCw,
    Tag
} from 'lucide-react';

const KPICard = ({ title, value, icon, trend, color }: { title: string, value: string, icon: React.ReactNode, trend: { value: string, isPositive: boolean }, color: string }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                {icon}
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend.isPositive ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                    {trend.value}
                </span>
            )}
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
    </div>
);

import { useInventory, InventoryItem } from '@/hooks/useInventory';

export default function InventoryPage() {
    const { items, loading, error, deleteItem } = useInventory();
    const [activeTab, setActiveTab] = useState('all');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
            case 'out_of_stock': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
            case 'in_use': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
            case 'maintenance': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
            default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'vehicles': return <Truck className="w-4 h-4" />;
            case 'tools': return <Wrench className="w-4 h-4" />;
            case 'parts': return <Box className="w-4 h-4" />;
            default: return <Tag className="w-4 h-4" />;
        }
    };

    const filteredItems = items.filter(item => {
        if (activeTab === 'all') return true;
        return item.category.toLowerCase() === activeTab.toLowerCase();
    });

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Package className="text-primary w-6 h-6" />
                    </div>
                    <h1 className="font-bold text-xl tracking-tight">Asset & Inventory</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <input
                            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 w-64 text-sm transition-all focus:w-80"
                            placeholder="Search assets, SKU, or tags..."
                            type="text"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    </div>
                    <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-sm font-bold">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm text-sm font-bold">
                        <Plus className="w-4 h-4" />
                        Add Item
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8">
                {/* KPI Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <KPICard
                        title="Total Assets"
                        value={items.length.toLocaleString()}
                        icon={<Box className="text-primary w-5 h-5" />}
                        trend={{ value: "+12%", isPositive: true }}
                        color="bg-primary/10"
                    />
                    <KPICard
                        title="Low Stock Items"
                        value={items.filter(i => i.quantity <= i.minQuantity).length.toString()}
                        icon={<AlertTriangle className="text-amber-500 w-5 h-5" />}
                        trend={{ value: "+3", isPositive: false }}
                        color="bg-amber-100 dark:bg-amber-900/20"
                    />
                    <KPICard
                        title="Total Value"
                        value={`${items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toLocaleString()} MAD`}
                        icon={<DollarSign className="text-emerald-500 w-5 h-5" />}
                        trend={{ value: "+5.2%", isPositive: true }}
                        color="bg-emerald-100 dark:bg-emerald-900/20"
                    />
                    <KPICard
                        title="In Maintenance"
                        value={items.filter(i => i.status === 'maintenance').length.toString()}
                        icon={<ClipboardList className="text-blue-500 w-5 h-5" />}
                        trend={{ value: "-2", isPositive: true }}
                        color="bg-blue-100 dark:bg-blue-900/20"
                    />
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
                        {['all', 'tools', 'parts', 'vehicles', 'other'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all capitalize ${activeTab === tab
                                    ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                {tab === 'all' ? 'All Items' : tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="font-bold">Sort by:</span>
                            <select className="bg-transparent font-bold text-slate-900 dark:text-white border-none focus:ring-0 cursor-pointer">
                                <option>Name</option>
                                <option>Value</option>
                                <option>Quantity</option>
                            </select>
                        </div>
                        <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-primary transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4">Item Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4 text-right">Value</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredItems.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500">
                                                    {getCategoryIcon(item.category)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</div>
                                                    <div className="text-[10px] text-slate-400">{item.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full capitalize">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                {item.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(item.status)}`}>
                                                {item.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                                                <span className="text-[10px] text-slate-400">{item.unit}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{(item.price * item.quantity).toLocaleString()} {item.currency}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredItems.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm font-bold">
                                            Aucun item trouvé
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Mock */}
                    <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-bold">Showing 1-6 of 250 items</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Previous</button>
                            <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">Next</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};;
