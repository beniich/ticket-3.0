import { Request, Response } from 'express';
import documentService from '../services/documentService.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuration Multer pour l'upload de fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/documents';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    },
    fileFilter: (req, file, cb) => {
        // Accepter les fichiers de tous types pour les documents
        cb(null, true);
    }
});

export class DocumentController {
    // Créer un document texte
    static async createDocument(req: Request, res: Response) {
        try {
            const {
                title,
                content,
                description,
                categoryId,
                tags,
                status,
                folderId
            } = req.body;

            const userId = (req.user as any)?.id;
            // Fetch user name? For now fallback.
            const userName = (req.user as any)?.name || 'Utilisateur'; // Need to fetch user ideally

            if (!title || !categoryId) { // content can be empty
                return res.status(400).json({
                    error: 'Title et categoryId sont requis'
                });
            }

            const document = await documentService.createDocument(
                title,
                content || '',
                userId,
                userName,
                categoryId,
                {
                    description,
                    tags,
                    status,
                    folderId
                }
            );

            res.status(201).json(document);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Upload d'un fichier
    static uploadFile = upload.single('file');

    static async uploadDocumentFile(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Fichier requis' });
            }

            const {
                title,
                description,
                categoryId,
                tags,
                folderId
            } = req.body;

            const userId = (req.user as any)?.id;
            const userName = (req.user as any)?.name || 'Utilisateur';

            const document = await documentService.createDocument(
                title || req.file.originalname,
                '', // Pas de contenu pour les fichiers
                userId,
                userName,
                categoryId,
                {
                    description,
                    tags: JSON.parse(tags || '[]'),
                    fileUrl: `/uploads/documents/${req.file.filename}`,
                    mimeType: req.file.mimetype,
                    fileSize: req.file.size,
                    fileType: 'file',
                    folderId: folderId || undefined
                }
            );

            res.status(201).json(document);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Mettre à jour un document
    static async updateDocument(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const updates = req.body;
            const userId = (req.user as any)?.id;
            const changesDescription = req.body.changesDescription;

            const document = await documentService.updateDocument(
                documentId,
                userId,
                updates,
                changesDescription
            );

            if (!document) {
                return res.status(404).json({ error: 'Document non trouvé' });
            }

            res.json(document);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer les documents
    static async getDocuments(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const {
                categoryId,
                status,
                search,
                folderId,
                tags,
                limit,
                offset,
                sortBy,
                sortOrder
            } = req.query;

            const filters: any = {};
            if (categoryId) filters.categoryId = categoryId;
            if (status) filters.status = status;
            if (search) filters.search = search;
            if (folderId) filters.folderId = folderId;
            if (tags) filters.tags = Array.isArray(tags) ? tags : [tags];

            const options: any = {};
            if (limit) options.limit = parseInt(limit as string);
            if (offset) options.offset = parseInt(offset as string);
            if (sortBy) options.sortBy = sortBy as string;
            if (sortOrder) options.sortOrder = sortOrder as 'asc' | 'desc';

            const result = await documentService.getDocuments(userId, filters, options);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer un document par ID
    static async getDocumentById(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const userId = (req.user as any)?.id;

            const document = await documentService.getDocumentById(documentId, userId);

            if (!document) {
                return res.status(404).json({ error: 'Document non trouvé' });
            }

            res.json(document);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Créer une catégorie
    static async createCategory(req: Request, res: Response) {
        try {
            // Vérifier que l'utilisateur est admin
            if ((req.user as any)?.role !== 'admin') {
                return res.status(403).json({ error: 'Accès refusé' });
            }

            const { name, description, icon, color, parentId } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Nom de catégorie requis' });
            }

            const category = await documentService.createCategory(name, description, {
                icon,
                color,
                parentId
            });

            res.status(201).json(category);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer les catégories
    static async getCategories(req: Request, res: Response) {
        try {
            const categories = await documentService.getCategories();
            res.json(categories);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Créer un dossier
    static async createFolder(req: Request, res: Response) {
        try {
            const { name, description, parentId } = req.body;
            const userId = (req.user as any)?.id;

            if (!name) {
                return res.status(400).json({ error: 'Nom de dossier requis' });
            }

            const folder = await documentService.createFolder(name, userId, {
                description,
                parentId
            });

            res.status(201).json(folder);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer les dossiers
    static async getFolders(req: Request, res: Response) {
        try {
            const { parentId } = req.query;
            const folders = await documentService.getFolders(parentId as string);
            res.json(folders);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Demander l'approbation
    static async requestApproval(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const { approvers, deadline } = req.body;
            const userId = (req.user as any)?.id;

            const document = await documentService.requestApproval(
                documentId,
                userId,
                approvers,
                deadline ? new Date(deadline) : undefined
            );

            if (!document) {
                return res.status(404).json({ error: 'Document non trouvé' });
            }

            res.json(document);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Approuver/rejeter un document
    static async approveDocument(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const { approved, comments } = req.body;
            const userId = (req.user as any)?.id;

            const document = await documentService.approveDocument(
                documentId,
                userId,
                approved,
                comments
            );

            if (!document) {
                return res.status(404).json({ error: 'Document non trouvé' });
            }

            res.json(document);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Rechercher des documents
    static async searchDocuments(req: Request, res: Response) {
        try {
            const { q, categoryId } = req.query;
            const userId = (req.user as any)?.id;

            if (!q || typeof q !== 'string') {
                return res.status(400).json({ error: 'Query parameter "q" requis' });
            }

            const documents = await documentService.searchDocuments(
                userId,
                q,
                { categoryId: categoryId as string }
            );

            res.json(documents);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer les statistiques
    static async getStats(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const stats = await documentService.getDocumentStats(userId);
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Archiver un document
    static async archiveDocument(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const userId = (req.user as any)?.id;

            const document = await documentService.archiveDocument(documentId, userId);

            if (!document) {
                return res.status(404).json({ error: 'Document non trouvé' });
            }

            res.json(document);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Restaurer un document
    static async restoreDocument(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const userId = (req.user as any)?.id;

            const document = await documentService.restoreDocument(documentId, userId);

            if (!document) {
                return res.status(404).json({ error: 'Document non trouvé' });
            }

            res.json(document);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
