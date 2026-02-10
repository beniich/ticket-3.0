import { Request, Response } from 'express';
import gamificationService from '../services/gamificationService.js';
import { Achievement } from '../models/Achievement.js';

export class GamificationController {
    // Récupérer les achievements d'un utilisateur
    static async getUserAchievements(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const achievements = await gamificationService.getUserAchievements(userId);
            res.json(achievements);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer le leaderboard
    static async getLeaderboard(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 50;
            const leaderboard = await gamificationService.getLeaderboard(limit);
            res.json(leaderboard);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer les statistiques d'un utilisateur
    static async getUserStats(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const stats = await gamificationService.getUserStats(userId);
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer les achievements récents (globaux)
    static async getRecentAchievements(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const achievements = await gamificationService.getRecentAchievements(limit);
            res.json(achievements);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer les statistiques globales
    static async getGlobalStats(req: Request, res: Response) {
        try {
            const stats = await gamificationService.getGlobalStats();
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer les badges déverrouillés
    static async getUserBadges(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const badges = await gamificationService.getUserBadges(userId);
            res.json(badges);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Déverrouiller un badge spécifique
    static async unlockBadge(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const { badge } = req.body;

            if (!badge) {
                return res.status(400).json({ error: 'Badge requis' });
            }

            await gamificationService.unlockBadge(userId, badge);
            res.json({ success: true, message: 'Badge déverrouillé' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Vérifier les achievements pour une action
    static async checkAchievement(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const userName = (req.user as any)?.name || 'Utilisateur';
            const { action, data } = req.body;

            if (!action) {
                return res.status(400).json({ error: 'Action requise' });
            }

            await gamificationService.checkBusinessAchievements(userId, userName, action, data);
            res.json({ success: true, message: 'Achievements vérifiés' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer les niveaux des utilisateurs
    static async getUserLevels(req: Request, res: Response) {
        try {
            const { limit = 20, offset = 0 } = req.query;

            const levels = await Achievement.aggregate([
                {
                    $group: {
                        _id: '$userId',
                        totalXP: { $sum: '$points' },
                        achievementsCount: { $sum: 1 },
                        lastAchievement: { $max: '$earnedAt' }
                    }
                },
                {
                    $sort: { totalXP: -1 }
                },
                {
                    $skip: parseInt(offset as string)
                },
                {
                    $limit: parseInt(limit as string)
                }
            ]);

            res.json(levels);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récompenser manuellement un utilisateur
    static async rewardUser(req: Request, res: Response) {
        try {
            // Vérifier que l'utilisateur est admin
            if ((req.user as any)?.role !== 'admin') {
                return res.status(403).json({ error: 'Accès refusé' });
            }

            const { userId, userName, achievementType, points, reason } = req.body;

            if (!userId || !achievementType || !points) {
                return res.status(400).json({ error: 'userId, achievementType et points requis' });
            }

            // Créer un achievement personnalisé
            const achievement = new Achievement({
                userId,
                type: 'custom_reward',
                title: `Récompense: ${reason || 'Performance exceptionnelle'}`,
                description: reason || 'Récompense attribuée par un administrateur',
                points,
                badge: 'trophy',
                rarity: 'legendary',
                earnedAt: new Date(),
                metadata: { awardedBy: (req.user as any)?.id, reason }
            });

            const savedAchievement = await achievement.save();

            // Mettre à jour le leaderboard
            await gamificationService.updateLeaderboard(userId, userName, points);

            res.status(201).json(savedAchievement);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
