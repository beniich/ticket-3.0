'use client';

import { SiteInfo } from '@/types/ticket';

interface SiteMapProps {
    site: SiteInfo;
}

export function SiteMap({ site }: SiteMapProps) {
    return (
        <div className="bg-surface-dark rounded-xl shadow-xl border border-border-dark overflow-hidden">
            <div className="p-4 border-b border-border-dark bg-slate-800/50 flex justify-between items-center">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">
                    Intervention Site
                </h4>
                <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md border border-indigo-500/30">
                    {site.level}
                </span>
            </div>
            <div className="h-56 relative bg-slate-950 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                    }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <span className="material-symbols-outlined text-5xl text-primary drop-shadow-[0_0_10px_rgba(79,70,229,0.8)]">
                            location_on
                        </span>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 blur-md rounded-full"></div>
                    </div>
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="w-8 h-8 bg-slate-800/80 backdrop-blur rounded border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-700">
                        +
                    </button>
                    <button className="w-8 h-8 bg-slate-800/80 backdrop-blur rounded border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-700">
                        -
                    </button>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-700 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm text-primary">directions_car</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tighter">
                            Support ETA
                        </span>
                        <span className="text-xs font-bold text-slate-200 uppercase">{site.eta}</span>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-slate-900/60 flex justify-between items-center border-t border-border-dark">
                <span className="text-[11px] font-medium text-slate-500 font-mono tracking-tight">
                    {site.coordinates}
                </span>
                <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                    Live Map <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
            </div>
        </div>
    );
}
