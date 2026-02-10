'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Star } from 'lucide-react';
import Confetti from 'react-confetti';

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    newLevel: number;
    previousLevel: number;
    xpEarned: number;
    rewards: string[];
}

export const LevelUpModal = ({
    isOpen,
    onClose,
    newLevel,
    previousLevel,
    xpEarned,
    rewards
}: LevelUpModalProps) => {
    const [windowSize, setWindowSize] = React.useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }, []);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={200}
                />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative"
                >
                    <div className="text-center">
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1 }}
                            className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <Trophy className="w-10 h-10 text-white" />
                        </motion.div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Félicitations !
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Vous avez atteint le niveau <span className="font-bold text-blue-600">{newLevel}</span> !
                        </p>

                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                    +{xpEarned} XP gagnés
                                </span>
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Niveau {previousLevel} → Niveau {newLevel}
                            </p>
                        </div>

                        {rewards.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Récompenses débloquées :
                                </h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {rewards.map((reward, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        >
                                            <Star className="w-3 h-3 mr-1" />
                                            {reward}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                        >
                            Continuer
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
