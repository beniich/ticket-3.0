'use client';

import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Filter,
    Plus,
    LayoutList,
    CalendarDays,
    MoreVertical,
    Clock,
    User,
    Wrench,
    Zap,
    Droplet,
    Flame,
    GripVertical,
    Search,
    Bell,
    Settings,
    Briefcase
} from 'lucide-react';

export default function MaintenanceSchedulePage() {
    const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');
    const [currentDate, setCurrentDate] = useState(new Date());

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Mock Schedule Data regarding Maintenance
    const scheduleItems = [
        { id: 1, title: 'Main Pump Service', type: 'Maintenance', startTime: '09:00', endTime: '11:30', assignee: 'John Doe', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
        { id: 2, title: 'Grid Inspection', type: 'Inspection', startTime: '13:00', endTime: '15:00', assignee: 'Jane Smith', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
        { id: 3, title: 'Valve Replacement', type: 'Repair', startTime: '10:00', endTime: '12:00', assignee: 'Mike Ross', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <CalendarIcon className="text-primary w-6 h-6" />
                    </div>
                    <h1 className="font-bold text-xl tracking-tight">Maintenance Schedule</h1>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 ml-4">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'timeline' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            Timeline
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm text-sm font-bold">
                        <Plus className="w-4 h-4" />
                        Schedule Job
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar: Availability & Resources */}
                <aside className="w-80 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto hidden lg:flex">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team Availability</h3>
                            <button className="text-[10px] font-bold text-primary hover:underline">View All</button>
                        </div>

                        <div className="space-y-6">
                            {/* Team Member */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">JD</div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">John Doe</p>
                                            <p className="text-[10px] text-slate-500">Master Electrician</p>
                                        </div>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                    <div className="w-[40%] bg-emerald-400 h-full"></div>
                                    <div className="w-[30%] bg-slate-200 h-full"></div>
                                    <div className="w-[30%] bg-emerald-400 h-full"></div>
                                </div>
                                <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                                    <span>08:00</span>
                                    <span>12:00</span>
                                    <span>16:00</span>
                                </div>
                            </div>

                            {/* Team Member */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">SM</div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Sarah Miller</p>
                                            <p className="text-[10px] text-slate-500">Safety Inspector</p>
                                        </div>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                    <div className="w-[60%] bg-amber-400 h-full"></div>
                                    <div className="w-[10%] bg-slate-200 h-full"></div>
                                    <div className="w-[30%] bg-amber-400 h-full"></div>
                                </div>
                                <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                                    <span>08:00</span>
                                    <span>Full Booked</span>
                                    <span>16:00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Upcoming Maintenance</h3>
                        <div className="space-y-4">
                            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                    <span className="text-xs font-bold text-orange-700 dark:text-orange-400">Boiler Service</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mb-2">Sector 7 Central Heating Unit needs annual descaling.</p>
                                <p className="text-[10px] font-bold text-slate-400">Due: Tomorrow, 10:00 AM</p>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Droplet className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Filter Replacement</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mb-2">Water filtration plant B - pre-filters change.</p>
                                <p className="text-[10px] font-bold text-slate-400">Due: Oct 28, 08:00 AM</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Schedule Area */}
                <main className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/20 overflow-hidden">
                    {/* Controls Bar */}
                    <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-background-dark">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                                <button className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition-all"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
                                <button className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition-all"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
                            </div>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{currentMonth}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 text-slate-500 hover:text-primary transition-colors">
                                <Filter className="w-3 h-3" />
                                Filter
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 text-slate-500 hover:text-primary transition-colors">
                                <LayoutList className="w-3 h-3" />
                                Density
                            </button>
                        </div>
                    </div>

                    {/* Content View */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {viewMode === 'calendar' ? (
                            <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                                {/* Weekday Headers */}
                                {days.map(day => (
                                    <div key={day} className="bg-slate-50 dark:bg-slate-900 p-2 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{day}</div>
                                ))}

                                {/* Calendar Days (Mock grid for October) */}
                                {Array.from({ length: 35 }).map((_, idx) => {
                                    const dayNum = idx - 2; // Offset to start calendar correctly
                                    const isToday = dayNum === 25; // Mock Today
                                    return (
                                        <div key={idx} className={`min-h-[120px] bg-white dark:bg-slate-900 p-2 relative group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${dayNum <= 0 ? 'opacity-30 pointer-events-none' : ''}`}>
                                            {dayNum > 0 && (
                                                <>
                                                    <span className={`text-xs font-bold ${isToday ? 'bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-500'}`}>{dayNum}</span>

                                                    {/* Mock Events */}
                                                    {dayNum === 25 && (
                                                        <div className="mt-2 space-y-1">
                                                            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2 py-1 rounded truncate border border-blue-200 dark:border-blue-800 cursor-pointer hover:brightness-95">
                                                                09:00 - Pump Service
                                                            </div>
                                                            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded truncate border border-emerald-200 dark:border-emerald-800 cursor-pointer hover:brightness-95">
                                                                13:00 - Grid Check
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dayNum === 26 && (
                                                        <div className="mt-2 space-y-1">
                                                            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-1 rounded truncate border border-amber-200 dark:border-amber-800 cursor-pointer hover:brightness-95">
                                                                All Day - Valve Replace
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                {/* Timeline Header */}
                                <div className="flex border-b border-slate-200 dark:border-slate-800">
                                    <div className="w-48 p-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800 shrink-0">Resource</div>
                                    <div className="flex-1 flex">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={i} className="flex-1 p-4 text-center text-xs font-bold text-slate-400 border-r border-slate-100 dark:border-slate-800/50">
                                                {8 + i}:00
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline Rows */}
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {['John Doe', 'Jane Smith', 'Mike Ross'].map((resource, idx) => (
                                        <div key={idx} className="flex group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <div className="w-48 p-4 border-r border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">{resource.split(' ').map(n => n[0]).join('')}</div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{resource}</span>
                                            </div>
                                            <div className="flex-1 relative">
                                                {/* Grid Lines */}
                                                <div className="absolute inset-0 flex pointer-events-none">
                                                    {Array.from({ length: 12 }).map((_, i) => (
                                                        <div key={i} className="flex-1 border-r border-slate-50 dark:border-slate-800/30"></div>
                                                    ))}
                                                </div>

                                                {/* Task Block Mock */}
                                                {idx === 0 && (
                                                    <div className="absolute top-2 bottom-2 left-[10%] w-[20%] bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-md flex items-center px-2 cursor-pointer hover:shadow-md">
                                                        <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 truncate">Main Pump Service</span>
                                                    </div>
                                                )}
                                                {idx === 1 && (
                                                    <div className="absolute top-2 bottom-2 left-[45%] w-[15%] bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-md flex items-center px-2 cursor-pointer hover:shadow-md">
                                                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 truncate">Grid Inspection</span>
                                                    </div>
                                                )}
                                                {idx === 2 && (
                                                    <div className="absolute top-2 bottom-2 left-[20%] w-[33%] bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 rounded-md flex items-center px-2 cursor-pointer hover:shadow-md">
                                                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 truncate">Valve Replacement</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
