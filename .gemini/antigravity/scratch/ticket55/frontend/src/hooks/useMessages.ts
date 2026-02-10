import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import socketService from '@/lib/socket';
import { Message, Thread } from '@/types/message';

export const useMessages = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [currentThread, setCurrentThread] = useState<Thread | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Récupérer les fils de discussion
    const fetchThreads = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/messages/threads');
            const normalized = response.data.map((t: any) => ({ ...t, id: t._id }));
            setThreads(normalized);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur chargement discussions');
        } finally {
            setLoading(false);
        }
    }, []);

    // Récupérer les messages d'un fil
    const fetchMessages = useCallback(async (threadId: string, before?: string) => {
        try {
            const params: any = {};
            if (before) params.before = before;

            const response = await api.get(`/messages/threads/${threadId}/messages`, { params });
            const normalized = response.data.map((m: any) => ({ ...m, id: m._id }));
            setMessages(prev => [...normalized, ...prev]);

            // Marquer comme lu
            await api.post(`/messages/threads/${threadId}/read`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur chargement messages');
        }
    }, []);

    // Envoyer un message
    const sendMessage = async (
        threadId: string,
        content: string,
        attachments?: any[],
        replyTo?: string,
        mentions?: string[]
    ) => {
        try {
            // Send as JSON since backend isn't using multer in the route yet
            const response = await api.post('/messages', {
                threadId,
                content,
                attachments,
                replyTo,
                mentions
            });

            const newMessage = { ...response.data, id: response.data._id };
            setMessages(prev => [...prev, newMessage]);

            return newMessage;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Erreur envoi message');
        }
    };

    // Ajouter une réaction
    const addReaction = async (messageId: string, emoji: string) => {
        try {
            await api.post('/messages/reactions', { messageId, emoji });

            // Mettre à jour localement
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            reactions: [...(msg.reactions || []), {
                                userId: 'current_user',
                                emoji,
                                createdAt: new Date().toISOString()
                            }]
                        }
                        : msg
                )
            );
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Erreur ajout réaction');
        }
    };

    // Supprimer une réaction
    const removeReaction = async (messageId: string, emoji: string) => {
        try {
            await api.delete('/messages/reactions', {
                data: { messageId, emoji }
            });

            // Mettre à jour localement
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            reactions: (msg.reactions || []).filter(r => r.emoji !== emoji)
                        }
                        : msg
                )
            );
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Erreur suppression réaction');
        }
    };

    // Créer un thread direct
    const createDirectThread = async (userId: string) => {
        try {
            const response = await api.post('/messages/threads/direct', { userId });
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Erreur création discussion');
        }
    };

    // Récupérer le compteur de messages non lus
    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await api.get('/messages/unread-count');
            setUnreadCount(response.data.count);
        } catch (err: any) {
            console.error('Erreur compteur non lus:', err);
        }
    }, []);

    // Effet initial
    useEffect(() => {
        fetchThreads();
        fetchUnreadCount();
    }, [fetchThreads, fetchUnreadCount]);

    // WebSocket pour messages en temps réel
    useEffect(() => {
        const socket = socketService.connect();

        const handleMessageReceived = (message: any) => {
            const normalized = { ...message, id: message._id };
            if (currentThread && normalized.threadId === currentThread.id) {
                setMessages(prev => [...prev, normalized]);
            }
            // Incrémenter le compteur non lus si on n'est pas sur ce thread
            if (!currentThread || normalized.threadId !== currentThread.id) {
                setUnreadCount(prev => prev + 1);
            }
        };

        const handleReactionAdded = ({ messageId, userId, emoji }: any) => {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            reactions: [...(msg.reactions || []), {
                                userId,
                                emoji,
                                createdAt: new Date().toISOString()
                            }]
                        }
                        : msg
                )
            );
        };

        socketService.on('new_message', handleMessageReceived);
        socketService.on('reaction_added', handleReactionAdded);

        return () => {
            socketService.off('new_message', handleMessageReceived);
            socketService.off('reaction_added', handleReactionAdded);
        };
    }, [currentThread]);

    return {
        threads,
        currentThread,
        messages,
        unreadCount,
        loading,
        error,
        fetchThreads,
        fetchMessages,
        sendMessage,
        addReaction,
        removeReaction,
        createDirectThread,
        setCurrentThread,
        setUnreadCount
    };
};
