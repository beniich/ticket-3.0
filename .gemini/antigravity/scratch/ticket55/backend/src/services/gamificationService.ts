import { Achievement, LeaderboardEntry, UserLevel, ACHIEVEMENT_DEFINITIONS, IAchievement } from '../models/Achievement.js';

export class GamificationService {
    // Attribuer un achievement à un utilisateur
    async awardAchievement(
        userId: string,
        userName: string,
        achievementType: keyof typeof ACHIEVEMENT_DEFINITIONS,
        metadata?: any
    ): Promise<IAchievement | null> {
        try {
            const achievementDef = ACHIEVEMENT_DEFINITIONS[achievementType];
            if (!achievementDef) {
                throw new Error(`Achievement type ${achievementType} not found`);
            }

            // Vérifier si l'utilisateur a déjà cet achievement (sauf si répétable)
            const existingAchievement = await Achievement.findOne({
                userId,
                type: achievementType
            });

            // Certains achievements peuvent être répétés (ex: daily challenges)
            const isRepeatable = [
                'early_bird',
                'night_owl',
                'communication_expert'
            ].includes(achievementType);

            if (existingAchievement && !isRepeatable) {
                return null; // Déjà obtenu
            }

            // Créer le nouvel achievement
            const achievement = new Achievement({
                userId,
                type: achievementType,
                title: achievementDef.title,
                description: achievementDef.description,
                points: achievementDef.points,
                badge: achievementDef.badge,
                rarity: achievementDef.rarity,
                earnedAt: new Date(),
                metadata
            });

            const savedAchievement = await achievement.save();

            // Mettre à jour le leaderboard
            await this.updateLeaderboard(userId, userName, achievementDef.points);

            // Mettre à jour le niveau de l'utilisateur
            await this.updateUserLevel(userId, achievementDef.points);

            return savedAchievement;
        } catch (error) {
            console.error('Error awarding achievement:', error);
            return null;
        }
    }

    // Mettre à jour le leaderboard
    async updateLeaderboard(userId: string, userName: string, points: number): Promise<void> {
        try {
            // Trouver ou créer l'entrée du leaderboard
            let leaderboardEntry = await LeaderboardEntry.findOne({ userId });

            if (!leaderboardEntry) {
                leaderboardEntry = new LeaderboardEntry({
                    userId,
                    userName,
                    totalPoints: 0,
                    weeklyPoints: 0,
                    monthlyPoints: 0,
                    level: 1,
                    streak: 0,
                    lastActive: new Date(),
                    achievements: []
                });
            }

            // Mettre à jour les points
            leaderboardEntry.totalPoints += points;
            leaderboardEntry.weeklyPoints += points;
            leaderboardEntry.monthlyPoints += points;
            leaderboardEntry.lastActive = new Date();

            // Mettre à jour la série de connexion
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (leaderboardEntry.lastActive.toDateString() === yesterday.toDateString()) {
                leaderboardEntry.streak += 1;
            } else if (leaderboardEntry.lastActive.toDateString() !== today.toDateString()) {
                leaderboardEntry.streak = 1; // Reset ou commence une nouvelle série
            }

            await leaderboardEntry.save();

            // Mettre à jour les achievements liés à l'activité
            await this.checkActivityBasedAchievements(userId, userName, leaderboardEntry);
        } catch (error) {
            console.error('Error updating leaderboard:', error);
        }
    }

