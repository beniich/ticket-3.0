'use client';

import { TicketDetails } from '@/types/ticket';

interface ComplaintDetailsProps {
    details: TicketDetails;
}

export function ComplaintDetails({ details }: ComplaintDetailsProps) {
    return (
        <section className="bg-surface-dark rounded-xl p-8 border border-border-dark">
            <h3 className="text-lg font-bold text-white mb-6">Complaint Details</h3>
            <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
                <p>{details.description}</p>
                <p className="bg-slate-900/40 p-4 rounded-lg border-l-4 border-rose-500 text-slate-300">
                    <strong>Critical Concern:</strong> {details.criticalConcern}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/30 border border-slate-800">
                        <span className="material-symbols-outlined text-primary">location_searching</span>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Target Area</p>
                            <p className="text-slate-300 font-medium">{details.targetArea}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/30 border border-slate-800">
                        <span className="material-symbols-outlined text-rose-400">warning</span>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Risk Factor</p>
                            <p className="text-slate-300 font-medium">{details.riskFactor}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
