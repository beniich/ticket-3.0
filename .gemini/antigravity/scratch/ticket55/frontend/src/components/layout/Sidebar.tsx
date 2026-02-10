'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SidebarProps {
    activeSection?: string;
}

export function Sidebar({ activeSection = 'branding' }: SidebarProps) {
    const menuItems = [
        { id: 'general', label: 'General', icon: 'dashboard' },
        { id: 'users', label: 'Users', icon: 'group' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications_active' },
        { id: 'security', label: 'Security', icon: 'security' },
        { id: 'branding', label: 'Branding', icon: 'palette' },
        { id: 'api', label: 'API Integrations', icon: 'api' },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-20">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-icons text-xl">settings</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">AdminHub</span>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        href="#"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${activeSection === item.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        <span className="material-icons">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 p-2">
                    <img
                        alt="User profile photo"
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMMFgHGDuuoH8cx5ZlX1r1ZKoT035gcGcqcfcnpWNI3REdyd0KwWNCil_YCfBHVuDjX0Bik5toqon6myLeKPCfP1Uvt4N2wJYwKHUtTwpcR1RkxBmkgBTEIV-OHuhXpUj_xV2YiTNPnbS9Ny_7pk7f5__Y0hNa20D4EkH-sWlGzMfs74QkvOsQBnyrxEpS6G2dYy6pY8TCIOia-nZs56HxZsosKAkli89gClVRDUTFkxuh5yHDIDWGxNKhqUyhtyeGuTRQlYqvRR3F"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">Alex Rivera</p>
                        <p className="text-xs text-slate-500 truncate">System Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
