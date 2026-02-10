'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Thread } from '@/types/message';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ConversationHeader } from './ConversationHeader';
import { useMessages } from '@/hooks/useMessages';

interface MessageThreadProps {
    thread: Thread;
    onBack?: () => void;
}

export const MessageThread = ({ thread, onBack }: MessageThreadProps) => {
    const { messages, fetchMessages, sendMessage, addReaction, removeReaction } = useMessages();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [loadingMore, setLoadingMore] = useState(false);

    // Charger les messages initiaux
    useEffect(() => {
        fetchMessages(thread.id);
    }, [thread.id, fetchMessages]);

    // Scroll vers le bas quand de nouveaux messages arrivent
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (content: string, attachments?: File[]) => {
        try {
            await sendMessage(thread.id, content, attachments);
        } catch (error) {
            console.error('Erreur envoi message:', error);
        }
    };

    const handleLoadMore = async () => {
        if (messages.length === 0) return;

        setLoadingMore(true);
        try {
            const oldestMessage = messages[0];
            await fetchMessages(thread.id, oldestMessage.createdAt);
        } catch (error) {
            console.error('Erreur chargement plus de messages:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const getThreadTitle = () => {
        if (thread.title) return thread.title;

        if (thread.participants.length === 2) {
            const otherParticipant = thread.participants.find(p => p.id !== 'current_user');
            return otherParticipant?.name || 'Discussion';
        }

        return thread.participants.map(p => p.name).join(', ');
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <ConversationHeader
                title={getThreadTitle()}
                participants={thread.participants}
                onBack={onBack}
                onCall={() => console.log('Appel vidéo')}
                onInfo={() => console.log('Infos conversation')}
            />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Load more button */}
                {messages.length > 0 && (
                    <div className="text-center mb-4">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
                        >
                            {loadingMore ? 'Chargement...' : 'Charger plus de messages'}
                        </button>
                    </div>
                )}

                {/* Messages list */}
                <div className="space-y-4">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isCurrentUser={message.sender.id === 'current_user'}
                            onAddReaction={addReaction}
                            onRemoveReaction={removeReaction}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <MessageInput
                onSendMessage={handleSendMessage}
                placeholder={`Message à ${getThreadTitle()}`}
            />
        </div>
    );
};
