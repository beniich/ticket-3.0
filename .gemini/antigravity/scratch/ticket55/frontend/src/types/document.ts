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
