import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export interface PlanningSlot {
    _id: string;
    teamId: string;
    teamName: string;
    start: string;
    end: string;
    complaintNumber?: string;
}

export const usePlanning = () => {
    const [slots, setSlots] = useState<PlanningSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSlots = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/planning/slots');
            setSlots(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la récupération du planning');
        } finally {
            setLoading(false);
        }
    }, []);

    const createSlot = async (data: Omit<PlanningSlot, '_id' | 'teamName'>) => {
        try {
            const response = await api.post('/planning/slots', data);
            await fetchSlots(); // Refetch to get populated names
            return { success: true, data: response.data };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || 'Erreur création créneau' };
        }
    };

    const deleteSlot = async (id: string) => {
        try {
            await api.delete(`/planning/slots/${id}`);
            setSlots(prev => prev.filter(s => s._id !== id));
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || 'Erreur suppression créneau' };
        }
    };

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    return {
        slots,
        loading,
        error,
        fetchSlots,
        createSlot,
        deleteSlot
    };
};
