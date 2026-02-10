'use client';

import React, { useState } from 'react';
import {
    CheckCircle2,
    AlertTriangle,
    Clock,
    MoreVertical,
    Search,
    Download,
    Plus,
    Calendar,
    Eye
} from 'lucide-react';
import { useComplaints, ComplaintStatus, ComplaintPriority } from '@/hooks/useComplaints';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ComplaintsListPage() {
    const { complaints, loading, error } = useComplaints();
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const getStatusColor = (status: ComplaintStatus) => {
        switch (status) {
            case 'résolue': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
            case 'en cours': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
            case 'nouvelle': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
            case 'fermée': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
            default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
        }
    };

    const getPriorityColor = (priority?: ComplaintPriority) => {
        switch (priority) {
            case 'urgent': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30';
            case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30';
            case 'medium': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30';
            case 'low': return 'text-slate-500 bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800';
            default: return 'text-slate-500 bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800';
        }
    };

    const stats = {
        open: complaints.filter(c => c.status === 'nouvelle' || c.status === 'en cours').length,
        critical: complaints.filter(c => c.priority === 'urgent').length,
        resolvedToday: complaints.filter(c => c.status === 'résolue' && new Date(c.updatedAt).toDateString() === new Date().toDateString()).length,
        total: complaints.length
    };

    const filteredComplaints = complaints.filter(c =>
        c.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.leakType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && complaints.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <AlertTriangle className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">Complaint Management</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Service & Intervention Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <a href="/complaints/new" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 text-sm font-bold">
                        <Plus className="w-4 h-4" />
                        New Complaint
                    </a>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {error && (
                    <div className="max-w-[1600px] mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="max-w-[1600px] mx-auto space-y-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Tickets</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.open}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="size-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Urgent</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.critical}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Resolved Day</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.resolvedToday}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="size-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Handled</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        {/* Toolbar */}
                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 w-full lg:w-auto">
                                <button className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm transition-all">All Complaints</button>
                                <button className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">Active Only</button>
                            </div>

                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                <div className="relative flex-1 lg:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Search complaints..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-primary transition-colors">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                        <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-12">
                                            <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                                        </th>
                                        <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Ticket # & Date</th>
                                        <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Customer</th>
                                        <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Leak Type / Priority</th>
                                        <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Address</th>
                                        <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Status</th>
                                        <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredComplaints.map((complaint) => (
                                        <tr key={complaint._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => window.location.href = `/complaints/${complaint._id}`}>
                                            <td className="px-6 py-4">
                                                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" onClick={(e) => e.stopPropagation()} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{complaint.number}</span>
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {format(new Date(complaint.createdAt), 'dd MMM, HH:mm', { locale: fr })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                        {complaint.firstName[0]}{complaint.lastName[0]}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{complaint.firstName} {complaint.lastName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{complaint.leakType}</span>
                                                    <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getPriorityColor(complaint.priority)}`}>
                                                        {complaint.priority || 'low'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500 font-medium truncate max-w-[180px]">{complaint.address}</span>
                                                    <span className="text-[10px] text-slate-400">{complaint.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 w-fit ${getStatusColor(complaint.status)}`}>
                                                    <span className="relative flex h-1.5 w-1.5">
                                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${complaint.status === 'résolue' ? 'bg-emerald-400' : 'bg-current'}`}></span>
                                                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${complaint.status === 'résolue' ? 'bg-emerald-500' : 'bg-current'}`}></span>
                                                    </span>
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredComplaints.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="size-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                        <Search className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-500">No complaints found</p>
                                                    <p className="text-xs text-slate-400">Try adjusting your search or filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Overlay (Simplified) */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Showing {filteredComplaints.length} of {complaints.length}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
