'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutGrid,
    MessageCircle,
    FileText,
    Users,
    BarChart2,
    Search,
    Plus,
    Phone,
    Video,
    Info,
    Pin,
    Eye,
    CheckCheck,
    Link as LinkIcon,
    Paperclip,
    AtSign,
    Smile,
    Bold,
    List,
    Send,
    X,
    MapPin,
    Wrench,
    Settings,
    MoreVertical,
    Loader2
} from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { useAuthStore } from '@/store/authStore';
import { Thread, Message } from '@/types/message';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function MessagesPage() {
    const {
        threads,
        currentThread,
        messages,
        loading,
        fetchMessages,
        sendMessage,
        setCurrentThread
    } = useMessages();
    const { user } = useAuthStore();
    const [showRecordContext, setShowRecordContext] = useState(true);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (currentThread) {
            fetchMessages(currentThread.id);
        }
    }, [currentThread, fetchMessages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !currentThread) return;

        try {
            await sendMessage(currentThread.id, messageInput);
            setMessageInput('');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleThreadSelect = (thread: Thread) => {
        setCurrentThread(thread);
    };

    const getOtherParticipantName = (thread: Thread) => {
        if (thread.isGroup) return thread.title || 'Groupe';
        const other = thread.participants.find(p => p.id !== user?.id);
        return other?.name || 'Inconnu';
    };

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Vertical Navigation Rail */}
            <aside className="w-16 flex flex-col items-center py-4 bg-slate-900 border-r border-slate-800 shrink-0">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                    <LayoutGrid className="text-white w-6 h-6" />
                </div>
                <nav className="flex flex-col gap-4">
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-white">
                        <MessageCircle className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        <BarChart2 className="w-5 h-5" />
                    </button>
                </nav>
                <div className="mt-auto">
                    <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border-2 border-primary/40">
                        <img
                            alt="Profile"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4xs35csiJ8AC7oGbJIw1K-LwlpPOyGnVO94g3fEoexCMPLvp6TXJ3Xq7UCiQ12zYbXPl53hfhbd2jJmXbc4EuWXmJ7GlYSQoi2xWIaGDqiH0-EMNf8PYsXhj2Ce0ilh1OVj6Q5DI-wwP-zf2IPow2x0v1MvcqRZDY5TaO1RCOCoL1HUGAUsW3Un324H_b2d-U-8vPVftMOuk7FkcGLnF5CgZA66TMgyU8H66cfoJZaPXJ4jR_I-zsjCgJ6uoLW6YNIatFWT_nuwJy"
                        />
                    </div>
                </div>
            </aside>

            {/* Sidebar: Channels and DMs */}
            <aside className="w-64 flex flex-col bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 shrink-0">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="relative">
                        <input
                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary"
                            placeholder="Search records or team..."
                            type="text"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Groups Section (Channels) */}
                    <div className="p-4">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            <span>Channels</span>
                            <button className="hover:text-primary"><Plus className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-1">
                            {threads.filter(t => t.isGroup).map(thread => (
                                <button
                                    key={thread.id}
                                    onClick={() => handleThreadSelect(thread)}
                                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all ${currentThread?.id === thread.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                                >
                                    <span className={currentThread?.id === thread.id ? 'text-primary/60' : 'text-slate-400'}>#</span>
                                    <span className="truncate">{thread.title || 'Groupe'}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Direct Messages Section */}
                    <div className="p-4">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            <span>Direct Messages</span>
                        </div>
                        <div className="space-y-1">
                            {threads.filter(t => !t.isGroup).map(thread => (
                                <button
                                    key={thread.id}
                                    onClick={() => handleThreadSelect(thread)}
                                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all ${currentThread?.id === thread.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                                >
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="truncate">{getOtherParticipantName(thread)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col bg-white dark:bg-background-dark">
                {currentThread ? (
                    <>
                        {/* Header */}
                        <header className="h-14 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-slate-400 font-light text-xl">
                                        {currentThread.isGroup ? '#' : '@'}
                                    </span>
                                    <h2 className="font-bold text-lg">{getOtherParticipantName(currentThread)}</h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="text-slate-400 hover:text-primary transition-colors"><Phone className="w-5 h-5" /></button>
                                <button className="text-slate-400 hover:text-primary transition-colors"><Video className="w-5 h-5" /></button>
                                <button
                                    className={`text-slate-400 hover:text-primary transition-colors ${showRecordContext ? 'text-primary' : ''}`}
                                    onClick={() => setShowRecordContext(!showRecordContext)}
                                >
                                    <Info className="w-5 h-5" />
                                </button>
                            </div>
                        </header>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.map((message) => (
                                <div key={message.id} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                        {message.sender.name[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="font-semibold text-sm">{message.sender.name}</span>
                                            <span className="text-[10px] text-slate-400">
                                                {format(new Date(message.createdAt), 'HH:mm', { locale: fr })}
                                            </span>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg rounded-tl-none border border-slate-100 dark:border-slate-800 inline-block max-w-2xl">
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                        </div>
                                        {message.status === 'read' && (
                                            <div className="mt-1 flex items-center gap-1">
                                                <CheckCheck className="text-primary w-3.5 h-3.5" />
                                                <span className="text-[10px] text-slate-400">Lu</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Composer Area */}
                        <footer className="p-4 border-t border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto">
                                <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:border-primary transition-colors">
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        className="w-full bg-transparent border-none focus:ring-0 resize-none px-4 pt-3 text-sm h-14"
                                        placeholder={`Message à ${getOtherParticipantName(currentThread)}...`}
                                        rows={2}
                                    />
                                    <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-2">
                                            <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"><Paperclip className="w-5 h-5" /></button>
                                            <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"><AtSign className="w-5 h-5" /></button>
                                            <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"><Smile className="w-5 h-5" /></button>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!messageInput.trim()}
                                            className="bg-primary text-white px-4 py-1.5 rounded-lg flex items-center gap-2 font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
                                        >
                                            <span>Envoyer</span>
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                            <MessageCircle className="w-10 h-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Sélectionnez une discussion</h3>
                        <p className="max-w-xs text-sm">Choisissez une équipe ou un collaborateur pour commencer à échanger en temps réel.</p>
                    </div>
                )}
            </main>

            {/* Right Side Panel: Record Context */}
            {showRecordContext && (
                <aside className={`w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-all ${showRecordContext ? 'translate-x-0' : 'translate-x-full fixed right-0 h-full'}`}>
                    <div className="h-14 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
                        <h3 className="font-bold text-sm uppercase tracking-wider">Record Context</h3>
                        <button onClick={() => setShowRecordContext(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {currentThread?.complaintId ? (
                        <div className="p-6 overflow-y-auto">
                            <div className="mb-6">
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase">Active Record</span>
                                <h2 className="text-lg font-bold mt-2 truncate">
                                    ID-#{typeof currentThread.complaintId === 'string' ? currentThread.complaintId.substring(currentThread.complaintId.length - 6).toUpperCase() : 'REC'}
                                </h2>
                                <p className="text-xs text-slate-500 mt-1 italic">Cette discussion est liée à un record.</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Status</label>
                                    <div className="flex items-center gap-2">
                                        <Wrench className="text-primary w-4 h-4" />
                                        <span className="text-sm font-medium">In Progress</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase block mb-3">Participants</label>
                                    <div className="space-y-2">
                                        {currentThread.participants.map(p => (
                                            <div key={p.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                    {p.name[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-gray-100">{p.name}</span>
                                                    <span className="text-[10px] text-slate-400 capitalize">{p.role}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button className="w-full py-2 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                                    View Full History
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                            <Info className="w-12 h-12 opacity-10 mb-4" />
                            <p className="text-sm font-bold">Aucun record lié</p>
                            <p className="text-[10px] max-w-[150px] mt-2">Cette discussion n'est pas rattachée à une réclamation spécifique.</p>
                        </div>
                    )}
                </aside>
            )}
        </div>
    );
}
