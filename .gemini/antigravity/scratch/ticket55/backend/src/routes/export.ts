import express from 'express';
import { ExportController } from '../controllers/exportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Routes protégées
router.get('/complaints', protect, ExportController.exportComplaints);
router.get('/planning', protect, ExportController.exportPlanning);
router.get('/dashboard', protect, ExportController.exportDashboardStats);

export default router;
