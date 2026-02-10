import { useState } from 'react';
import { ExportUtils } from '@/lib/exportUtils';

export const useExport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const exportComplaints = async (params: any = {}) => {
        try {
            setLoading(true);
            setError(null);
            const result = await ExportUtils.exportComplaints(params);
            return result;
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'export');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const exportPlanning = async (params: any = {}) => {
        try {
            setLoading(true);
            setError(null);
            const result = await ExportUtils.exportPlanning(params);
            return result;
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'export');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const exportDashboard = async (format: 'excel' | 'pdf' | 'csv' = 'excel', period?: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await ExportUtils.exportDashboard(format, period);
            return result;
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'export');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        exportComplaints,
        exportPlanning,
        exportDashboard,
        loading,
        error
    };
};
