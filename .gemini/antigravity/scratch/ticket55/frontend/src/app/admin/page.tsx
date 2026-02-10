'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <div className="layout-container flex h-full grow flex-col">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-10 py-3 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="size-8 flex items-center justify-center bg-primary text-white rounded-lg">
                                <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">AdminPanel</h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/admin" className="text-primary text-sm font-semibold leading-normal border-b-2 border-primary pb-1">Dashboard</Link>
                            <Link href="#" className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary transition-colors">Complaints</Link>
                            <Link href="#" className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary transition-colors">Interventions</Link>
                            <Link href="#" className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary transition-colors">Logs</Link>
                            <Link href="#" className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary transition-colors">Settings</Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end gap-4 items-center">
                        <label className="hidden sm:flex flex-col min-w-40 h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <div className="text-slate-500 dark:text-slate-400 flex items-center justify-center pl-3">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </div>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-0 focus:ring-0 h-full placeholder:text-slate-500 text-sm font-normal px-2"
                                    placeholder="Search system logs..."
                                    defaultValue=""
                                />
                            </div>
                        </label>
                        <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-slate-800 shadow-sm"
                            data-alt="System administrator profile avatar thumbnail"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBBHj_xCL5iwV1NRIklHaFgwwR1cyzbIWRKajIo6-S_LYfxAsRSuRPmsiD_4UyIg2FD0vOowEWgc6kjbZheISA3zr385-VqZp-A55drk7OAvn8ZvR53TZsTU9C3qT5Fe75kuORmqqT06YoZdJk5DOUOic-L0aU20Jxd0HvrfMik1v-m5cYEP8_-BUk2uBCyWZxyOgQb-vzZy9PesxfOKMUuIeyUD55d9AU9qAIn8IKtuHc6OLkRbf0xWhgCZjHzYrs-nUh4UJs-uKx")' }}
                        ></div>
                    </div>
                </header>

                <main className="flex-1 px-6 lg:px-40 py-8 max-w-[1440px] mx-auto w-full">
                    {/* Page Title & Refresh Area */}
                    <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">System Admin Overview</h1>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                <p>Last Refreshed: 2 minutes ago</p>
                                <span className="mx-1">•</span>
                                <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                                    <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Live Monitoring Active
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 cursor-pointer justify-center rounded-lg h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-lg">download</span>
                                <span>Export Report</span>
                            </button>
                            <button className="flex items-center gap-2 cursor-pointer justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                                <span className="material-symbols-outlined text-lg">refresh</span>
                                <span>Refresh Data</span>
                            </button>
                        </div>
                    </div>

                    {/* Core Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Active Users</p>
                                <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-lg">group</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">1,284</p>
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+5.2%</span>
                                <span className="text-slate-400 font-normal">vs last hour</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Open Complaints</p>
                                <span className="material-symbols-outlined text-orange-500 bg-orange-500/10 p-1.5 rounded-lg text-lg">report_problem</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">42</p>
                            <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm font-semibold">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+12%</span>
                                <span className="text-slate-400 font-normal">urgent attention</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Interventions</p>
                                <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-lg">engineering</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">15</p>
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                                <span className="material-symbols-outlined text-sm">trending_down</span>
                                <span>-3.4%</span>
                                <span className="text-slate-400 font-normal">clearing backlog</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">System Uptime</p>
                                <span className="material-symbols-outlined text-green-500 bg-green-500/10 p-1.5 rounded-lg text-lg">check_circle</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">99.98%</p>
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                                <span className="material-symbols-outlined text-sm">stat_0</span>
                                <span>Stable</span>
                                <span className="text-slate-400 font-normal">last 30 days</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts & Server Health */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Traffic Chart Card */}
                        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 shadow-sm">
                            <div>
                                <p className="text-slate-900 dark:text-white text-lg font-bold">System Traffic vs Resources</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time throughput (Req/sec) over last 24 hours</p>
                            </div>
                            <div className="flex flex-col gap-6 py-4">
                                <div className="h-[200px] w-full relative">
                                    <svg className="overflow-visible" fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V150H0V109Z" fill="url(#trafficGradient)"></path>
                                        <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#2424eb" strokeLinecap="round" strokeWidth="3"></path>
                                        <defs>
                                            <linearGradient gradientUnits="userSpaceOnUse" id="trafficGradient" x1="236" x2="236" y1="1" y2="150">
                                                <stop stopColor="#2424eb" stopOpacity="0.2"></stop>
                                                <stop offset="1" stopColor="#2424eb" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold tracking-wider">
                                    <span>00:00</span>
                                    <span>06:00</span>
                                    <span>12:00</span>
                                    <span>18:00</span>
                                    <span>23:59</span>
                                </div>
                            </div>
                        </div>
                        {/* Resource Categories Card */}
                        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-900 dark:text-white text-lg font-bold">Resource Usage by Component</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time allocation across server stack</p>
                                </div>
                                <span className="text-slate-900 dark:text-white text-2xl font-black">72% <span className="text-xs font-normal text-slate-500 uppercase">Avg</span></span>
                            </div>
                            <div className="grid h-[200px] grid-flow-col gap-8 grid-rows-[1fr_auto] items-end justify-items-center px-6 mt-4">
                                {/* CPU */}
                                <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                    <div className="bg-primary/10 dark:bg-primary/20 rounded-t-lg w-full transition-all duration-500 border-t-2 border-primary" style={{ height: '65%' }}></div>
                                    <span className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">CPU</span>
                                </div>
                                {/* RAM */}
                                <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                    <div className="bg-primary/10 dark:bg-primary/20 rounded-t-lg w-full transition-all duration-500 border-t-2 border-primary" style={{ height: '85%' }}></div>
                                    <span className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">RAM</span>
                                </div>
                                {/* Disk */}
                                <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                    <div className="bg-primary/10 dark:bg-primary/20 rounded-t-lg w-full transition-all duration-500 border-t-2 border-primary" style={{ height: '42%' }}></div>
                                    <span className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Disk</span>
                                </div>
                                {/* Network */}
                                <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                    <div className="bg-primary/10 dark:bg-primary/20 rounded-t-lg w-full transition-all duration-500 border-t-2 border-primary" style={{ height: '58%' }}></div>
                                    <span className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Net</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Layout: Logs and Service Health */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Service Status List (1 col) */}
                        <div className="lg:col-span-1 flex flex-col gap-4">
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold px-1">Service Status</h2>
                            <div className="flex flex-col gap-3">
                                {/* Service Item */}
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="size-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                        <span className="text-slate-900 dark:text-white font-medium text-sm">Main API Gateway</span>
                                    </div>
                                    <span className="text-green-600 dark:text-green-400 text-xs font-bold uppercase">Online</span>
                                </div>
                                {/* Service Item */}
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="size-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                        <span className="text-slate-900 dark:text-white font-medium text-sm">PostgreSQL Cluster</span>
                                    </div>
                                    <span className="text-green-600 dark:text-green-400 text-xs font-bold uppercase">Online</span>
                                </div>
                                {/* Service Item (Warning) */}
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="size-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                                        <span className="text-slate-900 dark:text-white font-medium text-sm">Email SMTP Relay</span>
                                    </div>
                                    <span className="text-orange-600 dark:text-orange-400 text-xs font-bold uppercase">Delayed</span>
                                </div>
                                {/* Service Item */}
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="size-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                        <span className="text-slate-900 dark:text-white font-medium text-sm">Intervention AI Model</span>
                                    </div>
                                    <span className="text-green-600 dark:text-green-400 text-xs font-bold uppercase">Online</span>
                                </div>
                                {/* Service Item */}
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="size-2 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                                        <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Legacy Audit Service</span>
                                    </div>
                                    <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Standby</span>
                                </div>
                            </div>
                            <button className="w-full mt-2 py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                Add Service Monitor
                            </button>
                        </div>

                        {/* System Logs (2 cols) */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-slate-900 dark:text-white text-xl font-bold">Real-time System Logs</h2>
                                <div className="flex gap-2">
                                    <button className="text-xs font-bold text-slate-500 uppercase hover:text-primary">Clear</button>
                                    <span className="text-slate-300">|</span>
                                    <button className="text-xs font-bold text-slate-500 uppercase hover:text-primary">Pause</button>
                                </div>
                            </div>
                            <div className="rounded-xl bg-slate-900 dark:bg-black p-4 font-mono text-sm overflow-hidden border border-slate-800 shadow-lg min-h-[400px]">
                                <div className="flex flex-col gap-1.5 overflow-y-auto h-[360px] scrollbar-thin scrollbar-thumb-slate-700 pr-2">
                                    <p className="text-slate-400"><span className="text-slate-500">[14:22:01]</span> <span className="text-blue-400">INFO:</span> Authentication service handshake successful.</p>
                                    <p className="text-slate-400"><span className="text-slate-500">[14:22:05]</span> <span className="text-green-400">SUCCESS:</span> Complaint #8822-X archived by Admin-2.</p>
                                    <p className="text-slate-400"><span className="text-slate-500">[14:22:18]</span> <span className="text-blue-400">INFO:</span> Intervention policy update broadcasted to all active nodes.</p>
                                    <p className="text-slate-400"><span className="text-slate-500">[14:23:45]</span> <span className="text-yellow-400">WARN:</span> High latency detected on EU-West regional bucket.</p>
                                    <p className="text-slate-400"><span className="text-slate-500">[14:24:12]</span> <span className="text-blue-400">INFO:</span> New intervention request registered (ID: INT-9102).</p>
                                    <p className="text-slate-400"><span className="text-slate-500">[14:25:01]</span> <span className="text-red-400">ERROR:</span> Failed login attempt detected from IP 192.168.1.104 (3 failed).</p>
                                    <p className="text-slate-400"><span className="text-slate-500">[14:25:03]</span> <span className="text-red-400">ERROR:</span> Rate limit triggered for IP 192.168.1.104.</p>
                                    <p className="text-slate-400"><span className="text-slate-500">[14:26:30]</span> <span className="text-blue-400">INFO:</span> Database vacuuming task completed successfully.</p>
                                    <p className="text-slate-400"><span className="text-slate-500">[14:27:12]</span> <span className="text-green-400">SUCCESS:</span> Platform maintenance mode disabled.</p>
                                    <p className="text-slate-200 animate-pulse"><span className="text-slate-500">[14:28:05]</span> <span className="text-blue-400">INFO:</span> Listening for new events on port 8080...</p>
                                    <p className="text-slate-400"><span className="text-slate-500">_</span></p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase border border-slate-200 dark:border-slate-700">Filter: Errors only</span>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase border border-slate-200 dark:border-slate-700">Filter: Auth Logs</span>
                                <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 rounded-full text-[10px] font-bold text-primary uppercase border border-primary/20">Active: System-wide</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Sticky Action Bar for quick commands */}
                <footer className="fixed bottom-6 right-6 flex flex-col gap-3">
                    <button className="flex size-14 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xl hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined">terminal</span>
                    </button>
                    <button className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-xl hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined">bolt</span>
                    </button>
                </footer>
            </div>
        </div>
    );
}
