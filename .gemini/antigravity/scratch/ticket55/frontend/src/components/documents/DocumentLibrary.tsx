'use client';

import React, { useState, useEffect } from 'react';
import { DocumentCard } from './DocumentCard';
import { DocumentTree } from './DocumentTree';
import { DocumentEditor } from './DocumentEditor';
import { DocumentViewer } from './DocumentViewer';
import { DocumentFolder, Document as IDocument } from '@/types/document';
import { useDocuments } from '@/hooks/useDocuments';
import {
    Search,
    Filter,
    Plus,
    Grid,
    List,
    Archive,
    BookOpen,
    FileText
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
    const [newDocData, setNewDocData] = useState<{ title: string; categoryId: string }>({ title: '', categoryId: '' });

    // Filtrer les documents
    const filteredDocuments = documents.filter(doc => {
        if (searchTerm && !doc.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        if (selectedCategory && doc.categoryId !== selectedCategory) {
            return false;
        }
        if (selectedFolder && doc.folderId !== selectedFolder.id) {
            // Only filter by folder if selected. Root display handled by API or logic below.
            // Actually if selectedFolder is null, we usually show root docs or all docs.
            // Let's rely on API fetching for folders, but client side filter for search/category
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
            fetchFolders(selectedFolder.id); // Fetch subfolders
            fetchDocuments({ folderId: selectedFolder.id }); // Fetch docs in folder
        } else {
            fetchFolders(); // Fetch root folders
            fetchDocuments({ folderId: 'root' }); // Fetch root docs
        }
    }, [selectedFolder, fetchFolders, fetchDocuments]);

    const handleFolderSelect = (folder: DocumentFolder | null) => {
        setSelectedFolder(folder);
    };

    const handleDocumentSelect = (document: IDocument) => {
        setCurrentDocument(document);
    };

    const handleCreateDocument = async () => {
        if (!newDocData.title || !newDocData.categoryId) return;

        try {
            await createDocument({
                ...newDocData,
                content: '',
                folderId: selectedFolder?.id
            });
            setShowNewDocument(false);
            setNewDocData({ title: '', categoryId: '' });
        } catch (error) {
            console.error('Erreur création document:', error);
        }
    };

    if (error) {
        return (
            <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg">
                Erreur: {error}
            </div>
        );
    }

    return (
        <div className={`flex h-full ${className}`}>
            {/* Sidebar avec arborescence */}
            <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold flex items-center text-slate-800 dark:text-white">
                        <BookOpen className="w-5 h-5 mr-2 text-primary" />
                        Documents
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <DocumentTree
                        folders={folders}
                        categories={categories}
                        selectedFolder={selectedFolder}
                        onFolderSelect={handleFolderSelect}
                        onCategorySelect={setSelectedCategory}
                        onCreateFolder={() => console.log('Créer dossier')}
                    />
                </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
                {/* Header avec outils */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
                                className={`p-2 rounded-lg border ${showFilters ? 'bg-blue-50 border-blue-200' : 'border-gray-300 dark:border-gray-600'} hover:bg-gray-50 dark:hover:bg-gray-700`}
                            >
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
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
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                <span className="font-medium">Nouveau</span>
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mt-3 flex flex-wrap gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <button className="flex items-center px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Archive className="w-3 h-3 mr-1" />
                                Inclure archivés
                            </button>
                        </div>
                    )}
                </div>

                {/* Liste des documents */}
                <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    {loading && !documents.length ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                            <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-10 h-10 opacity-40" />
                            </div>
                            <h3 className="text-lg font-medium mb-1">Aucun document</h3>
                            <p className="mb-4">Ce dossier est vide.</p>
                            <button
                                onClick={() => setShowNewDocument(true)}
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Créer un nouveau document
                            </button>
                        </div>
                    ) : (
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                                : 'space-y-2'
                        }>
                            {documents.map((document) => (
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
                <div className="w-[600px] border-l border-gray-200 dark:border-gray-700 shadow-xl bg-white z-20">
                    {currentDocument.fileType === 'text' ? (
                        <DocumentEditor
                            document={currentDocument}
                            onSave={(updates) => {
                                // Call update from hook
                                // updateDocument(currentDocument.id, updates); 
                                // For now just log
                                console.log('Update', updates);
                            }}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Nouveau Document</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                        placeholder="Ex: Procédure de sécurité"
                                        value={newDocData.title}
                                        onChange={e => setNewDocData({ ...newDocData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                        value={newDocData.categoryId}
                                        onChange={e => setNewDocData({ ...newDocData, categoryId: e.target.value })}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowNewDocument(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleCreateDocument}
                                    disabled={!newDocData.title || !newDocData.categoryId}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
