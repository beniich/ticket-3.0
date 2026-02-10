'use client';

import { ClientInfo as ClientInfoType } from '@/types/ticket';

interface ClientInfoProps {
    client: ClientInfoType;
}

export function ClientInfo({ client }: ClientInfoProps) {
    return (
        <div className="bg-surface-dark rounded-xl shadow-xl border border-border-dark overflow-hidden">
            <div className="p-4 border-b border-border-dark bg-slate-800/50">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">
                    Client Information
                </h4>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700 shadow-inner">
                        <img
                            alt="Client profile"
                            className="w-full h-full object-cover grayscale-[0.2]"
                            src={client.avatar}
                        />
                    </div>
                    <div>
                        <p className="font-bold text-white text-xl">{client.company}</p>
                        <p className="text-sm text-slate-500 mt-1">
                            Contact: <span className="text-slate-300">{client.contact}</span>
                        </p>
                    </div>
                </div>
                <div className="space-y-5">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="material-symbols-outlined text-slate-500 text-lg">call</span>
                        <span className="text-slate-200 font-medium">{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="material-symbols-outlined text-slate-500 text-lg">mail</span>
                        <span className="text-slate-200 font-medium hover:text-primary cursor-pointer transition-colors">
                            {client.email}
                        </span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-400">
                        <span className="material-symbols-outlined text-slate-500 text-lg">location_on</span>
                        <span className="text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                            {client.address}
                        </span>
                    </div>
                </div>
                <button className="w-full mt-8 flex items-center justify-center gap-2 py-3 px-4 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all rounded-lg font-bold text-sm">
                    <span className="material-symbols-outlined text-base">chat_bubble</span> Send Message
                </button>
            </div>
        </div>
    );
}
