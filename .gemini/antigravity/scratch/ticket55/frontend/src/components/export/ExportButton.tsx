'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Download,
    FileSpreadsheet,
    FileText,
    Loader2
} from 'lucide-react';
import { ExportModal } from './ExportModal';

interface ExportButtonProps {
    type: 'complaints' | 'planning' | 'dashboard';
    params?: Record<string, any>;
    className?: string;
}

export const ExportButton = ({ type, params = {}, className }: ExportButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getButtonText = () => {
        switch (type) {
            case 'complaints': return 'Exporter Réclamations';
            case 'planning': return 'Exporter Planning';
            case 'dashboard': return 'Exporter Statistiques';
            default: return 'Exporter';
        }
    };

    const getButtonIcon = () => {
        if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;

        switch (type) {
            case 'complaints': return <FileSpreadsheet className="h-4 w-4" />;
            case 'planning': return <FileText className="h-4 w-4" />;
            case 'dashboard': return <FileText className="h-4 w-4" />; // Replaced FileCsv with FileText
            default: return <Download className="h-4 w-4" />;
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className={className}
                disabled={isLoading}
            >
                {getButtonIcon()}
                <span className="ml-2">{getButtonText()}</span>
            </Button>

            <ExportModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                type={type}
                params={params}
            />
        </>
    );
};