    // Mettre à jour le niveau de l'utilisateur
    async updateUserLevel(userId: string, points: number): Promise<void> {
        try {
            let userLevel = await UserLevel.findOne({ userId });

            if (!userLevel) {
                userLevel = new UserLevel({
                    userId,
                    currentLevel: 1,
                    totalXP: 0,
                    xpToNextLevel: 100,
                    levelProgress: 0,
                    unlockedBadges: [],
                    title: "Débutant"
                });
            }

            userLevel.totalXP += points;

            // Vérifier si le niveau augmente
            while (userLevel.totalXP >= userLevel.xpToNextLevel) {
                userLevel.currentLevel += 1;
                userLevel.totalXP -= userLevel.xpToNextLevel;
                userLevel.xpToNextLevel = Math.floor(userLevel.xpToNextLevel * 1.5); // Augmentation progressive
            }

            // Calculer le pourcentage de progression
            userLevel.levelProgress = Math.floor(
                (userLevel.totalXP / userLevel.xpToNextLevel) * 100
            );

            // Mettre à jour le titre basé sur le niveau
            userLevel.title = this.getLevelTitle(userLevel.currentLevel);

            await userLevel.save();
        } catch (error) {
            console.error('Error updating user level:', error);
        }
    }

    // Vérifier les achievements basés sur l'activité
    private async checkActivityBasedAchievements(
        userId: string,
        userName: string,
        leaderboardEntry: any
    ): Promise<void> {
        const achievementsToCheck: Array<keyof typeof ACHIEVEMENT_DEFINITIONS> = [];

        // Vérifier la série de connexion
        if (leaderboardEntry.streak >= 30) {
            achievementsToCheck.push('consistency_king');
        } else if (leaderboardEntry.streak >= 7) {
            achievementsToCheck.push('perfect_week');
        }

        // Vérifier les points totaux pour des paliers
        if (leaderboardEntry.totalPoints >= 10000) {
            achievementsToCheck.push('excellence_award');
        } else if (leaderboardEntry.totalPoints >= 5000) {
            achievementsToCheck.push('performance_booster');
        } else if (leaderboardEntry.totalPoints >= 1000) {
            achievementsToCheck.push('knowledge_keeper');
        }

        // Attribuer les achievements
        for (const achievementType of achievementsToCheck) {
            await this.awardAchievement(userId, userName, achievementType);
        }
    }

    // Obtenir le titre basé sur le niveau
    private getLevelTitle(level: number): string {
        if (level >= 50) return "Maître Légendaire";
        if (level >= 40) return "Expert Élite";
        if (level >= 30) return "Maître Confirmé";
        if (level >= 20) return "Professionnel Avancé";
        if (level >= 10) return "Praticien Compétent";
        return "Apprenti";
    }

    // Récupérer les achievements d'un utilisateur
    async getUserAchievements(userId: string): Promise<IAchievement[]> {
        return await Achievement.find({ userId }).sort({ earnedAt: -1 });
    }

    // Récupérer le leaderboard
    async getLeaderboard(limit: number = 50): Promise<any[]> {
        const entries = await LeaderboardEntry.find()
            .sort({ totalPoints: -1 })
            .limit(limit);

        return entries.map((entry, index) => ({
            ...entry.toObject(),
            rank: index + 1
        }));
    }

    // Récupérer les statistiques d'un utilisateur
    async getUserStats(userId: string): Promise<any> {
        const [achievements, leaderboardEntry, userLevel] = await Promise.all([
            Achievement.countDocuments({ userId }),
            LeaderboardEntry.findOne({ userId }),
            UserLevel.findOne({ userId })
        ]);

        return {
            achievementsCount: achievements,
            leaderboardEntry,
            userLevel
        };
    }

    // Récupérer les achievements récents
    async getRecentAchievements(limit: number = 10): Promise<IAchievement[]> {
        return await Achievement.find()
            .sort({ earnedAt: -1 })
            .limit(limit)
            .populate('userId', 'name avatar');
    }

