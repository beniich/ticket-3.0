import express from 'express';
import { GamificationController } from '../controllers/gamificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Routes protégées
router.get('/achievements', authenticate, GamificationController.getUserAchievements);
router.get('/leaderboard', authenticate, GamificationController.getLeaderboard);
router.get('/stats', authenticate, GamificationController.getUserStats);
router.get('/recent', authenticate, GamificationController.getRecentAchievements);
router.get('/badges', authenticate, GamificationController.getUserBadges);
router.get('/levels', authenticate, GamificationController.getUserLevels);

// Routes admin
router.post('/reward', authenticate, GamificationController.rewardUser);

// Routes publiques (pour dashboard)
router.get('/global-stats', GamificationController.getGlobalStats);

// Routes pour vérifier les achievements
router.post('/check', authenticate, GamificationController.checkAchievement);
router.post('/unlock-badge', authenticate, GamificationController.unlockBadge);

export default router;
