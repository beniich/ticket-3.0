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
                if (formData.folderId) {
                    uploadData.append('folderId', formData.folderId);
                }

                response = await api.post('/documents/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Document texte
                response = await api.post('/documents', formData);
            }

            // Rafraîchir la liste
            await fetchDocuments();
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
        fetchFolders(); // Fetch root folders
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
