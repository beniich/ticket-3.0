'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-surface-dark/80 backdrop-blur-md border-b border-border-dark px-6 py-3">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-1.5 rounded-lg text-white">
                            <span className="material-symbols-outlined block">confirmation_number</span>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-white">
                            Intervention<span className="text-primary">Hub</span>
                        </h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="#"
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="#"
                            className="text-sm font-semibold text-primary"
                        >
                            Complaints
                        </Link>
                        <Link
                            href="#"
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Teams
                        </Link>
                        <Link
                            href="#"
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Reports
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden lg:block">
                        <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl transition-colors ${searchFocused ? 'text-primary' : 'text-slate-500'}`}>
                            search
                        </span>
                        <input
                            className="bg-slate-900 border-border-dark border rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary text-slate-300 placeholder:text-slate-600 outline-none transition-all"
                            placeholder="Search tickets..."
                            type="text"
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>
                    <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 relative transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-surface-dark"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-border-dark cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                        <img
                            alt="User profile avatar"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7Ew0JGt278WMCLTQZEheYW7POzl6td2OVh-AxEPOvAhXsRQc4Wv5J0uVsNPW2ASgulBBWC_QvDRUX33Lsmw3nHkmA4F4QBoTNmx2nmWhMBvD5Q3sSYuonHiriVyKqX5RLdqAO853pUe5WTg-sm5kgpMQu-hUD5xojrbt620RRqx_lMH2YMn_2ahGoFBitVN7T2gVs_ER7x5DtQk-EeZapPLgHzzIazbkOobxGLNGNHWidoe2NaAjkztPSOmlgVdpEDjH0y8aUJce7"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
