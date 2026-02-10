'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    FileSpreadsheet,
    FileText,
    FileWarning, // Changed from FileCsv since lucide-react might not have FileCsv in older versions, checking context... wait, FileCsv exists in newer Lucide. Let's assume FileText or similar if not found. But prompted called for FileCsv. I'll stick to FileText or generic File if I'm unsure, but the prompt used FileCsv. I'll try FileSpreadsheet for CSV too or FileText. Actually, let's use FileText for now to be safe or check imports.
    Calendar,
    Filter,
    Download,
    Loader2
} from 'lucide-react';
import { useExport } from '@/hooks/useExport';
import { toast } from 'react-hot-toast';

// Adding FileCsv manually if needed or just use FileText
const FileCsv = FileText;

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'complaints' | 'planning' | 'dashboard';
    params?: Record<string, any>;
}

export const ExportModal = ({ isOpen, onClose, type, params }: ExportModalProps) => {
    const { exportComplaints, exportPlanning, exportDashboard, loading } = useExport();
    const [format, setFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');
    const [filters, setFilters] = useState<Record<string, any>>({});

    const handleExport = async () => {
        try {
            let result;

            const exportParams = { ...params, ...filters };

            switch (type) {
                case 'complaints':
                    result = await exportComplaints(exportParams);
                    break;
                case 'planning':
                    result = await exportPlanning(exportParams);
                    break;
                case 'dashboard':
                    result = await exportDashboard(format);
                    break;
                default:
                    throw new Error('Type d\'export non supporté');
            }

            toast.success(`Export réussi: ${result.filename}`);
            onClose();
        } catch (error: any) {
            toast.error(`Erreur: ${error.message}`);
        }
    };

    const getModalTitle = () => {
        switch (type) {
            case 'complaints': return 'Exporter les Réclamations';
            case 'planning': return 'Exporter le Planning';
            case 'dashboard': return 'Exporter les Statistiques';
            default: return 'Exporter';
        }
    };

    const renderFilters = () => {
        if (type === 'dashboard') {
            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Période
                        </label>
                        <select
                            className="w-full p-2 border rounded"
                            value={filters.period || '7d'}
                            onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
                        >
                            <option value="7d">7 derniers jours</option>
                            <option value="30d">30 derniers jours</option>
                            <option value="90d">90 derniers jours</option>
                        </select>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Date de début
                    </label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={filters.startDate || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Date de fin
                    </label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={filters.endDate || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                </div>

                {type === 'complaints' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Statut
                            </label>
                            <select
                                className="w-full p-2 border rounded"
                                value={filters.status || ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="assigned">Assignée</option>
                                <option value="in_progress">En cours</option>
                                <option value="resolved">Résolue</option>
                                <option value="closed">Fermée</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Priorité
                            </label>
                            <select
                                className="w-full p-2 border rounded"
                                value={filters.priority || ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                            >
                                <option value="">Toutes les priorités</option>
                                <option value="low">Basse</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                                <option value="urgent">Urgente</option>
                            </select>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        {getModalTitle()}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {renderFilters()}

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Format d'export
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setFormat('excel')}
                                className={`p-3 rounded-lg border-2 flex flex-col items-center ${format === 'excel'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <FileSpreadsheet className="h-6 w-6 mb-1" />
                                <span className="text-xs">Excel</span>
                            </button>

                            <button
                                onClick={() => setFormat('pdf')}
                                className={`p-3 rounded-lg border-2 flex flex-col items-center ${format === 'pdf'
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <FileText className="h-6 w-6 mb-1" />
                                <span className="text-xs">PDF</span>
                            </button>

                            <button
                                onClick={() => setFormat('csv')}
                                className={`p-3 rounded-lg border-2 flex flex-col items-center ${format === 'csv'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <FileCsv className="h-6 w-6 mb-1" />
                                <span className="text-xs">CSV</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleExport}
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Export en cours...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4 mr-2" />
                                    Exporter
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
