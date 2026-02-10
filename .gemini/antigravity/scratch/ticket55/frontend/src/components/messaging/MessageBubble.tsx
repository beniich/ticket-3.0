'use client';

import React, { useState } from 'react';
import { Message } from '@/types/message';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, ThumbsUp, Laugh, Angry, ThumbsDown } from 'lucide-react';

interface MessageBubbleProps {
    message: Message;
    isCurrentUser: boolean;
    onAddReaction: (messageId: string, emoji: string) => void;
    onRemoveReaction: (messageId: string, emoji: string) => void;
}

export const MessageBubble = ({
    message,
    isCurrentUser,
    onAddReaction,
    onRemoveReaction
}: MessageBubbleProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showReactions, setShowReactions] = useState(false);

    const getReactionIcon = (emoji: string) => {
        switch (emoji) {
            case '👍': return <ThumbsUp className="w-4 h-4" />;
            case '❤️': return <Heart className="w-4 h-4" />;
            case '😂': return <Laugh className="w-4 h-4" />;
            case '😠': return <Angry className="w-4 h-4" />;
            case '👎': return <ThumbsDown className="w-4 h-4" />;
            default: return emoji;
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'HH:mm', { locale: fr });
    };

    /*
    const getUserReaction = () => {
      return message.reactions?.find(r => r.userId === 'current_user');
    };
    */

    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-2xl px-4 py-2 ${isCurrentUser
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                    }`}>
                    {/* Nom de l'expéditeur (si groupe) */}
                    {!isCurrentUser && (
                        <div className="text-xs font-medium mb-1 opacity-70">
                            {message.sender.name}
                        </div>
                    )}

                    {/* Contenu du message */}
                    <div className="whitespace-pre-wrap break-words">
                        {message.content}
                    </div>

                    {/* Pièces jointes */}
                    {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {message.attachments.map((attachment) => (
                                <div key={attachment.id} className="bg-black/10 dark:bg-white/10 rounded-lg p-2">
                                    <div className="text-xs truncate max-w-32">
                                        {attachment.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Informations supplémentaires */}
                <div className={`flex items-center mt-1 text-xs ${isCurrentUser ? 'justify-end' : 'justify-start'
                    }`}>
                    <span className="text-gray-500 dark:text-gray-400">
                        {formatDate(message.createdAt)}
                    </span>
                    {message.status === 'read' && isCurrentUser && (
                        <span className="ml-1 text-blue-500">✓✓</span>
                    )}
                    {message.status === 'delivered' && isCurrentUser && (
                        <span className="ml-1 text-gray-500">✓</span>
                    )}
                </div>

                {/* Réactions */}
                {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {message.reactions.map((reaction, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    reaction.userId === 'current_user'
                                        ? onRemoveReaction(message.id, reaction.emoji)
                                        : onAddReaction(message.id, reaction.emoji)
                                }
                                className={`flex items-center px-2 py-1 rounded-full text-xs ${reaction.userId === 'current_user'
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                {getReactionIcon(reaction.emoji)}
                                <span className="ml-1">{reaction.emoji}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Boutons de réaction rapide */}
                <div className={`mt-1 flex gap-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <button
                        onClick={() => onAddReaction(message.id, '👍')}
                        className="text-xs p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                        title="Pouce levé"
                    >
                        👍
                    </button>
                    <button
                        onClick={() => onAddReaction(message.id, '❤️')}
                        className="text-xs p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                        title="Cœur"
                    >
                        ❤️
                    </button>
                    <button
                        onClick={() => onAddReaction(message.id, '😂')}
                        className="text-xs p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                        title="Rire"
                    >
                        😂
                    </button>
                </div>
            </div>
        </div>
    );
};
