'use client';

import React from 'react';
import { ArrowLeft, Phone, Info } from 'lucide-react';

interface ConversationHeaderProps {
    title: string;
    participants: {
        id: string;
        name: string;
        avatar?: string;
    }[];
    onBack?: () => void;
    onCall?: () => void;
    onInfo?: () => void;
}

export const ConversationHeader = ({
    title,
    participants,
    onBack,
    onCall,
    onInfo
}: ConversationHeaderProps) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center space-x-3">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}

                <div className="flex items-center space-x-3">
                    {/* Avatar(s) */}
                    <div className="relative">
                        {participants.length > 2 ? (
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                                {participants.length}
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
                                {title.charAt(0).toUpperCase()}
                            </div>
                        )}
                        {/* Status indicator (optional) */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        {participants.length > 2 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {participants.length} participants
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={onCall}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                >
                    <Phone className="w-5 h-5" />
                </button>
                <button
                    onClick={onInfo}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                >
                    <Info className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
