'use client';

import { BrandSettings } from '@/types/settings';

interface BrandIdentityProps {
    brand: BrandSettings;
}

export function BrandIdentity({ brand }: BrandIdentityProps) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-icons text-primary">auto_awesome</span>
                    Brand Identity
                </h2>
                <button className="text-sm text-primary font-medium hover:underline">Edit Guide</button>
            </div>
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <label className="block text-sm font-semibold mb-4">Official Logo</label>
                        <div className="relative group">
                            <div className="w-full aspect-video bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                <img
                                    alt="Abstract blue logo concept"
                                    className="max-h-24 w-auto object-contain"
                                    src={brand.logo}
                                />
                            </div>
                            <button className="absolute bottom-4 right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-icons text-slate-600 dark:text-slate-300">cloud_upload</span>
                            </button>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">Recommended size: 512x512px. SVG or PNG.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-4">Brand Palette</label>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary"></div>
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Primary</div>
                                    <div className="text-sm font-mono font-bold">{brand.colors.primary}</div>
                                </div>
                                <button onClick={() => copyToClipboard(brand.colors.primary)}>
                                    <span className="material-icons text-slate-300 hover:text-primary cursor-pointer">content_copy</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-900"></div>
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Dark</div>
                                    <div className="text-sm font-mono font-bold">{brand.colors.dark}</div>
                                </div>
                                <button onClick={() => copyToClipboard(brand.colors.dark)}>
                                    <span className="material-icons text-slate-300 hover:text-primary cursor-pointer">content_copy</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500"></div>
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Success</div>
                                    <div className="text-sm font-mono font-bold">{brand.colors.success}</div>
                                </div>
                                <button onClick={() => copyToClipboard(brand.colors.success)}>
                                    <span className="material-icons text-slate-300 hover:text-primary cursor-pointer">content_copy</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-sm font-semibold mb-6 text-slate-400 uppercase tracking-widest">
                        Typography System
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <span className="text-xs text-slate-400 block mb-2">Heading ({brand.typography.heading})</span>
                            <h3 className="text-2xl font-bold leading-tight">
                                The quick brown fox jumps over the lazy dog
                            </h3>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <span className="text-xs text-slate-400 block mb-2">Body ({brand.typography.body})</span>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Design is not just what it looks like and feels like. Design is how it works.
                                Innovation distinguishes between a leader and a follower.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
