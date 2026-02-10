import express from 'express';
import { MessageController } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Routes protégées
router.post('/threads', protect, MessageController.createThread);
router.get('/threads', protect, MessageController.getUserThreads);
router.post('/threads/direct', protect, MessageController.getOrCreateDirectThread);

router.post('/messages', protect, MessageController.sendMessage);
router.get('/threads/:threadId/messages', protect, MessageController.getThreadMessages);
router.post('/threads/:threadId/read', protect, MessageController.markAsRead);

router.post('/reactions', protect, MessageController.addReaction);
router.delete('/reactions', protect, MessageController.removeReaction);

router.get('/search', protect, MessageController.searchMessages);
router.get('/unread-count', protect, MessageController.getUnreadCount);

export default router;