    // Calculer les statistiques globales
    async getGlobalStats(): Promise<any> {
        const [
            totalAchievements,
            totalUsersWithAchievements,
            rarestAchievement,
            mostActiveUser
        ] = await Promise.all([
            Achievement.countDocuments(),
            Achievement.distinct('userId').then(ids => ids.length),
            Achievement.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } },
                { $sort: { count: 1 } },
                { $limit: 1 }
            ]),
            LeaderboardEntry.findOne().sort({ totalPoints: -1 })
        ]);

        return {
            totalAchievements,
            totalUsersWithAchievements,
            rarestAchievement: rarestAchievement[0]?._id,
            mostActiveUser: mostActiveUser?.userName
        };
    }

    // Réinitialiser les statistiques hebdomadaires
    async resetWeeklyStats(): Promise<void> {
        await LeaderboardEntry.updateMany({}, { weeklyPoints: 0 });
    }

    // Réinitialiser les statistiques mensuelles
    async resetMonthlyStats(): Promise<void> {
        await LeaderboardEntry.updateMany({}, { monthlyPoints: 0 });
    }

    // Obtenir les badges déverrouillés
    async getUserBadges(userId: string): Promise<string[]> {
        const userLevel = await UserLevel.findOne({ userId });
        return userLevel?.unlockedBadges || [];
    }

    // Ajouter un badge déverrouillé
    async unlockBadge(userId: string, badge: string): Promise<void> {
        const userLevel = await UserLevel.findOne({ userId });
        if (userLevel && !userLevel.unlockedBadges.includes(badge)) {
            userLevel.unlockedBadges.push(badge);
            await userLevel.save();
        }
    }

    // Vérifier les achievements spécifiques à des actions métier
    async checkBusinessAchievements(
        userId: string,
        userName: string,
        action: string,
        data: any
    ): Promise<void> {
        const achievementsToCheck: Array<keyof typeof ACHIEVEMENT_DEFINITIONS> = [];

        switch (action) {
            case 'complaint_resolved':
                if (data.resolutionTime && data.resolutionTime < 2) {
                    achievementsToCheck.push('quick_resolver');
                }
                if (data.complexity === 'high') {
                    achievementsToCheck.push('problem_solver');
                }
                break;

            case 'document_shared':
                achievementsToCheck.push('knowledge_sharer');
                break;

            case 'helped_colleague':
                achievementsToCheck.push('team_player');
                break;

            case 'message_sent':
                // Compter les messages envoyés pour cet utilisateur
                const messageCount = await this.getMessageCount(userId);
                if (messageCount >= 50) {
                    achievementsToCheck.push('communication_expert');
                }
                break;

            case 'login_early':
                achievementsToCheck.push('early_bird');
                break;

            case 'login_late':
                achievementsToCheck.push('night_owl');
                break;

            case 'feature_used':
                // Compter les fonctionnalités utilisées
                const featuresCount = await this.getFeaturesUsedCount(userId);
                if (featuresCount >= 5) {
                    achievementsToCheck.push('explorer');
                }
                break;

            case 'feedback_received':
                if (data.rating && data.rating >= 4.5) {
                    // Compter les feedbacks positifs
                    const positiveFeedbacks = await this.getPositiveFeedbackCount(userId);
                    if (positiveFeedbacks >= 10) {
                        achievementsToCheck.push('feedback_champion');
                    }
                }
                break;

            case 'suggestion_implemented':
                achievementsToCheck.push('innovation_award');
                break;

            case 'trained_user':
                achievementsToCheck.push('mentor');
                break;

            case 'process_optimized':
                achievementsToCheck.push('process_improver');
                break;

            case 'safety_reported':
                achievementsToCheck.push('safety_champion');
                break;

            case 'environmental_initiative':
                achievementsToCheck.push('environment_guardian');
                break;

            case 'organized_event':
                achievementsToCheck.push('community_builder');
                break;
        }

        // Attribuer les achievements
        for (const achievementType of achievementsToCheck) {
            await this.awardAchievement(userId, userName, achievementType, data);
        }
    }

    // Méthodes utilitaires (à implémenter selon tes modèles)
    private async getMessageCount(userId: string): Promise<number> {
        // Implémentation selon ton modèle de messages
        return 0;
    }

    private async getFeaturesUsedCount(userId: string): Promise<number> {
        // Implémentation selon ton système de tracking
        return 0;
    }

    private async getPositiveFeedbackCount(userId: string): Promise<number> {
        // Implémentation selon ton système de feedback
        return 0;
    }
}

export default new GamificationService();
