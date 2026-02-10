import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { DashboardController } from '../controllers/dashboardController.js';

const router = Router();

router.get('/', protect, DashboardController.getDashboardData);
router.get('/ai-trends', protect, DashboardController.getAITrends);

export default router;
