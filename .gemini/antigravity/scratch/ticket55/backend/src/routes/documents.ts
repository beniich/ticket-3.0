import express from 'express';
import { DocumentController } from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js'; // Assuming 'protect' is the exported auth middleware

const router = express.Router();

// Routes protégées
router.post('/', protect, DocumentController.createDocument);
router.post('/upload', protect, DocumentController.uploadFile, DocumentController.uploadDocumentFile);
router.put('/:documentId', protect, DocumentController.updateDocument);
router.get('/', protect, DocumentController.getDocuments);
router.get('/', protect, DocumentController.getDocuments); // Duplicate but fine
router.get('/categories', protect, DocumentController.getCategories);
router.post('/categories', protect, DocumentController.createCategory);
router.get('/folders', protect, DocumentController.getFolders);
router.post('/folders', protect, DocumentController.createFolder);
router.get('/search', protect, DocumentController.searchDocuments);
router.get('/stats', protect, DocumentController.getStats);

// Specific ID routes should be last to avoids conflict if IDs are not UUIDs (though they usually are)
router.get('/:documentId', protect, DocumentController.getDocumentById);
router.post('/:documentId/archive', protect, DocumentController.archiveDocument);
router.post('/:documentId/restore', protect, DocumentController.restoreDocument);

// Approbation
router.post('/:documentId/approval/request', protect, DocumentController.requestApproval);
router.post('/:documentId/approval/respond', protect, DocumentController.approveDocument);

export default router;
