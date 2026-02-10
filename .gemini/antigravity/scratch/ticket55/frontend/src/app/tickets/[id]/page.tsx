'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Timeline } from '@/components/tickets/Timeline';
import { ComplaintDetails } from '@/components/tickets/ComplaintDetails';
import { TeamNotes } from '@/components/tickets/TeamNotes';
import { ClientInfo } from '@/components/tickets/ClientInfo';
import { SiteMap } from '@/components/tickets/SiteMap';
import { EvidencePhotos } from '@/components/tickets/EvidencePhotos';
import { TicketData } from '@/types/ticket';
import { getTicket, addTicketNote } from '@/lib/api';

export default function TicketDetailsPage() {
    const params = useParams();
    const [ticket, setTicket] = useState<TicketData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTicket();
    }, [params.id]);

    const loadTicket = async () => {
        try {
            setLoading(true);
            const data = await getTicket(params.id as string);
            setTicket(data);
        } catch (err) {
            setError('Failed to load ticket details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (content: string) => {
        try {
            const response = await addTicketNote(params.id as string, {
                author: 'Alex Morgan',
                initials: 'AM',
                role: 'Technician',
                timestamp: 'just now',
                content
            });

            if (response.success && ticket) {
                setTicket({
                    ...ticket,
                    notes: [...ticket.notes, response.note]
                });
            }
        } catch (err) {
            console.error('Failed to add note:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Header />
                <main className="max-w-[1440px] mx-auto p-6 flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-slate-400">Loading ticket details...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="flex min-h-screen">
                <Header />
                <main className="max-w-[1440px] mx-auto p-6 flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-400 text-lg font-medium">{error || 'Ticket not found'}</p>
                        <button
                            onClick={loadTicket}
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Header />
            <main className="max-w-[1440px] mx-auto p-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-slate-400">Tickets / {ticket.id}</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                                {ticket.status}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
                                {ticket.priority} Priority
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{ticket.title}</h2>
                        <div className="text-slate-400 mt-2 flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">calendar_today</span> {ticket.date}
                            </span>
                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">history</span> {ticket.time}
                            </span>
                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">outbound</span> Reported by {ticket.source}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-border-dark rounded-lg font-semibold text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                            <span className="material-symbols-outlined text-lg">person_add</span> Reassign
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-border-dark rounded-lg font-semibold text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                            <span className="material-symbols-outlined text-lg">task_alt</span> Resolve
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">add</span> New Note
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <Timeline items={ticket.timeline} />
                        <ComplaintDetails details={ticket.details} />
                        <TeamNotes notes={ticket.notes} onAddNote={handleAddNote} />
                    </div>

                    <aside className="lg:col-span-4 space-y-6">
                        <ClientInfo client={ticket.client} />
                        <SiteMap site={ticket.site} />
                        <EvidencePhotos photos={ticket.evidence} />
                    </aside>
                </div>
            </main>

            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-surface-dark/90 backdrop-blur-xl border-t border-border-dark px-6 py-4 lg:hidden z-[60]">
                <div className="flex items-center gap-4">
                    <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 active:scale-95 transition-transform">
                        Add Note
                    </button>
                    <button className="px-5 py-4 bg-slate-800 text-slate-300 rounded-2xl border border-slate-700 active:bg-slate-700">
                        <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
