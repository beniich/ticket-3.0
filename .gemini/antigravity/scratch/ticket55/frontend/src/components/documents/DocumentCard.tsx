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
        switch (document.fileType) {
            case 'folder': return <Folder className="w-8 h-8" />;
            case 'file':
                if (document.mimeType?.includes('image')) return <File className="w-8 h-8 text-purple-500" />;
                if (document.mimeType?.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
                return <File className="w-8 h-8 text-gray-500" />;
            default: return <FileText className="w-8 h-8 text-blue-500" />;
        }
    };

    const getStatusColor = () => {
        switch (document.status) {
            case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
            case 'review': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'archived': return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
            default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
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
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                        {getFileIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate" title={document.title}>
                            {document.title}
                        </h3>
                        {document.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[200px]">
                                {document.description}
                            </p>
                        )}
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <User className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-[100px]">{document.author.name}</span>
                            <Clock className="w-3 h-3 ml-3 mr-1" />
                            <span>{formatDate(document.metadata.updatedAt)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                        {document.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {document.status === 'review' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {document.status}
                    </div>

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
                    {document.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                        >
                            #{tag}
                        </span>
                    ))}
                    {document.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{document.tags.length - 3}</span>
                    )}
                </div>
            )}

            {document.fileType === 'file' && document.fileSize && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2">
                    {Math.round(document.fileSize / 1024)} KB
                </div>
            )}
        </div>
    );
};
