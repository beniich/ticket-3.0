import express from 'express';
import { AlertController } from '../controllers/alertController.js';
import { MCPNotificationController } from '../controllers/mcpNotificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Routes protégées
router.get('/', protect, AlertController.getUserAlerts);
router.post('/', protect, AlertController.createCustomAlert);
router.get('/stats', protect, AlertController.getAlertStats);

// Nouvelles routes MCP Smart Notifications
router.post('/smart', protect, MCPNotificationController.createSmartNotification);
router.post('/digest/:type', protect, MCPNotificationController.createSmartDigest);

// Routes spécifiques aux alertes
router.post('/:alertId/acknowledge', protect, AlertController.acknowledgeAlert);
router.post('/:alertId/resolve', protect, AlertController.resolveAlert);
router.post('/:alertId/actions/:actionIndex', protect, AlertController.executeAlertAction);

export default router;
