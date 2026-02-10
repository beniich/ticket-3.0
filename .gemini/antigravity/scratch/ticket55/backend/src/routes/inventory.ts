import express from 'express';
import { InventoryController } from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, InventoryController.getItems);
router.get('/:id', protect, InventoryController.getItem);
router.post('/', protect, authorize('admin', 'dispatcher'), InventoryController.createItem);
router.put('/:id', protect, authorize('admin', 'dispatcher'), InventoryController.updateItem);
router.delete('/:id', protect, authorize('admin'), InventoryController.deleteItem);

export default router;
