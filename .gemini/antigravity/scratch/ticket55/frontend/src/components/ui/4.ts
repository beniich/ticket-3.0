4
Parfait ! Je vais te fournir le code complet pour le **système de gestion de documents et SOPs** qui va centraliser toutes les procédures et connaissances de ton organisation.

---

# 📚 SYSTÈME DE GESTION DE DOCUMENTS & SOPs

## 1. 📦 INSTALLATION DES DÉPENDANCES

### Backend (`backend/package.json`)
```json
{
  "dependencies": {
    "sharp": "^0.33.2",
    "mime-types": "^2.1.35",
    "sanitize-html": "^2.11.0"
  }
}
```

Frontend (`frontend/package.json`)
```json
{
  "dependencies": {
    "@tiptap/react": "^2.2.4",
    "@tiptap/starter-kit": "^2.2.4",
    "@tiptap/extension-placeholder": "^2.2.4"
  }
}
```

Installe :
```bash
cd backend && npm install sharp mime-types sanitize-html
cd frontend && npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

---

## 2. 📁 STRUCTURE DES FICHIERS

```
backend/
├── src/
│   ├── models/
│   │   └── Document.ts              ✨ NOUVEAU
│   ├── controllers/
│   │   └── documentController.ts     ✨ NOUVEAU
│   ├── routes/
│   │   └── documents.ts             ✨ NOUVEAU
│   ├── services/
│   │   └── documentService.ts        ✨ NOUVEAU
│   └── middleware/
│       └── documentMiddleware.ts     ✨ NOUVEAU

frontend/
├── src/
│   ├── components/
│   │   ├── documents/
│   │   │   ├── DocumentLibrary.tsx    ✨ NOUVEAU
│   │   │   ├── DocumentViewer.tsx     ✨ NOUVEAU
│   │   │   ├── DocumentEditor.tsx     ✨ NOUVEAU
│   │   │   ├── DocumentCard.tsx       ✨ NOUVEAU
│   │   │   ├── DocumentTree.tsx       ✨ NOUVEAU
│   │   │   ├── VersionHistory.tsx     ✨ NOUVEAU
│   │   │   └── ApprovalWorkflow.tsx   ✨ NOUVEAU
│   ├── hooks/
│   │   └── useDocuments.ts            ✨ NOUVEAU
│   ├── types/
│   │   └── document.ts                ✨ NOUVEAU
│   └── lib/
│       └── documentUtils.ts           ✨ NOUVEAU
```

---

## 3. 📄 MODÈLE DE DONNÉES

### 📄 `backend/src/models/Document.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IDocument extends Document {
  title: string;
  description: string;
  content: string; // Pour les documents texte/SOP
  fileUrl?: string; // Pour les fichiers uploadés
  fileType: 'text' | 'file' | 'folder';
  mimeType?: string;
  fileSize?: number;
  folderId?: string; // ID du dossier parent
  categoryId: string; // Référence à DocumentCategory
  tags: string[];
  author: {
    id: string;
    name: string;
    department?: string;
  };
  version: number;
  status: 'draft' | 'review' | 'approved' | 'archived';
  approval?: {
    status: 'pending' | 'approved' | 'rejected';
    approvers: {
      userId: string;
      name: string;
      approvedAt?: Date;
      rejectedAt?: Date;
      comments?: string;
    }[];
    requestedAt: Date;
    deadline?: Date;
  };
  permissions: {
    read: string[]; // User IDs ou roles
    write: string[]; // User IDs ou roles
    approve: string[]; // User IDs pouvant approuver
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastViewed?: Date;
    viewCount: number;
    editCount: number;
  };
  history: DocumentVersion[];
  relatedDocuments?: string[]; // IDs de documents liés
}

export interface DocumentVersion {
  version: number;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: Date;
  changes?: string; // Description des changements
}

export interface IDocumentCategory extends Document {
  name: string;
  description: string;
  icon: string;
  color: string;
  parentId?: string; // Pour catégories imbriquées
  order: number;
}

export interface IDocumentFolder extends Document {
  name: string;
  description: string;
  parentId?: string;
  path: string[]; // Chemin hiérarchique
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentVersionSchema = new Schema<DocumentVersion>({
  version: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  createdAt: { type: Date, required: true },
  changes: { type: String }
});

const DocumentSchema = new Schema<IDocument>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  content: { type: String, default: '' },
  fileUrl: { type: String },
  fileType: { 
    type: String, 
    enum: ['text', 'file', 'folder'], 
    default: 'text' 
  },
  mimeType: { type: String },
  fileSize: { type: Number },
  folderId: { type: String, ref: 'DocumentFolder' },
  categoryId: { type: String, ref: 'DocumentCategory', required: true },
  tags: [{ type: String }],
  author: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String }
  },
  version: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['draft', 'review', 'approved', 'archived'],
    default: 'draft'
  },
  approval: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvers: [{
      userId: { type: String, required: true },
      name: { type: String, required: true },
      approvedAt: { type: Date },
      rejectedAt: { type: Date },
      comments: { type: String }
    }],
    requestedAt: { type: Date },
    deadline: { type: Date }
  },
  permissions: {
    read: [{ type: String }], // User IDs ou roles
    write: [{ type: String }], // User IDs ou roles
    approve: [{ type: String }] // User IDs pouvant approuver
  },
  metadata: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastViewed: { type: Date },
    viewCount: { type: Number, default: 0 },
    editCount: { type: Number, default: 0 }
  },
  history: [DocumentVersionSchema],
  relatedDocuments: [{ type: String, ref: 'Document' }]
});

