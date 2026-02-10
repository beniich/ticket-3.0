'use client';

import React, { useState } from 'react';
import {
    Map as MapIcon,
    Search,
    Bell,
    Layers,
    Droplets,
    Zap,
    Flame,
    Lightbulb,
    Info,
    TrendingUp,
    TrendingDown,
    Navigation,
    Plus,
    Minus,
    LocateFixed,
    Truck,
    AlertTriangle,
    Clock,
    X,
    MoreVertical,
    Activity
} from 'lucide-react';

export default function GeoOpsMapPage() {
    const [layers, setLayers] = useState({
        water: true,
        electricity: true,
        gas: false,
        lighting: true,
    });

    const toggleLayer = (layer: keyof typeof layers) => {
        setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-hidden h-screen font-display flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg text-white shadow-lg shadow-primary/20">
                            <MapIcon className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">
                            GeoOps <span className="text-primary font-medium">Manager</span>
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            className="w-80 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 transition-all focus:w-96 outline-none"
                            placeholder="Search technicians, incidents, infrastructure..."
                            type="text"
                        />
                    </div>
                    <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
                    </button>
                    <div className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Avatar" />
                    </div>
                </div>
            </header>

            <main className="relative flex flex-1 overflow-hidden">
                {/* Sidebar Controls */}
                <aside className="w-80 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 flex flex-col z-40 shadow-2xl overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                        {/* Service Layers */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Service Layers</h3>
                                <Info className="w-4 h-4 text-slate-300 cursor-help" />
                            </div>
                            <div className="space-y-2">
                                <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all border ${layers.water ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${layers.water ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            <Droplets size={16} />
                                        </div>
                                        <span className="text-sm font-bold">Water Supply</span>
                                    </div>
                                    <input type="checkbox" checked={layers.water} onChange={() => toggleLayer('water')} className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" />
                                </label>
                                <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all border ${layers.electricity ? 'bg-amber-500/5 border-amber-500/20 text-amber-600' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${layers.electricity ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            <Zap size={16} />
                                        </div>
                                        <span className="text-sm font-bold">Electricity Grid</span>
                                    </div>
                                    <input type="checkbox" checked={layers.electricity} onChange={() => toggleLayer('electricity')} className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 h-4 w-4" />
                                </label>
                                <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all border ${layers.gas ? 'bg-orange-500/5 border-orange-500/20 text-orange-600' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${layers.gas ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            <Flame size={16} />
                                        </div>
                                        <span className="text-sm font-bold">Gas Network</span>
                                    </div>
                                    <input type="checkbox" checked={layers.gas} onChange={() => toggleLayer('gas')} className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4" />
                                </label>
                                <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all border ${layers.lighting ? 'bg-sky-500/5 border-sky-500/20 text-sky-600' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${layers.lighting ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            <Lightbulb size={16} />
                                        </div>
                                        <span className="text-sm font-bold">Public Lighting</span>
                                    </div>
                                    <input type="checkbox" checked={layers.lighting} onChange={() => toggleLayer('lighting')} className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 h-4 w-4" />
                                </label>
                            </div>
                        </section>

                        {/* Operations Summary */}
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Operations Summary</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Active Complaints</p>
                                    <p className="text-2xl font-black mt-1">124</p>
                                    <div className="flex items-center gap-1 mt-1 text-emerald-500 font-bold text-[10px]">
                                        <TrendingUp size={10} /> +12%
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Teams On-Site</p>
                                    <p className="text-2xl font-black mt-1">42</p>
                                    <div className="flex items-center gap-1 mt-1 text-rose-500 font-bold text-[10px]">
                                        <TrendingDown size={10} /> -5%
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Priority Legend */}
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Priority Heatmap</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-3 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse"></div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Critical Priority</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">18 INCIDENTS</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-3 rounded-full bg-amber-500"></div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">High Priority</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">34 INCIDENTS</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-3 rounded-full bg-primary"></div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Low Priority</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">72 INCIDENTS</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <button className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/25">
                            <Navigation size={20} fill="currentColor" />
                            <span>Dispatch Dashboard</span>
                        </button>
                    </div>
                </aside>

                {/* Main Map View */}
                <div className="flex-1 relative bg-slate-100 dark:bg-slate-900">
                    {/* Simulated Map Background */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center grayscale shadow-inner brightness-[0.8] contrast-[1.1]"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&h=1080&fit=crop')",
                            filter: 'saturate(0.4) brightness(0.6)'
                        }}
                    />

                    {/* Floating Controls */}
                    <div className="absolute right-6 top-6 flex flex-col gap-3 z-30">
                        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-1 flex flex-col border border-slate-200 dark:border-slate-700">
                            <button className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"><Plus size={20} /></button>
                            <button className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors border-t border-slate-100 dark:border-slate-700"><Minus size={20} /></button>
                        </div>
                        <button className="bg-white dark:bg-slate-800 p-3 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all">
                            <LocateFixed size={20} className="text-primary" />
                        </button>
                        <button className="bg-white dark:bg-slate-800 p-3 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all">
                            <Layers size={20} className="text-slate-500" />
                        </button>
                    </div>

                    {/* Markers */}
                    {/* Truck Marker */}
                    <div className="absolute top-[40%] left-[35%] z-20 group cursor-pointer">
                        <div className="flex flex-col items-center gap-1">
                            <div className="relative">
                                <div className="bg-primary text-white p-2.5 rounded-2xl shadow-xl ring-4 ring-white dark:ring-slate-800 group-hover:scale-125 transition-transform duration-300">
                                    <Truck size={20} />
                                </div>
                                <div className="absolute -top-1 -right-1 size-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></div>
                            </div>
                            <span className="bg-slate-900/80 backdrop-blur text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Unit-104</span>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-700 p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all pointer-events-none">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Team Alpha</span>
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Water Main Repair</h4>
                            <p className="text-[10px] text-slate-500 mt-1">En route • ETA 4m 30s</p>
                            <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-2/3"></div>
                            </div>
                        </div>
                    </div>

                    {/* Incident Markers */}
                    <div className="absolute top-[25%] left-[65%] z-10">
                        <div className="size-8 bg-red-500/20 rounded-full flex items-center justify-center animate-ping duration-[2000ms]">
                            <div className="size-4 bg-red-500 rounded-full ring-4 ring-white dark:ring-slate-800 shadow-lg"></div>
                        </div>
                    </div>

                    {/* Incident Sidebar (Floating Details) */}
                    <div className="absolute bottom-8 right-8 w-96 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 px-8 py-8 z-40">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="size-14 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-3xl flex items-center justify-center shadow-inner">
                                    <AlertTriangle size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg text-slate-900 dark:text-white tracking-tight leading-none">Main Pipe Burst</h4>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">#INC-9821 • Sector 7</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X size={20} className="text-slate-400" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-red-500"></div>
                                    <span className="text-xs font-black text-red-600">CRITICAL</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Active</p>
                                <div className="flex items-center gap-2">
                                    <Clock size={12} className="text-slate-400" />
                                    <span className="text-xs font-bold">22m 14s</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.03] transition-transform">Dispatch Team</button>
                            <button className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl hover:bg-slate-200 transition-colors"><MoreVertical size={20} /></button>
                        </div>
                    </div>

                    {/* Legend / Ticker */}
                    <div className="absolute bottom-8 left-8 flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-5 py-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
                        <div className="relative animate-pulse">
                            <div className="size-2 bg-emerald-500 rounded-full"></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Geo-Engine Active</span>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">SAT-L1-B4 Connection Stable</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
