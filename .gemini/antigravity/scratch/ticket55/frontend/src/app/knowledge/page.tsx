'use client';

import React, { useState } from 'react';
import {
    Library,
    Search,
    Bell,
    ChevronRight,
    Upload,
    Folder,
    FolderInput,
    Users,
    Hammer,
    MoreVertical,
    LayoutGrid,
    List,
    FileText,
    MoreHorizontal,
    ScrollText,
    CheckCircle,
    X,
    Printer,
    Download,
    BadgeCheck,
    Clock,
    Pending
} from 'lucide-react';

export default function SOPLibraryPage() {
    const [isReadingMode, setIsReadingMode] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);

    const openDocument = (doc: any) => {
        setSelectedDoc(doc);
        setIsReadingMode(true);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col">
            {/* Header / Navigation */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Library className="text-primary w-6 h-6" />
                    </div>
                    <h1 className="font-bold text-xl tracking-tight">SOP Library</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <input
                            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 w-64 text-sm transition-all focus:w-80"
                            placeholder="Search documents..."
                            type="text"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    </div>
                    <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                        <Bell className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs border border-primary/30">
                        JD
                    </div>
                </div>
            </header>

            <main className="flex-1 p-8">
                {/* Breadcrumbs & Actions */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <nav className="flex items-center text-sm text-slate-500 gap-2">
                            <a className="hover:text-primary" href="#">Library</a>
                            <ChevronRight className="w-3 h-3" />
                            <a className="hover:text-primary" href="#">Operations</a>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-slate-900 dark:text-white font-medium">Standard Procedures</span>
                        </nav>
                        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
                            <Upload className="w-4 h-4" />
                            <span className="font-medium text-sm">Upload SOP</span>
                        </button>
                    </div>

                    {/* Folder Section */}
                    <div className="mb-10">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Departmental Folders</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Folder Card */}
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Folder className="w-6 h-6" />
                                    </div>
                                    <MoreVertical className="text-slate-400 w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Health & Safety</h3>
                                <p className="text-xs text-slate-500">12 Documents • Last updated 2d ago</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-primary">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FolderInput className="w-6 h-6" />
                                    </div>
                                    <MoreVertical className="text-slate-400 w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Operations</h3>
                                <p className="text-xs text-slate-500">48 Documents • Last updated 4h ago</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <MoreVertical className="text-slate-400 w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Human Resources</h3>
                                <p className="text-xs text-slate-500">24 Documents • Last updated 1w ago</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Hammer className="w-6 h-6" />
                                    </div>
                                    <MoreVertical className="text-slate-400 w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Engineering</h3>
                                <p className="text-xs text-slate-500">31 Documents • Last updated 12h ago</p>
                            </div>
                        </div>
                    </div>

                    {/* Documents Table/Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent & Critical Documents</h2>
                            <div className="flex gap-2">
                                <button className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 rounded bg-primary text-white shadow-sm">
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-6 py-4">Document Name</th>
                                        <th className="px-6 py-4">Department</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Last Modified</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {/* Document Row */}
                                    <tr
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                                        onClick={() => openDocument({ title: 'Safety Protocol v2.4', type: 'PDF' })}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                                    <FileText className="text-red-500 w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Safety Protocol v2.4</div>
                                                    <div className="text-[10px] text-slate-400">PDF • 1.2MB</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Operations</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-1.5 text-amber-500">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-xs font-medium">Pending Review</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            Oct 12, 2023
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-primary"><MoreHorizontal className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                                    <ScrollText className="text-blue-500 w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Employee Handbook 2024</div>
                                                    <div className="text-[10px] text-slate-400">DOCX • 3.5MB</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">HR</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-1.5 text-emerald-500">
                                                <CheckCircle className="w-3 h-3" />
                                                <span className="text-xs font-medium">Acknowledged</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            Nov 02, 2023
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-primary"><MoreHorizontal className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Reading View Modal / Overlay */}
            {isReadingMode && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 md:p-8 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-background-dark w-full h-full max-w-7xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="h-16 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsReadingMode(false)}>
                                    <X className="text-slate-500 w-5 h-5" />
                                </button>
                                <div>
                                    <h2 className="font-bold text-slate-900 dark:text-white">{selectedDoc?.title || 'Document'}</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Operational Compliance • Approved by Sarah Miller</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                                    <Printer className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                                    <Download className="w-5 h-5" />
                                </button>
                                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                                <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                                    <BadgeCheck className="w-4 h-4" />
                                    Mark as Read
                                </button>
                            </div>
                        </div>
                        {/* Modal Content Layout */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Sidebar: Table of Contents */}
                            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 overflow-y-auto p-6 hidden md:block">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Table of Contents</h3>
                                <ul className="space-y-4 text-sm">
                                    <li className="font-semibold text-primary flex items-center gap-2">
                                        <div className="w-1 h-4 bg-primary rounded-full"></div>
                                        1. Introduction
                                    </li>
                                    <li className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer pl-3">
                                        2. Emergency Procedures
                                    </li>
                                    <li className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer pl-3">
                                        3. Hazard Identification
                                    </li>
                                    <li className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer pl-3">
                                        4. PPE Requirements
                                    </li>
                                    <li className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer pl-3">
                                        5. Reporting Incidents
                                    </li>
                                    <li className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer pl-3">
                                        6. Maintenance Logs
                                    </li>
                                </ul>
                                <div className="mt-12 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                    <p className="text-xs text-primary font-bold mb-2">Compliance Alert</p>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">Please ensure you read section 4 & 5 thoroughly as they contain new regulatory updates.</p>
                                </div>
                            </aside>
                            {/* Main Reading Area */}
                            <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/20 scroll-smooth no-scrollbar">
                                <div className="max-w-3xl mx-auto py-12 px-8">
                                    <article className="prose prose-slate dark:prose-invert">
                                        <div className="h-64 w-full rounded-xl overflow-hidden mb-8 relative">
                                            <img className="w-full h-full object-cover" data-alt="Close up of safety equipment in industrial setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCobwfy-FWAixx_DgXDx5bcEAJSoKZXYGUYJoSYDNj8n5imnuHFnSkp5Sz7ESvFvF9pz5TsDDcccsYkMmxSGXSVu1c_XRz_2Sgb21MT3gmvoDDy34_hJgUDfcXcvOhkLKOtyAMO2Sgn_WUdQn47kFYJA1mEX_Zirj80LNglKRx444a4GVHlyYQ63iNTyGn9xAH-_6PWMaN268vn7ly_AE6chksyGCYFDxWbd2jyeAZT42-GxOjrzshfVrkG6SGDE1silSgz2QnwqECg" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Section 1</p>
                                                <h3 className="text-xl font-bold">Introduction to Safety</h3>
                                            </div>
                                        </div>
                                        <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
                                            <p className="text-lg font-medium text-slate-900 dark:text-white">The safety of our personnel is the highest priority within all operational facilities. This standard operating procedure outlines the mandatory steps to ensure a secure environment.</p>
                                            <p>Standard Operating Procedures (SOPs) are step-by-step instructions compiled by an organization to help workers carry out complex routine operations. SOPs aim to achieve efficiency, quality output, and uniformity of performance, while reducing miscommunication and failure to comply with industry regulations.</p>
                                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Key Objectives</h4>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li>Protect employees from physical hazards and long-term health risks.</li>
                                                <li>Ensure compliance with national and international labor safety standards.</li>
                                                <li>Minimize operational downtime caused by preventable accidents.</li>
                                            </ul>
                                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-l-4 border-l-primary shadow-sm my-8">
                                                <h5 class="font-bold text-slate-900 dark:text-white mb-2">Note on Version 2.4</h5>
                                                <p class="text-sm">This version includes updated thermal protection guidelines for Section 4. Previous guidelines (v2.3) are no longer valid for site operations.</p>
                                            </div>
                                            <p>Failure to adhere to these protocols will result in immediate disciplinary action and may lead to removal from the operational site. Supervision is required for all new staff for the first 48 hours of duty.</p>
                                        </div>
                                    </article>
                                </div>
                            </div>
                            {/* Right Sidebar: Metadata & History */}
                            <aside className="w-72 border-l border-slate-200 dark:border-slate-800 flex-shrink-0 overflow-y-auto p-6 hidden lg:block">
                                <div className="mb-8">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Metadata</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] text-slate-400">Current Version</p>
                                            <p className="text-sm font-semibold">2.4.1 (Stable)</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400">Effective Date</p>
                                            <p className="text-sm font-semibold">October 15, 2023</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400">Document Owner</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px]">SM</div>
                                                <p className="text-sm font-semibold">Sarah Miller</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Version History</h3>
                                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                                        {/* History Item */}
                                        <div className="relative pl-8">
                                            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                                                <CheckCircle className="text-white w-3 h-3" />
                                            </div>
                                            <p className="text-xs font-bold">Version 2.4</p>
                                            <p className="text-[10px] text-slate-400">Oct 12, 2023 • Sarah Miller</p>
                                            <p className="text-[10px] text-slate-500 mt-1 italic">Added thermal protection guidelines.</p>
                                        </div>
                                        <div className="relative pl-8">
                                            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center z-10 border-4 border-white dark:border-background-dark">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Version 2.3</p>
                                            <p className="text-[10px] text-slate-400">Aug 05, 2023 • Mike Ross</p>
                                        </div>
                                        <div className="relative pl-8">
                                            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center z-10 border-4 border-white dark:border-background-dark">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Version 2.2</p>
                                            <p className="text-[10px] text-slate-400">Jan 22, 2023 • Mike Ross</p>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                        {/* Reading Progress Bar */}
                        <div className="h-1 bg-slate-100 dark:bg-slate-800 w-full flex-shrink-0">
                            <div className="h-full bg-primary w-1/3 transition-all"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
