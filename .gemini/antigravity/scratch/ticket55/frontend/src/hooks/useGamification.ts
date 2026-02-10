import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Achievement, LeaderboardEntry, UserLevel, GamificationStats, GlobalStats } from '@/types/gamification';

export const useGamification = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userStats, setUserStats] = useState<GamificationStats | null>(null);
    const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
    const [userBadges, setUserBadges] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Récupérer les achievements de l'utilisateur
    const fetchUserAchievements = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/gamification/achievements');
            setAchievements(response.data);
        } catch (err: any) {
            // setError(err.response?.data?.error || 'Erreur chargement achievements');
            // Silently fail or log to console to allow page to render even if gamification service is down
            console.error('Erreur chargement achievements', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Récupérer le leaderboard
    const fetchLeaderboard = useCallback(async (limit: number = 50) => {
        try {
            const response = await api.get('/gamification/leaderboard', {
                params: { limit }
            });
            setLeaderboard(response.data);
        } catch (err: any) {
            console.error('Erreur chargement leaderboard:', err);
        }
    }, []);

    // Récupérer les statistiques utilisateur
    const fetchUserStats = useCallback(async () => {
        try {
            const response = await api.get('/gamification/stats');
            setUserStats(response.data);
        } catch (err: any) {
            console.error('Erreur chargement stats utilisateur:', err);
        }
    }, []);

    // Récupérer les statistiques globales
    const fetchGlobalStats = useCallback(async () => {
        try {
            const response = await api.get('/gamification/global-stats');
            setGlobalStats(response.data);
        } catch (err: any) {
            console.error('Erreur chargement stats globales:', err);
        }
    }, []);

    // Récupérer les badges déverrouillés
    const fetchUserBadges = useCallback(async () => {
        try {
            const response = await api.get('/gamification/badges');
            setUserBadges(response.data);
        } catch (err: any) {
            console.error('Erreur chargement badges:', err);
        }
    }, []);

    // Vérifier les achievements pour une action
    const checkAchievement = async (action: string, data?: any) => {
        try {
            await api.post('/gamification/check', { action, data });
            // Rafraîchir les données
            fetchUserAchievements();
            fetchUserStats();
        } catch (err: any) {
            console.error('Erreur vérification achievement:', err);
        }
    };

    // Déverrouiller un badge
    const unlockBadge = async (badge: string) => {
        try {
            await api.post('/gamification/unlock-badge', { badge });
            fetchUserBadges();
        } catch (err: any) {
            console.error('Erreur déverrouillage badge:', err);
        }
    };

    // Effet initial
    useEffect(() => {
        fetchUserAchievements();
        fetchUserStats();
        fetchUserBadges();
        fetchLeaderboard();
        fetchGlobalStats();
    }, [fetchUserAchievements, fetchUserStats, fetchUserBadges, fetchLeaderboard, fetchGlobalStats]);

    return {
        achievements,
        leaderboard,
        userStats,
        globalStats,
        userBadges,
        loading,
        error,
        fetchUserAchievements,
        fetchLeaderboard,
        fetchUserStats,
        fetchGlobalStats,
        fetchUserBadges,
        checkAchievement,
        unlockBadge
    };
};
