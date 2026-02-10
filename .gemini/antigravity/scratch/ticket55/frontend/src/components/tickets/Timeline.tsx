'use client';

import { TicketTimelineItem } from '@/types/ticket';

interface TimelineProps {
    items: TicketTimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
    const getColorClass = (color: string) => {
        switch (color) {
            case 'emerald':
                return 'bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400';
            case 'indigo':
                return 'bg-indigo-500/10 border-2 border-indigo-500/30 text-indigo-400';
            case 'primary':
                return 'bg-primary border-2 border-primary text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]';
            default:
                return 'bg-slate-500/10 border-2 border-slate-500/30 text-slate-400';
        }
    };

    return (
        <section className="bg-surface-dark rounded-xl p-8 border border-border-dark">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    Intervention Timeline
                </h3>
                <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-1 rounded-md uppercase tracking-widest border border-slate-700">
                    Live Updates
                </span>
            </div>
            <div className="relative space-y-0">
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-800"></div>
                {items.map((item, index) => (
                    <div key={item.id} className="relative pl-12 pb-10">
                        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center ${getColorClass(item.color)}`}>
                            <span className="material-symbols-outlined text-sm font-bold">
                                {item.icon}
                            </span>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-slate-100 text-base">{item.title}</p>
                                <p className="text-sm text-slate-400">{item.description}</p>
                                {item.statusUpdate && (
                                    <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                            Latest Status Update
                                        </p>
                                        <p className="text-sm text-slate-300 italic leading-relaxed">
                                            "{item.statusUpdate}" - Marc L.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <span className={`text-xs font-medium ${item.timestamp === 'JUST NOW' ? 'font-bold text-primary animate-pulse' : 'text-slate-500'}`}>
                                {item.timestamp}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
