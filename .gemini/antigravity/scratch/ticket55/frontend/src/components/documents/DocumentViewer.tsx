'use client';

import React, { useState } from 'react';
import { Document } from '@/types/document';
import { X, ExternalLink, Download, FileText, CheckSquare, History } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ApprovalWorkflow } from './ApprovalWorkflow';
import { VersionHistory } from './VersionHistory';

interface DocumentViewerProps {
    document: Document;
    onClose: () => void;
}

export const DocumentViewer = ({ document, onClose }: DocumentViewerProps) => {
    const [activeTab, setActiveTab] = useState<'content' | 'approval' | 'history'>('content');

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold truncate flex-1 pr-4" title={document.title}>
                    {document.title}
                </h2>
                <div className="flex items-center space-x-2">
                    {document.fileUrl && (
                        <a
                            href={document.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Ouvrir le fichier"
                        >
                            <Download className="w-5 h-5" />
                        </a>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center border-b-2 transition-colors ${activeTab === 'content' ? 'border-primary text-primary bg-white dark:bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <FileText className="w-4 h-4 mr-2" /> Contenu
                </button>
                <button
                    onClick={() => setActiveTab('approval')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center border-b-2 transition-colors ${activeTab === 'approval' ? 'border-primary text-primary bg-white dark:bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <CheckSquare className="w-4 h-4 mr-2" /> Approbation
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center border-b-2 transition-colors ${activeTab === 'history' ? 'border-primary text-primary bg-white dark:bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <History className="w-4 h-4 mr-2" /> Historique
                </button>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
                {activeTab === 'content' && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 min-h-full">
                        {document.fileType === 'file' && document.fileUrl ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
                                <p className="mb-4">Ce document est un fichier.</p>
                                <div className="mb-4">
                                    {document.mimeType?.includes('image') ? (
                                        <img src={document.fileUrl} alt={document.title} className="max-w-full h-auto rounded shadow" />
                                    ) : (
                                        <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                            <ExternalLink className="w-12 h-12 mb-2 mx-auto" />
                                            <p>{document.title}</p>
                                        </div>
                                    )}
                                </div>
                                <a
                                    href={document.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Télécharger / Ouvrir
                                </a>
                            </div>
                        ) : (
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <h1 className="text-2xl font-bold mb-4">{document.title}</h1>
                                <div dangerouslySetInnerHTML={{ __html: document.content }} />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'approval' && (
                    <div className="max-w-2xl mx-auto">
                        <ApprovalWorkflow document={document} />
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="max-w-2xl mx-auto">
                        <VersionHistory document={document} />
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 bg-white dark:bg-gray-800">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="font-semibold block">Créé le</span>
                        {format(new Date(document.metadata.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </div>
                    <div>
                        <span className="font-semibold block">Auteur</span>
                        {document.author.name}
                    </div>
                </div>
            </div>
        </div>
    );
};
