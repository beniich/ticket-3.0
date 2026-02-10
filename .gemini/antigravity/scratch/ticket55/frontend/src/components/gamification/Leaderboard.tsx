'use client';

import React from 'react';
import { LeaderboardEntry } from '@/types/gamification';
import { Crown, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardProps {
    entries: LeaderboardEntry[];
    currentUserRank?: number;
    className?: string;
}

export const Leaderboard = ({
    entries,
    currentUserRank,
    className = ''
}: LeaderboardProps) => {
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
            case 2: return <Medal className="w-5 h-5 text-gray-400" />;
            case 3: return <Award className="w-5 h-5 text-amber-600" />;
            default: return <span className="text-sm font-medium">#{rank}</span>;
        }
    };

    const getRankBadge = (rank: number) => {
        switch (rank) {
            case 1: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 2: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            case 3: return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
            default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold">Classement</h2>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {entries.map((entry, index) => {
                    const isCurrentUser = currentUserRank === entry.rank;

                    return (
                        <motion.div
                            key={entry.userId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 flex items-center justify-between ${isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getRankBadge(entry.rank)}`}>
                                    {getRankIcon(entry.rank)}
                                </div>

                                <div className="flex items-center space-x-2">
                                    {entry.userAvatar ? (
                                        <img
                                            src={entry.userAvatar}
                                            alt={entry.userName}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {entry.userName.charAt(0)}
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {entry.userName}
                                            {isCurrentUser && (
                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    Vous
                                                </span>
                                            )}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span>Niveau {entry.level}</span>
                                            <span>•</span>
                                            <span>Série: {entry.streak} jours</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-semibold text-gray-900 dark:text-white">
                                    {entry.totalPoints.toLocaleString()} pts
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {entry.achievements.length} achievements
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
