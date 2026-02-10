'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Filter,
    Plus,
    BarChart3,
    Users,
    Clock,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    CalendarDays,
    LayoutGrid,
    Target,
    Zap,
    MoreVertical
} from 'lucide-react';

export default function PlanningPage() {
    const [currentMonth] = useState('October 2024');

    // Mock Data for Resource Loading
    const departments = [
        { name: 'Water & Sanitation', capacity: 85, tasks: 42, color: 'bg-blue-500' },
        { name: 'Electrical Grid', capacity: 60, tasks: 28, color: 'bg-amber-500' },
        { name: 'Public Lighting', capacity: 95, tasks: 56, color: 'bg-red-500' },
        { name: 'Road Maintenance', capacity: 40, tasks: 15, color: 'bg-emerald-500' },
    ];

    const upcomingMilestones = [
        { id: 1, title: 'Quarterly Grid Inspection', date: 'Oct 15, 2024', status: 'In Prep' },
        { id: 2, title: 'Winter Season Readiness', date: 'Oct 28, 2024', status: 'Pending' },
        { id: 3, title: 'Main Pump Replacement Phase 2', date: 'Nov 05, 2024', status: 'Scheduled' },
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display flex flex-col">
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <BarChart3 className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">Strategic Planning</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Resource Allocation & Outlook</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button className="px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-white dark:bg-slate-700 shadow-sm text-primary">Monthly</button>
                        <button className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-500 hover:text-slate-900 transition-all">Quarterly</button>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm text-sm font-bold">
                        <Plus className="w-4 h-4" />
                        Create Plan
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto space-y-8">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-4 text-slate-500">
                                <Users size={20} />
                                <span className="text-xs font-bold uppercase tracking-widest">Active Personnel</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">124 / 150</p>
                            <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full w-[82%]"></div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-4 text-slate-500">
                                <Clock size={20} />
                                <span className="text-xs font-bold uppercase tracking-widest">Scheduled Hours</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">2,840h</p>
                            <p className="text-[10px] text-emerald-500 font-bold mt-1">+12% vs last month</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-4 text-slate-500">
                                <Target size={20} />
                                <span className="text-xs font-bold uppercase tracking-widest">Goal Completion</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">78%</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">12 goals pending</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-4 text-slate-500">
                                <Zap size={20} className="text-amber-500" />
                                <span className="text-xs font-bold uppercase tracking-widest">Response Index</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">4.8s</p>
                            <p className="text-[10px] text-emerald-500 font-bold mt-1">Outstanding</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Resource Loading Chart (Mock) */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Departmental Workload</h2>
                                        <p className="text-sm text-slate-500">Current resource allocation across municipal sectors.</p>
                                    </div>
                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {departments.map((dept) => (
                                        <div key={dept.name}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{dept.name}</span>
                                                <span className={`text-xs font-black ${dept.capacity > 90 ? 'text-red-500' : 'text-slate-500'}`}>
                                                    {dept.capacity}% Capacity
                                                </span>
                                            </div>
                                            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${dept.capacity > 90 ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]' : dept.color}`}
                                                    style={{ width: `${dept.capacity}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                <span>{dept.tasks} Active Tasks</span>
                                                <span>Next Review: 2d</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weekly Forecast Table */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Weekly Intervention Forecast</h2>
                                    <div className="flex gap-2">
                                        <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"><ChevronLeft size={16} /></button>
                                        <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"><ChevronRight size={16} /></button>
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-7 gap-4">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                        <div key={day} className="flex flex-col items-center gap-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
                                            <div className="relative w-full h-32 bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden flex flex-col justify-end">
                                                {/* Mock Bar Chart */}
                                                <div className="w-full bg-primary/20 h-[40%] mb-px" title="Low Priority"></div>
                                                <div className="w-full bg-primary/50 h-[30%] mb-px" title="Medium Priority"></div>
                                                <div className="w-full bg-primary h-[15%]" title="Critical Priority"></div>
                                            </div>
                                            <span className="text-xs font-bold">{Math.floor(Math.random() * 20 + 10)} Tasks</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar: Milestones & Goals */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Upcoming Milestones</h3>
                                <div className="space-y-6">
                                    {upcomingMilestones.map((milestone) => (
                                        <div key={milestone.id} className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 pb-2">
                                            <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-white dark:bg-slate-900 border-2 border-primary"></div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{milestone.title}</p>
                                            <p className="text-[10px] text-slate-500 mb-2">{milestone.date}</p>
                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                                                {milestone.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 py-2 rounded-xl text-xs font-bold text-primary hover:bg-primary/5 transition-colors border border-dashed border-primary/30">
                                    Add Milestone
                                </button>
                            </div>

                            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-primary rounded-lg text-white"><TrendingUp size={18} /></div>
                                    <h3 className="text-sm font-black text-primary uppercase">Strategic Alert</h3>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                    Public Lighting department is approaching <span className="font-bold text-red-500">95% capacity</span> for next week. Consider re-allocating secondary teams from Road Maintenance.
                                </p>
                                <button className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                    Auto-Balance Load
                                </button>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Team Performance</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700"></div>
                                        ))}
                                        <div className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">+12</div>
                                    </div>
                                    <button className="text-xs font-bold text-primary">View Teams</button>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        <span className="text-xs font-bold">18 Tickets Resolved</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">TODAY</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
