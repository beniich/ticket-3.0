'use client';

import React from 'react';
import { DocumentFolder, DocumentCategory } from '@/types/document';
import {
    Folder as FolderIcon,
    FolderPlus,
    ChevronRight,
    ChevronDown,
    File,
    Hash
} from 'lucide-react';

interface DocumentTreeProps {
    folders: DocumentFolder[];
    categories: DocumentCategory[];
    selectedFolder: DocumentFolder | null;
    onFolderSelect: (folder: DocumentFolder | null) => void;
    onCategorySelect: (categoryId: string) => void;
    onCreateFolder?: () => void;
}

export const DocumentTree = ({
    folders,
    categories,
    selectedFolder,
    onFolderSelect,
    onCategorySelect,
    onCreateFolder
}: DocumentTreeProps) => {
    return (
        <div className="space-y-4">
            {/* Dossiers */}
            <div>
                <div className="flex items-center justify-between px-3 mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Dossiers
                    </h3>
                    <button
                        onClick={onCreateFolder}
                        className="text-gray-400 hover:text-blue-500"
                        title="Nouveau dossier"
                    >
                        <FolderPlus className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-1">
                    <div
                        onClick={() => onFolderSelect(null)}
                        className={`flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer ${selectedFolder === null
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        <FolderIcon className="w-4 h-4 mr-2" />
                        Tous les documents
                    </div>

                    {folders.map(folder => (
                        <div
                            key={folder.id}
                            onClick={() => onFolderSelect(folder)}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer ${selectedFolder?.id === folder.id
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                        >
                            <FolderIcon className="w-4 h-4 mr-2" />
                            {folder.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Catégories */}
            <div>
                <div className="px-3 mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Catégories
                    </h3>
                </div>

                <div className="space-y-1">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            onClick={() => onCategorySelect(category.id)}
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                        >
                            <span className="mr-2" style={{ color: category.color }}>
                                {category.icon || <Hash className="w-4 h-4" />}
                            </span>
                            {category.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