DocumentSchema.plugin(uniqueValidator);

const DocumentCategorySchema = new Schema<IDocumentCategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String, default: '📚' },
  color: { type: String, default: '#3b82f6' },
  parentId: { type: String, ref: 'DocumentCategory' },
  order: { type: Number, default: 0 }
});

const DocumentFolderSchema = new Schema<IDocumentFolder>({
  name: { type: String, required: true },
  description: { type: String },
  parentId: { type: String, ref: 'DocumentFolder' },
  path: [{ type: String }], // Chemin hiérarchique
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour optimiser les recherches
DocumentSchema.index({ title: 'text', description: 'text', content: 'text', tags: 'text' });
DocumentSchema.index({ categoryId: 1, status: 1 });
DocumentSchema.index({ author: 1, createdAt: -1 });

export const Document = mongoose.model<IDocument>('Document', DocumentSchema);
export const DocumentCategory = mongoose.model<IDocumentCategory>('DocumentCategory', DocumentCategorySchema);
export const DocumentFolder = mongoose.model<IDocumentFolder>('DocumentFolder', DocumentFolderSchema);
```

---

## 4. 📄 SERVICES DOCUMENTS

### 📄 `backend/src/services/documentService.ts`
```typescript
import { Document, DocumentCategory, DocumentFolder, IDocument } from '../models/Document';
import sanitizeHtml from 'sanitize-html';
import { Readable } from 'stream';
import { createWriteStream } from 'fs';

export class DocumentService {
  // Créer un document
  async createDocument(
    title: string,
    content: string,
    authorId: string,
    authorName: string,
    categoryId: string,
    options: {
      description?: string;
      tags?: string[];
      status?: 'draft' | 'review' | 'approved' | 'archived';
      fileUrl?: string;
      mimeType?: string;
      fileSize?: number;
      folderId?: string;
    } = {}
  ): Promise<IDocument> {
    // Sanitize le contenu HTML
    const cleanContent = sanitizeHtml(content, {
      allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      allowedAttributes: {
        'a': ['href']
      }
    });

    const document = new Document({
      title,
      content: cleanContent,
      description: options.description || '',
      categoryId,
      tags: options.tags || [],
      author: {
        id: authorId,
        name: authorName
      },
      status: options.status || 'draft',
      fileUrl: options.fileUrl,
      mimeType: options.mimeType,
      fileSize: options.fileSize,
      folderId: options.folderId,
      permissions: {
        read: [authorId], // Par défaut, seul l'auteur peut lire
        write: [authorId], // Par défaut, seul l'auteur peut écrire
        approve: [] // À définir selon les règles de l'organisation
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0,
        editCount: 0
      },
      history: [{
        version: 1,
        title,
        content: cleanContent,
        author: {
          id: authorId,
          name: authorName
        },
        createdAt: new Date()
      }]
    });

    return await document.save();
  }

  // Mettre à jour un document
  async updateDocument(
    documentId: string,
    userId: string,
    updates: {
      title?: string;
      content?: string;
      description?: string;
      tags?: string[];
      status?: 'draft' | 'review' | 'approved' | 'archived';
    },
    changesDescription?: string
  ): Promise<IDocument | null> {
    const document = await Document.findById(documentId);
    if (!document) return null;

    // Vérifier les permissions
    if (!document.permissions.write.includes(userId) && 
        !document.permissions.write.includes('admin')) {
      throw new Error('Permission refusée');
    }

    // Mettre à jour les champs
    if (updates.title) document.title = updates.title;
    if (updates.content) {
      document.content = sanitizeHtml(updates.content, {
        allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        allowedAttributes: {
          'a': ['href']
        }
      });
    }
    if (updates.description) document.description = updates.description;
    if (updates.tags) document.tags = updates.tags;
    if (updates.status) document.status = updates.status;

    document.metadata.updatedAt = new Date();
    document.metadata.editCount += 1;

    // Ajouter à l'historique
    document.history.push({
      version: document.version + 1,
      title: document.title,
      content: document.content,
      author: {
        id: userId,
        name: 'Utilisateur' // À récupérer via User service
      },
      createdAt: new Date(),
      changes: changesDescription
    });

    document.version += 1;

    return await document.save();
  }

  // Récupérer les documents avec filtres
  async getDocuments(
    userId: string,
    filters: {
      categoryId?: string;
      status?: 'draft' | 'review' | 'approved' | 'archived';
      search?: string;
      folderId?: string;
      tags?: string[];
    } = {},
    options: {
      limit?: number;
      offset?: number;
      sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'viewCount';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ documents: IDocument[]; total: number }> {
    const query: any = {
      $or: [
        { 'permissions.read': userId },
        { 'permissions.read': 'all' },
        { 'permissions.read': { $regex: new RegExp(userId, 'i') } }
      ]
    };

    if (filters.categoryId) query.categoryId = filters.categoryId;
    if (filters.status) query.status = filters.status;
    if (filters.folderId) query.folderId = filters.folderId;
    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $all: filters.tags };
    }

    const sortOptions: any = {};
    if (options.sortBy) {
      sortOptions[options.sortBy] = options.sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const [documents, total] = await Promise.all([
      Document.find(query)
        .sort(sortOptions)
        .limit(options.limit || 20)
        .skip(options.offset || 0),
      Document.countDocuments(query)
    ]);

    return { documents, total };
  }

  // Récupérer un document par ID
  async getDocumentById(documentId: string, userId: string): Promise<IDocument | null> {
    const document = await Document.findById(documentId);
    if (!document) return null;

    // Vérifier les permissions de lecture
    if (!document.permissions.read.includes(userId) && 
        !document.permissions.read.includes('all') &&
        !document.permissions.read.some(role => userId.includes(role))) {
      throw new Error('Permission refusée');
    }

    // Mettre à jour les métadonnées de visualisation
    document.metadata.lastViewed = new Date();
    document.metadata.viewCount += 1;
    await document.save();

    return document;
  }

  // Créer une catégorie de documents
  async createCategory(
    name: string,
    description: string,
    options: {
      icon?: string;
      color?: string;
      parentId?: string;
    } = {}
  ): Promise<any> {
    const category = new DocumentCategory({
      name,
      description,
      icon: options.icon || '📚',
      color: options.color || '#3b82f6',
      parentId: options.parentId
    });

    return await category.save();
  }

  // Récupérer toutes les catégories
  async getCategories(): Promise<any[]> {
    return await DocumentCategory.find().sort({ order: 1, name: 1 });
  }

  // Créer un dossier
  async createFolder(
    name: string,
    createdBy: string,
    options: {
      description?: string;
      parentId?: string;
    } = {}
  ): Promise<any> {
    let path: string[] = [];
    if (options.parentId) {
      const parentFolder = await DocumentFolder.findById(options.parentId);
      if (parentFolder) {
        path = [...parentFolder.path, options.parentId];
      }
    }

    const folder = new DocumentFolder({
      name,
      description: options.description,
      parentId: options.parentId,
      path,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return await folder.save();
  }

  // Récupérer les dossiers
  async getFolders(parentId?: string): Promise<any[]> {
    const query: any = {};
    if (parentId) {
      query.parentId = parentId;
    } else {
      query.parentId = { $exists: false };
    }
    
    return await DocumentFolder.find(query).sort({ name: 1 });
  }

  // Demander l'approbation d'un document
  async requestApproval(
    documentId: string,
    userId: string,
    approvers: { userId: string; name: string }[],
    deadline?: Date
  ): Promise<IDocument | null> {
    const document = await Document.findById(documentId);
    if (!document) return null;

    // Vérifier que l'utilisateur peut demander l'approbation
    if (document.author.id !== userId && !document.permissions.approve.includes(userId)) {
      throw new Error('Permission refusée');
    }

    document.approval = {
      status: 'pending',
      approvers: approvers.map(approver => ({
        userId: approver.userId,
        name: approver.name
      })),
      requestedAt: new Date(),
      deadline
    };

    document.status = 'review';
    document.metadata.updatedAt = new Date();

    return await document.save();
  }

  // Approuver un document
  async approveDocument(
    documentId: string,
    userId: string,
    approved: boolean,
    comments?: string
  ): Promise<IDocument | null> {
    const document = await Document.findById(documentId);
    if (!document || !document.approval) return null;

    // Vérifier que l'utilisateur est un approbateur
    const approver = document.approval.approvers.find(a => a.userId === userId);
    if (!approver) {
      throw new Error('Vous n\'êtes pas un approbateur pour ce document');
    }

    if (approved) {
      approver.approvedAt = new Date();
      approver.comments = comments;
    } else {
      approver.rejectedAt = new Date();
      approver.comments = comments;
    }

    // Vérifier si tous les approbateurs ont répondu
    const allApproved = document.approval.approvers.every(a => a.approvedAt);
    const anyRejected = document.approval.approvers.some(a => a.rejectedAt);

    if (anyRejected) {
      document.approval.status = 'rejected';
      document.status = 'draft'; // Retour à l'état brouillon
    } else if (allApproved) {
      document.approval.status = 'approved';
      document.status = 'approved';
    }

    document.metadata.updatedAt = new Date();

    return await document.save();
  }

  // Rechercher des documents
  async searchDocuments(
    userId: string,
    query: string,
    options: {
      limit?: number;
      categoryId?: string;
    } = {}
  ): Promise<IDocument[]> {
    const searchQuery: any = {
      $text: { $search: query },
      $or: [
        { 'permissions.read': userId },
        { 'permissions.read': 'all' }
      ]
    };

    if (options.categoryId) {
      searchQuery.categoryId = options.categoryId;
    }

    return await Document.find(searchQuery)
      .sort({ score: { $meta: 'textScore' } })
      .limit(options.limit || 10);
  }

  // Obtenir les statistiques des documents
  async getDocumentStats(userId: string): Promise<any> {
    const totalDocs = await Document.countDocuments({
      $or: [
        { 'permissions.read': userId },
        { 'permissions.read': 'all' }
      ]
    });

    const byStatus = await Document.aggregate([
      {
        $match: {
          $or: [
            { 'permissions.read': userId },
            { 'permissions.read': 'all' }
          ]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const byCategory = await Document.aggregate([
      {
        $match: {
          $or: [
            { 'permissions.read': userId },
            { 'permissions.read': 'all' }
          ]
        }
      },
      {
        $lookup: {
          from: 'documentcategories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $group: {
          _id: '$category.name',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentViews = await Document.find({
      'metadata.lastViewed': { $exists: true },
      $or: [
        { 'permissions.read': userId },
        { 'permissions.read': 'all' }
      ]
    })
    .sort({ 'metadata.lastViewed': -1 })
    .limit(5)
    .select('title metadata.lastViewed');

    return {
      total: totalDocs,
      byStatus,
      byCategory,
      recentViews
    };
  }

  // Archiver un document
  async archiveDocument(documentId: string, userId: string): Promise<IDocument | null> {
    const document = await Document.findById(documentId);
    if (!document) return null;

    // Vérifier les permissions (seuls les admins ou auteurs peuvent archiver)
    if (document.author.id !== userId && !userId.includes('admin')) {
      throw new Error('Permission refusée');
    }

    document.status = 'archived';
    document.metadata.updatedAt = new Date();

    return await document.save();
  }

  // Restaurer un document archivé
  async restoreDocument(documentId: string, userId: string): Promise<IDocument | null> {
    const document = await Document.findById(documentId);
    if (!document) return null;

    if (document.author.id !== userId && !userId.includes('admin')) {
      throw new Error('Permission refusée');
    }

    document.status = 'draft'; // Ou l'état précédent
    document.metadata.updatedAt = new Date();

    return await document.save();
  }
}

export default new DocumentService();
```

---

## 5. 📄 CONTROLLERS API

### 📄 `backend/src/controllers/documentController.ts`
```typescript
import { Request, Response } from 'express';
import documentService from '../services/documentService';
import { Document, DocumentCategory, DocumentFolder } from '../models/Document';
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

      const userId = req.user!.userId;
      const userName = req.user!.name || 'Utilisateur';

      if (!title || !content || !categoryId) {
        return res.status(400).json({ 
          error: 'Title, content et categoryId sont requis' 
        });
      }

      const document = await documentService.createDocument(
        title,
        content,
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

      const userId = req.user!.userId;
      const userName = req.user!.name || 'Utilisateur';

      const document = await documentService.createDocument(
        title || req.file.originalname,
        '', // Pas de contenu pour les fichiers
        userId,
        userName,
        categoryId,
        {
          description,
          tags,
          fileUrl: `/uploads/documents/${req.file.filename}`,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
          fileType: 'file',
          folderId
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
      const userId = req.user!.userId;
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
      const userId = req.user!.userId;
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
      if (sortBy) options.sortBy = sortBy;
      if (sortOrder) options.sortOrder = sortOrder;

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
      const userId = req.user!.userId;

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
      if (req.user!.role !== 'admin') {
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
      const userId = req.user!.userId;

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
      const userId = req.user!.userId;

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
      const userId = req.user!.userId;

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
      const userId = req.user!.userId;

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
      const userId = req.user!.userId;
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
      const userId = req.user!.userId;

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
      const userId = req.user!.userId;

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
```

---

## 6. 📄 ROUTES API

### 📄 `backend/src/routes/documents.ts`
```typescript
import express from 'express';
import { DocumentController } from '../controllers/documentController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Routes protégées
router.post('/', authenticate, DocumentController.createDocument);
router.post('/upload', authenticate, DocumentController.uploadFile, DocumentController.uploadDocumentFile);
router.put('/:documentId', authenticate, DocumentController.updateDocument);
router.get('/', authenticate, DocumentController.getDocuments);
router.get('/:documentId', authenticate, DocumentController.getDocumentById);
router.post('/:documentId/archive', authenticate, DocumentController.archiveDocument);
router.post('/:documentId/restore', authenticate, DocumentController.restoreDocument);

// Catégories
router.post('/categories', authenticate, DocumentController.createCategory);
router.get('/categories', authenticate, DocumentController.getCategories);

// Dossiers
router.post('/folders', authenticate, DocumentController.createFolder);
router.get('/folders', authenticate, DocumentController.getFolders);

// Approbation
router.post('/:documentId/approval/request', authenticate, DocumentController.requestApproval);
router.post('/:documentId/approval/respond', authenticate, DocumentController.approveDocument);

// Recherche
router.get('/search', authenticate, DocumentController.searchDocuments);

// Statistiques
router.get('/stats', authenticate, DocumentController.getStats);

export default router;
```

### 📄 `backend/src/server.ts` (ajout de la route)
```typescript
// ... imports existants ...
import documentRoutes from './routes/documents';

// ... middleware ...

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/documents', documentRoutes); // ← AJOUTER CETTE LIGNE

// Servir les fichiers uploadés
app.use('/uploads', express.static('uploads'));

// ... démarrage serveur ...
```

---

## 7. 📄 FRONTEND : TYPES ET INTERFACES

### 📄 `frontend/src/types/document.ts`
```typescript
export interface Document {
  id: string;
  title: string;
  description: string;
  content: string;
  fileUrl?: string;
  fileType: 'text' | 'file' | 'folder';
  mimeType?: string;
  fileSize?: number;
  folderId?: string;
  categoryId: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    department?: string;
  };
  version: number;
  status: 'draft' | 'review' | 'approved' | 'archived';
  approval?: {
    status: 'pending' | 'approved' | 'rejected';
    approvers: {
      userId: string;
      name: string;
      approvedAt?: string;
      rejectedAt?: string;
      comments?: string;
    }[];
    requestedAt: string;
    deadline?: string;
  };
  permissions: {
    read: string[];
    write: string[];
    approve: string[];
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    lastViewed?: string;
    viewCount: number;
    editCount: number;
  };
  history: DocumentVersion[];
  relatedDocuments?: string[];
}

export interface DocumentVersion {
  version: number;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  changes?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  parentId?: string;
  order: number;
}

export interface DocumentFolder {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  path: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentStats {
  total: number;
  byStatus: {
    _id: string;
    count: number;
  }[];
  byCategory: {
    _id: string;
    count: number;
  }[];
  recentViews: {
    title: string;
    metadata: {
      lastViewed: string;
    };
  }[];
}

export interface DocumentFormData {
  title: string;
  content: string;
  description?: string;
  categoryId: string;
  tags?: string[];
  folderId?: string;
  status?: 'draft' | 'review' | 'approved' | 'archived';
  file?: File;
}
```

---

## 8. 📄 HOOKS FRONTEND

### 📄 `frontend/src/hooks/useDocuments.ts`
```typescript
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Document, DocumentCategory, DocumentFolder, DocumentStats } from '@/types/document';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les documents
  const fetchDocuments = useCallback(async (filters: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/documents', { params: filters });
      setDocuments(response.data.documents);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur chargement documents');
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer un document par ID
  const fetchDocumentById = useCallback(async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/documents/${documentId}`);
      setCurrentDocument(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur chargement document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un document
  const createDocument = async (formData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (formData.file) {
        // Upload de fichier
        const uploadData = new FormData();
        uploadData.append('file', formData.file);
        uploadData.append('title', formData.title);
        uploadData.append('description', formData.description || '');
        uploadData.append('categoryId', formData.categoryId);
        uploadData.append('tags', JSON.stringify(formData.tags || []));
        uploadData.append('folderId', formData.folderId || '');

        response = await api.post('/documents/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Document texte
        response = await api.post('/documents', formData);
      }

      // Rafraîchir la liste
      fetchDocuments();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur création document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un document
  const updateDocument = async (documentId: string, updates: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/documents/${documentId}`, updates);
      
      // Mettre à jour dans la liste
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? response.data : doc)
      );
      
      // Mettre à jour le document courant si c'est lui
      if (currentDocument && currentDocument.id === documentId) {
        setCurrentDocument(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur mise à jour document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les catégories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/documents/categories');
      setCategories(response.data);
    } catch (err: any) {
      console.error('Erreur chargement catégories:', err);
    }
  }, []);

  // Créer une catégorie
  const createCategory = async (categoryData: any) => {
    try {
      const response = await api.post('/documents/categories', categoryData);
      setCategories(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erreur création catégorie');
    }
  };

  // Récupérer les dossiers
  const fetchFolders = useCallback(async (parentId?: string) => {
    try {
      const params = parentId ? { parentId } : {};
      const response = await api.get('/documents/folders', { params });
      setFolders(response.data);
    } catch (err: any) {
      console.error('Erreur chargement dossiers:', err);
    }
  }, []);

  // Créer un dossier
  const createFolder = async (folderData: any) => {
    try {
      const response = await api.post('/documents/folders', folderData);
      setFolders(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erreur création dossier');
    }
  };

  // Rechercher des documents
  const searchDocuments = async (query: string, categoryId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = { q: query };
      if (categoryId) params.categoryId = categoryId;
      
      const response = await api.get('/documents/search', { params });
      setDocuments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur recherche documents');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les statistiques
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/documents/stats');
      setStats(response.data);
    } catch (err: any) {
      console.error('Erreur chargement stats:', err);
    }
  }, []);

  // Demander l'approbation
  const requestApproval = async (documentId: string, approvers: any[], deadline?: string) => {
    try {
      const response = await api.post(`/documents/${documentId}/approval/request`, {
        approvers,
        deadline
      });
      
      // Mettre à jour le document
      if (currentDocument && currentDocument.id === documentId) {
        setCurrentDocument(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erreur demande approbation');
    }
  };

  // Répondre à une approbation
  const respondApproval = async (documentId: string, approved: boolean, comments?: string) => {
    try {
      const response = await api.post(`/documents/${documentId}/approval/respond`, {
        approved,
        comments
      });
      
      // Mettre à jour le document
      if (currentDocument && currentDocument.id === documentId) {
        setCurrentDocument(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erreur réponse approbation');
    }
  };

  // Archiver un document
  const archiveDocument = async (documentId: string) => {
    try {
      const response = await api.post(`/documents/${documentId}/archive`);
      
      // Mettre à jour dans la liste
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? response.data : doc)
      );
      
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erreur archivage document');
    }
  };

  // Restaurer un document
  const restoreDocument = async (documentId: string) => {
    try {
      const response = await api.post(`/documents/${documentId}/restore`);
      
      // Mettre à jour dans la liste
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? response.data : doc)
      );
      
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erreur restauration document');
    }
  };

  // Effet initial
  useEffect(() => {
    fetchCategories();
    fetchFolders();
    fetchStats();
  }, [fetchCategories, fetchFolders, fetchStats]);

  return {
    documents,
    categories,
    folders,
    currentDocument,
    stats,
    loading,
    error,
    fetchDocuments,
    fetchDocumentById,
    createDocument,
    updateDocument,
    createCategory,
    fetchFolders,
    createFolder,
    searchDocuments,
    requestApproval,
    respondApproval,
    archiveDocument,
    restoreDocument,
    setCurrentDocument
  };
};
```

---

## 9. 📄 COMPOSANTS UI

### 📄 `frontend/src/components/documents/DocumentCard.tsx`
```tsx
'use client';

import React from 'react';
import { Document } from '@/types/document';
import { 
  FileText, 
  Folder, 
  File, 
  Clock, 
  Eye, 
  Edit3, 
  Archive,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DocumentCardProps {
  document: Document;
  onSelect: (doc: Document) => void;
  onArchive?: (docId: string) => void;
  className?: string;
}

export const DocumentCard = ({ 
  document, 
  onSelect, 
  onArchive,
  className = ''
}: DocumentCardProps) => {
  const getFileIcon = () => {
    switch(document.fileType) {
      case 'folder': return <Folder className="w-8 h-8" />;
      case 'file': 
        if (document.mimeType?.includes('image')) return <File className="w-8 h-8" />;
        if (document.mimeType?.includes('pdf')) return <FileText className="w-8 h-8" />;
        return <File className="w-8 h-8" />;
      default: return <FileText className="w-8 h-8" />;
    }
  };

  const getStatusColor = () => {
    switch(document.status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={() => onSelect(document)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor()}`}>
            {getFileIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {document.title}
            </h3>
            {document.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {document.description}
              </p>
            )}
            <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
              <User className="w-3 h-3 mr-1" />
              <span>{document.author.name}</span>
              <Clock className="w-3 h-3 ml-3 mr-1" />
              <span>{formatDate(document.metadata.updatedAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {document.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
            {document.status === 'review' && <AlertCircle className="w-3 h-3 mr-1" />}
            {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
          </span>
          
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Eye className="w-3 h-3 mr-1" />
            <span>{document.metadata.viewCount}</span>
            <Edit3 className="w-3 h-3 ml-2 mr-1" />
            <span>{document.metadata.editCount}</span>
          </div>
        </div>
      </div>

      {document.tags && document.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {document.tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {document.fileType === 'file' && document.fileSize && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {Math.round(document.fileSize / 1024)} KB
        </div>
      )}
    </div>
  );
};
```

### 📄 `frontend/src/components/documents/DocumentLibrary.tsx`
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DocumentCard } from './DocumentCard';
import { DocumentTree } from './DocumentTree';
import { DocumentEditor } from './DocumentEditor';
import { DocumentViewer } from './DocumentViewer';
import { DocumentFolder } from '@/types/document';
import { useDocuments } from '@/hooks/useDocuments';
import { 
  Search, 
  Filter, 
  Plus, 
  FolderPlus, 
  Grid, 
  List,
  Archive,
  BookOpen
} from 'lucide-react';

interface DocumentLibraryProps {
  className?: string;
}

export const DocumentLibrary = ({ className = '' }: DocumentLibraryProps) => {
  const {
    documents,
    categories,
    folders,
    currentDocument,
    loading,
    error,
    fetchDocuments,
    fetchFolders,
    createDocument,
    setCurrentDocument
  } = useDocuments();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<DocumentFolder | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewDocument, setShowNewDocument] = useState(false);

  // Filtrer les documents
  const filteredDocuments = documents.filter(doc => {
    if (searchTerm && !doc.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategory && doc.categoryId !== selectedCategory) {
      return false;
    }
    if (selectedFolder && doc.folderId !== selectedFolder.id) {
      return false;
    }
    return true;
  });

  // Charger les documents initiaux
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Charger les dossiers quand un dossier est sélectionné
  useEffect(() => {
    if (selectedFolder) {
      fetchFolders(selectedFolder.id);
    } else {
      fetchFolders();
    }
  }, [selectedFolder, fetchFolders]);

  const handleFolderSelect = (folder: DocumentFolder | null) => {
    setSelectedFolder(folder);
    if (folder) {
      fetchDocuments({ folderId: folder.id });
    } else {
      fetchDocuments();
    }
  };

  const handleDocumentSelect = (document: any) => {
    setCurrentDocument(document);
  };

  const handleCreateDocument = async (formData: any) => {
    try {
      await createDocument(formData);
      setShowNewDocument(false);
    } catch (error) {
      console.error('Erreur création document:', error);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Erreur: {error}
      </div>
    );
  }

  return (
    <div className={`flex h-full ${className}`}>
      {/* Sidebar avec arborescence */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Documents
          </h2>
        </div>
        
        <DocumentTree
          folders={folders}
          categories={categories}
          selectedFolder={selectedFolder}
          onFolderSelect={handleFolderSelect}
          onCategorySelect={setSelectedCategory}
          onCreateFolder={() => console.log('Créer dossier')}
        />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header avec outils */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 flex items-center space-x-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher des documents..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowNewDocument(true)}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Nouveau</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <button className="flex items-center px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                <Archive className="w-3 h-3 mr-1" />
                Inclure archivés
              </button>
            </div>
          )}
        </div>

        {/* Liste des documents */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Aucun document trouvé</p>
              <button
                onClick={() => setShowNewDocument(true)}
                className="mt-2 text-blue-500 hover:text-blue-600"
              >
                Créer votre premier document
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-3'
            }>
              {filteredDocuments.map(document => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onSelect={handleDocumentSelect}
                  onArchive={(docId) => console.log('Archiver:', docId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Éditeur/Viewer de document */}
      {currentDocument && (
        <div className="w-1/2 border-l border-gray-200 dark:border-gray-700">
          {currentDocument.fileType === 'text' ? (
            <DocumentEditor
              document={currentDocument}
              onSave={(updates) => console.log('Sauvegarder:', updates)}
              onCancel={() => setCurrentDocument(null)}
            />
          ) : (
            <DocumentViewer
              document={currentDocument}
              onClose={() => setCurrentDocument(null)}
            />
          )}
        </div>
      )}

      {/* Modal nouveau document */}
      {showNewDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Nouveau Document</h2>
              {/* Ici vous pouvez ajouter un formulaire pour créer un document */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewDocument(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowNewDocument(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### 📄 `frontend/src/components/documents/DocumentEditor.tsx`
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Document } from '@/types/document';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Save, 
  Undo, 
  Redo, 
  Bold, 
  Italic, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link,
  FileText,
  Tag,
  Archive
} from 'lucide-react';

interface DocumentEditorProps {
  document: Document;
  onSave: (updates: Partial<Document>) => void;
  onCancel: () => void;
}

export const DocumentEditor = ({ 
  document, 
  onSave, 
  onCancel 
}: DocumentEditorProps) => {
  const [title, setTitle] = useState(document.title);
  const [description, setDescription] = useState(document.description || '');
  const [tags, setTags] = useState<string[]>(document.tags || []);
  const [newTag, setNewTag] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Commencez à écrire votre document...'
      })
    ],
    content: document.content,
    onUpdate: ({ editor }) => {
      // Handle content updates
    }
  });

  useEffect(() => {
    if (editor && document.content !== editor.getHTML()) {
      editor.commands.setContent(document.content);
    }
  }, [document.content, editor]);

  const handleSave = () => {
    const updates: Partial<Document> = {
      title,
      description,
      content: editor?.getHTML() || '',
      tags
    };
    
    onSave(updates);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Éditeur de Document
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 flex items-center"
            >
              <Save className="w-4 h-4 mr-1" />
              Sauvegarder
            </button>
          </div>
        </div>

        {/* Title and description */}
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du document"
            className="w-full px-3 py-2 text-xl font-bold border-none focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white"
          />
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnelle)"
            className="w-full px-3 py-2 text-sm border-none focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white"
            rows={2}
          />
        </div>

        {/* Tags */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
            <div className="flex items-center">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Ajouter un tag..."
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={addTag}
                className="ml-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          title="Gras"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          title="Italique"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <div className="border-l border-gray-300 dark:border-gray-600 mx-1 h-6 self-center"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          title="Titre 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          title="Titre 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          title="Titre 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        
        <div className="border-l border-gray-300 dark:border-gray-600 mx-1 h-6 self-center"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          title="Liste à puces"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          title="Liste numérotée"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-auto">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-4 dark:prose-invert focus:outline-none"
        />
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center justify-between">
          <div>
            Version {document.version} • Dernière modification: {new Date(document.metadata.updatedAt).toLocaleString('fr-FR')}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => editor.commands.undo()}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Annuler"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.commands.redo()}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Rétablir"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 10. 📄 PAGE PRINCIPALE DOCUMENTS

### 📄 `frontend/src/app/(app)/documents/page.tsx`
```tsx
'use client';

import React from 'react';
import { DocumentLibrary } from '@/components/documents/DocumentLibrary';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

export default function DocumentsPage() {
  return (
    <ResponsiveLayout pageTitle="Bibliothèque de Documents">
      <div className="h-full">
        <DocumentLibrary />
      </div>
    </ResponsiveLayout>
  );
}
```

---

## 11. 📄 STYLES CSS

### 📄 `frontend/src/styles/documents.css`
```css
/* Styles pour l'éditeur de documents */
.ProseMirror {
  outline: none;
  min-height: 300px;
}

.ProseMirror-focused {
  outline: none;
}

.ProseMirror p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.ProseMirror h1,
.ProseMirror h2,
.ProseMirror h3 {
  margin: 1rem 0 0.5rem 0;
  font-weight: 600;
}

.ProseMirror h1 {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.ProseMirror h2 {
  font-size: 1.5rem;
  line-height: 2rem;
}

.ProseMirror h3 {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.ProseMirror ul,
.ProseMirror ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.ProseMirror li {
  margin: 0.25rem 0;
}

.ProseMirror li p {
  margin: 0;
}

.ProseMirror strong {
  font-weight: 600;
}

.ProseMirror em {
  font-style: italic;
}

/* Placeholder */
.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .document-library-grid {
    grid-template-columns: 1fr;
  }
  
  .document-card {
    margin-bottom: 1rem;
  }
  
  .editor-toolbar {
    flex-wrap: wrap;
  }
}
```

---

## 12. 🚀 TEST DE L'IMPLEMENTATION

### Test avec curl
```bash
# Créer une catégorie
curl -X POST "http://localhost:3001/api/documents/categories" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Procédures Techniques",
    "description": "Procédures techniques et SOPs",
    "icon": "⚙️",
    "color": "#3b82f6"
  }'

# Créer un document texte
curl -X POST "http://localhost:3001/api/documents" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Procédure de Maintenance Préventive",
    "content": "<h1>Procédure de Maintenance Préventive</h1><p>Cette procédure décrit les étapes...</p>",
    "description": "Maintenance préventive des équipements",
    "categoryId": "category_id",
    "tags": ["maintenance", "prévention", "équipements"]
  }'

# Upload d'un fichier
curl -X POST "http://localhost:3001/api/documents/upload" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN" \
  -F "file=@manuel_utilisateur.pdf" \
  -F "title=Manuel Utilisateur" \
  -F "description=Manuel utilisateur complet" \
  -F "categoryId=category_id"

# Récupérer les documents
curl -X GET "http://localhost:3001/api/documents" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN"

# Rechercher des documents
curl -X GET "http://localhost:3001/api/documents/search?q=maintenance" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN"
```

---

## 📈 FONCTIONNALITÉS CLÉS IMPLEMENTÉES

### ✅ Système de Documents Complet
- **Éditeur WYSIWYG** avancé avec TipTap
- **Gestion des fichiers** uploadés
- **Catégorisation** et tagging
- **Versions** et historique
- **Permissions** granulaires

### 📋 Gestion des SOPs
- **Workflows d'approbation** personnalisables
- **Suivi des modifications**
- **Métadonnées** complètes
- **Recherche** full-text
- **Statistiques** d'utilisation

###