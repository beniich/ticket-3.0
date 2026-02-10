'use client';

import React, { useState } from 'react';
import { Thread } from '@/types/message';
import { Search, Users, Plus, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ThreadListProps {
    threads: Thread[];
    onSelectThread: (thread: Thread) => void;
    onCreateGroup?: () => void;
    currentThreadId?: string;
}

export const ThreadList = ({
    threads,
    onSelectThread,
    onCreateGroup,
    currentThreadId
}: ThreadListProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredThreads = threads.filter(thread => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return thread.title?.toLowerCase().includes(searchLower) ||
            thread.participants.some(p => p.name.toLowerCase().includes(searchLower));
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return format(date, 'HH:mm', { locale: fr });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Hier';
        } else {
            return format(date, 'dd/MM', { locale: fr });
        }
    };

    const getThreadTitle = (thread: Thread) => {
        if (thread.title) return thread.title;

        // Pour les discussions directes, afficher le nom de l'autre participant
        if (thread.participants.length === 2) {
            const otherParticipant = thread.participants.find(p => p.id !== 'current_user');
            return otherParticipant?.name || 'Discussion';
        }

        // Pour les groupes sans titre
        return thread.participants.map(p => p.name).join(', ');
    };

    const getUnreadCount = (thread: Thread) => {
        // Ici vous pouvez implémenter le comptage des messages non lus
        // Pour l'exemple, on retourne un nombre aléatoire
        return Math.floor(Math.random() * 5); // Placeholder. In a real app, use messages metadata.
    };

    // Prevent getUnreadCount linter warning by using it or suppressing it if it's unused but required by prompt.
    // The prompt uses it in the rendering logic, so it is used.
    // However, `thread` parameter is used.

    return (
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Messages</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={onCreateGroup}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Nouveau groupe"
                        >
                            <Users className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher des discussions..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                </div>
            </div>

            {/* Threads list */}
            <div className="flex-1 overflow-y-auto">
                {filteredThreads.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune discussion trouvée</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredThreads.map((thread) => {
                            const unreadCount = getUnreadCount(thread);
                            const isSelected = thread.id === currentThreadId;

                            return (
                                <div
                                    key={thread.id}
                                    onClick={() => onSelectThread(thread)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {thread.isGroup ? (
                                                    <Users className="w-6 h-6" />
                                                ) : (
                                                    thread.participants[0]?.name.charAt(0) || 'U'
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                                    {getThreadTitle(thread)}
                                                </h3>
                                                {thread.lastMessage && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                        {thread.lastMessage.sender}: {thread.lastMessage.content}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end space-y-1">
                                            {thread.lastMessage && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(thread.lastMessage.timestamp)}
                                                </span>
                                            )}
                                            {unreadCount > 0 && (
                                                <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
