'use client';

import React, { useState } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { AchievementCard } from '@/components/gamification/AchievementCard';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { ProgressBadge } from '@/components/gamification/ProgressBadge';
import { LevelUpModal } from '@/components/gamification/LevelUpModal';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import {
    Trophy,
    TrendingUp,
    Users,
    Star,
    Zap,
    Crown,
    Target
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function GamificationPage() {
    const {
        achievements,
        leaderboard,
        userStats,
        userBadges,
        loading,
        error
    } = useGamification();

    const [showLevelUp, setShowLevelUp] = useState(false);

    // If error, show it but maybe inside layout
    if (error) {
        return (
            <ResponsiveLayout pageTitle="Gamification">
                <div className="p-6 text-center text-red-600">
                    <p>Erreur: {error}</p>
                    <p className="text-sm">Assurez-vous que le service de gamification est en cours d'exécution.</p>
                </div>
            </ResponsiveLayout>
        );
    }

    const recentAchievements = achievements.slice(0, 6);
    const topLeaderboard = leaderboard.slice(0, 10);

    return (
        <ResponsiveLayout pageTitle="Gamification">
            <div className="p-6 space-y-6">
                {/* Header avec statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white"
                    >
                        <div className="flex items-center space-x-3">
                            <Trophy className="w-8 h-8" />
                            <div>
                                <div className="text-2xl font-bold">
                                    {userStats?.achievementsCount || 0}
                                </div>
                                <div className="text-sm opacity-90">Achievements</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white"
                    >
                        <div className="flex items-center space-x-3">
                            <Target className="w-8 h-8" />
                            <div>
                                <div className="text-2xl font-bold">
                                    {userStats?.userLevel?.totalXP.toLocaleString() || 0}
                                </div>
                                <div className="text-sm opacity-90">Points XP</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white"
                    >
                        <div className="flex items-center space-x-3">
                            <Users className="w-8 h-8" />
                            <div>
                                <div className="text-2xl font-bold">
                                    #{userStats?.leaderboardEntry?.rank || '-'}
                                </div>
                                <div className="text-sm opacity-90">Classement</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 text-white"
                    >
                        <div className="flex items-center space-x-3">
                            <Zap className="w-8 h-8" />
                            <div>
                                <div className="text-2xl font-bold">
                                    {userStats?.leaderboardEntry?.streak || 0}
                                </div>
                                <div className="text-sm opacity-90">Série (jours)</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Progression utilisateur */}
                {userStats?.userLevel && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <ProgressBadge level={userStats.userLevel} />
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Achievements récents */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center">
                                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                                    Derniers Achievements
                                </h2>
                                <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                    Voir tout
                                </button>
                            </div>

                            <div className="p-4">
                                {loading ? (
                                    <div className="flex items-center justify-center h-32">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : recentAchievements.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Pas encore d'achievements</p>
                                        <p className="text-sm mt-1">Continuez à utiliser la plateforme !</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {recentAchievements.map((achievement) => (
                                            <AchievementCard
                                                key={achievement.id}
                                                achievement={achievement}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Classement */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Leaderboard
                            entries={topLeaderboard}
                            currentUserRank={userStats?.leaderboardEntry?.rank}
                        />
                    </motion.div>
                </div>

                {/* Badges déverrouillés */}
                {userBadges && userBadges.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow"
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold flex items-center">
                                <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                                Badges Déverrouillés
                            </h2>
                        </div>

                        <div className="p-4">
                            <div className="flex flex-wrap gap-3">
                                {userBadges.map((badge, index) => (
                                    <div
                                        key={index}
                                        className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white"
                                    >
                                        <Trophy className="w-8 h-8" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Modal de passage de niveau */}
            <LevelUpModal
                isOpen={showLevelUp}
                onClose={() => setShowLevelUp(false)}
                newLevel={userStats?.userLevel?.currentLevel || 1}
                previousLevel={(userStats?.userLevel?.currentLevel || 1) - 1}
                xpEarned={100}
                rewards={['Nouveau badge', 'Accès premium']}
            />
        </ResponsiveLayout>
    );
}
