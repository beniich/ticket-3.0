'use client';

import React from 'react';
import { UserLevel } from '@/types/gamification';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Star } from 'lucide-react';

interface ProgressBadgeProps {
    level: UserLevel;
    className?: string;
}

export const ProgressBadge = ({ level, className = '' }: ProgressBadgeProps) => {
    const getLevelColor = () => {
        if (level.currentLevel >= 50) return 'from-purple-500 to-pink-500';
        if (level.currentLevel >= 30) return 'from-blue-500 to-cyan-500';
        if (level.currentLevel >= 20) return 'from-green-500 to-teal-500';
        if (level.currentLevel >= 10) return 'from-yellow-500 to-orange-500';
        return 'from-gray-400 to-gray-600';
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Votre Progression</h3>
                <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>

            <div className="space-y-4">
                {/* Niveau et XP */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getLevelColor()} flex items-center justify-center`}>
                            <span className="text-white font-bold">{level.currentLevel}</span>
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                                {level.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Niveau {level.currentLevel}
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">
                            {level.totalXP.toLocaleString()} XP
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {level.xpToNextLevel - level.totalXP} pour monter
                        </div>
                    </div>
                </div>

                {/* Barre de progression */}
                <div>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progression</span>
                        <span>{level.levelProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                            className={`h-2 rounded-full bg-gradient-to-r ${getLevelColor()}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${level.levelProgress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <Target className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {level.totalXP.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">XP Total</div>
                    </div>

                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <Star className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            0
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Badges</div>
                    </div>

                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <TrendingUp className="w-4 h-4 mx-auto text-green-500 mb-1" />
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {level.currentLevel}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Niveau</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
