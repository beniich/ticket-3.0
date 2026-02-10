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
    content: { type: String, default: '' }, // Changed required: true to default: '' to handle file-only docs or empty initiates
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
DocumentSchema.index({ 'author.id': 1, createdAt: -1 });

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);
export const DocumentCategory = mongoose.model<IDocumentCategory>('DocumentCategory', DocumentCategorySchema);
export const DocumentFolder = mongoose.model<IDocumentFolder>('DocumentFolder', DocumentFolderSchema);
