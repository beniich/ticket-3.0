import { NextFunction, Request, Response } from 'express';
import { DocumentModel as Document } from '../models/Document';

export const checkDocumentPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { documentId } = req.params;
        const userId = (req.user as any)?.id;

        if (!documentId) {
            return next();
        }

        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: 'Document non trouvé' });
        }

        // Example check: ensure user has read permission
        const canRead = document.permissions.read.includes(userId) ||
            document.permissions.read.includes('all') ||
            document.author.id === userId;

        if (!canRead) {
            return res.status(403).json({ error: 'Permission refusée' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la vérification des permissions' });
    }
};
