'use client';

import { useState } from 'react';
import { TicketNote } from '@/types/ticket';

interface TeamNotesProps {
    notes: TicketNote[];
    onAddNote: (content: string) => void;
}

export function TeamNotes({ notes, onAddNote }: TeamNotesProps) {
    const [newNote, setNewNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newNote.trim()) {
            onAddNote(newNote);
            setNewNote('');
        }
    };

    return (
        <section className="bg-surface-dark rounded-xl p-8 border border-border-dark">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-white">Internal Team Notes</h3>
                <span className="bg-slate-800 px-2.5 py-1 rounded text-[10px] font-bold text-slate-400 border border-slate-700">
                    {notes.length} UPDATES
                </span>
            </div>
            <div className="space-y-8">
                {notes.map((note) => (
                    <div key={note.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex-shrink-0 flex items-center justify-center font-bold text-indigo-400 text-sm border border-indigo-500/30">
                            {note.initials}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1.5">
                                <span className="text-sm font-bold text-slate-100">{note.author}</span>
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                                    {note.timestamp}
                                </span>
                            </div>
                            <div className="text-sm text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                {note.content}
                            </div>
                        </div>
                    </div>
                ))}
                <form onSubmit={handleSubmit} className="mt-8 flex gap-4 pt-6 border-t border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex-shrink-0 flex items-center justify-center font-bold text-primary text-sm border border-primary/30">
                        AM
                    </div>
                    <div className="flex-1">
                        <textarea
                            className="w-full bg-slate-900 border-slate-700 rounded-xl text-sm focus:ring-primary focus:border-primary p-4 text-slate-300 placeholder:text-slate-600 min-h-[100px]"
                            placeholder="Add an internal note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                        />
                        <div className="flex justify-end mt-3">
                            <button
                                type="submit"
                                className="bg-primary hover:brightness-110 text-white text-xs font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-primary/10"
                            >
                                Post Update
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
