'use client';

import React from 'react';
import {
    AlertTriangle,
    Info,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    Check
} from 'lucide-react';
import { Alert } from '@/types/alerts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AlertItemProps {
    alert: Alert;
    onAcknowledge: (id: string) => void;
    onResolve: (id: string) => void;
    onExecuteAction: (id: string, actionIndex: number) => void;
}

export const AlertItem = ({
    alert,
    onAcknowledge,
    onResolve,
    onExecuteAction
}: AlertItemProps) => {
    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'high': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
            case 'medium': return <Info className="h-5 w-5 text-yellow-500" />;
            case 'low': return <Info className="h-5 w-5 text-blue-500" />;
            default: return <Info className="h-5 w-5 text-gray-500" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
            case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'low': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
            default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: fr });
    };

    return (
        <div className={`p-4 border-l-4 rounded-r-lg mb-3 ${getSeverityColor(alert.severity)} ${alert.acknowledged ? 'opacity-75' : ''}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {alert.title}
                            </h3>
                            {alert.acknowledged && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Acquittée
                                </span>
                            )}
                            {alert.resolved && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Résolue
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {alert.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(alert.triggeredAt)}
                        </p>

                        {alert.data && (
                            <details className="mt-2">
                                <summary className="text-xs text-gray-500 cursor-pointer">
                                    Détails supplémentaires
                                </summary>
                                <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-700 dark:text-gray-300 overflow-auto max-h-32">
                                    {JSON.stringify(alert.data, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    {!alert.acknowledged && (
                        <button
                            onClick={() => onAcknowledge(alert.id)}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            title="Acquitter"
                        >
                            <Check className="h-4 w-4" />
                        </button>
                    )}
                    {!alert.resolved && (
                        <button
                            onClick={() => onResolve(alert.id)}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            title="Marquer comme résolue"
                        >
                            <CheckCircle className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {alert.actions && alert.actions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {alert.actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => onExecuteAction(alert.id, index)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                        >
                            <Eye className="h-3 w-3 mr-1" />
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
