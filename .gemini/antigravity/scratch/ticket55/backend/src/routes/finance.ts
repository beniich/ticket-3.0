import express from 'express';
import { FinanceController } from '../controllers/financeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin', 'dispatcher'), FinanceController.getRecords);
router.get('/stats', protect, authorize('admin', 'dispatcher'), FinanceController.getStats);
router.post('/', protect, authorize('admin'), FinanceController.createRecord);
router.patch('/:id/status', protect, authorize('admin'), FinanceController.updateStatus);

export default router;
