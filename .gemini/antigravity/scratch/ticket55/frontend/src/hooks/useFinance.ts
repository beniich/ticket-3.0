import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export interface FinancialRecord {
    _id: string;
    id: string;
    complaintId?: string;
    interventionId?: string;
    type: 'expense' | 'revenue';
    category: 'parts' | 'labor' | 'equipment' | 'fuel' | 'other';
    amount: number;
    currency: string;
    description: string;
    date: string;
    status: 'pending' | 'approved' | 'paid' | 'cancelled';
}

export const useFinance = () => {
    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async (filters?: any) => {
        try {
            setLoading(true);
            const response = await api.get('/finance', { params: filters });
            setRecords(response.data.map((r: any) => ({ ...r, id: r._id })));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur chargement finances');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const response = await api.get('/finance/stats');
            setStats(response.data);
        } catch (err: any) {
            console.error('Erreur stats finances:', err);
        }
    }, []);

    const createRecord = async (data: any) => {
        try {
            const response = await api.post('/finance', data);
            const newRecord = { ...response.data, id: response.data._id };
            setRecords(prev => [newRecord, ...prev]);
            fetchStats();
            return newRecord;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Erreur création enregistrement');
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const response = await api.patch(`/finance/${id}/status`, { status });
            setRecords(prev => prev.map(r => r.id === id ? { ...response.data, id: response.data._id } : r));
            fetchStats();
            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Erreur mise à jour statut');
        }
    };

    useEffect(() => {
        fetchRecords();
        fetchStats();
    }, [fetchRecords, fetchStats]);

    return {
        records,
        stats,
        loading,
        error,
        fetchRecords,
        createRecord,
        updateStatus
    };
};
