'use client';

import React from 'react';
import { Achievement } from '@/types/gamification';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Crown } from 'lucide-react';

interface AchievementCardProps {
    achievement: Achievement;
    isNew?: boolean;
    className?: string;
}

export const AchievementCard = ({
    achievement,
    isNew = false,
    className = ''
}: AchievementCardProps) => {
    const getRarityColor = () => {
        switch (achievement.rarity) {
            case 'common': return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
            case 'rare': return 'border-blue-300 bg-blue-50 dark:bg-blue-900/20';
            case 'epic': return 'border-purple-300 bg-purple-50 dark:bg-purple-900/20';
            case 'legendary': return 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20';
            default: return 'border-gray-300';
        }
    };

    const getRarityIcon = () => {
        switch (achievement.rarity) {
            case 'common': return <Star className="w-4 h-4 text-gray-500" />;
            case 'rare': return <Star className="w-4 h-4 text-blue-500" />;
            case 'epic': return <Zap className="w-4 h-4 text-purple-500" />;
            case 'legendary': return <Crown className="w-4 h-4 text-yellow-500" />;
            default: return <Star className="w-4 h-4 text-gray-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ scale: isNew ? 0.8 : 1, opacity: isNew ? 0 : 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`relative p-4 rounded-lg border-2 ${getRarityColor()} ${className}`}
        >
            {isNew && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Nouveau!
                </div>
            )}

            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {achievement.title}
                        </h3>
                        {getRarityIcon()}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {achievement.description}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            +{achievement.points} points
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(achievement.earnedAt)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
