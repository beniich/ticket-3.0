'use client';

import React from 'react';
import { Document } from '@/types/document';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { History, User as UserIcon } from 'lucide-react';

interface VersionHistoryProps {
    document: Document;
}

export const VersionHistory = ({ document }: VersionHistoryProps) => {
    if (!document.history || document.history.length === 0) {
        return (
            <div className="text-gray-500 text-sm p-4">
                Aucun historique disponible.
            </div>
        );
    }

    // Sort history by version descending
    const sortedHistory = [...document.history].sort((a, b) => b.version - a.version);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <History className="w-5 h-5 mr-2 text-gray-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Historique des versions</h3>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedHistory.map((version) => (
                    <div key={version.version} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm text-gray-900 dark:text-white">
                                Version {version.version}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(version.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                            </span>
                        </div>

                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <UserIcon className="w-3 h-3 mr-1" />
                            <span>{version.author.name}</span>
                        </div>

                        {version.changes && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs italic">
                                "{version.changes}"
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
