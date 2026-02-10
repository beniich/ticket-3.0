import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import socketService from '@/lib/socket';

export type InterventionStatus = 'En attente' | 'En cours' | 'Validation' | 'Terminé';
export type InterventionPriority = 'Basse' | 'Moyenne' | 'Haute' | 'Critique';

export interface Intervention {
    _id: string;
    complaintId: any;
    teamId?: any;
    title: string;
    description: string;
    status: InterventionStatus;
    priority: InterventionPriority;
    location: string;
    startTime?: string;
    endTime?: string;
    checklist: Array<{ task: string; completed: boolean }>;
    createdAt: string;
    updatedAt: string;
}

export const useInterventions = () => {
    const [interventions, setInterventions] = useState<Intervention[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInterventions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/interventions');
            setInterventions(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la récupération des interventions');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateIntervention = async (id: string, data: Partial<Intervention>) => {
        try {
            const response = await api.patch(`/interventions/${id}`, data);
            return { success: true, data: response.data };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || 'Erreur lors de la mise à jour' };
        }
    };

    const createIntervention = async (data: any) => {
        try {
            const response = await api.post('/interventions', data);
            return { success: true, data: response.data };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || 'Erreur lors de la création' };
        }
    };

    useEffect(() => {
        fetchInterventions();

        const socket = socketService.connect();

        const handleNewIntervention = (newIntervention: Intervention) => {
            setInterventions(prev => [newIntervention, ...prev]);
        };

        const handleInterventionUpdate = (updatedIntervention: Intervention) => {
            setInterventions(prev => prev.map(item =>
                item._id === updatedIntervention._id ? updatedIntervention : item
            ));
        };

        const handleInterventionDeleted = (id: string) => {
            setInterventions(prev => prev.filter(item => item._id !== id));
        };

        socketService.on('new-intervention', handleNewIntervention);
        socketService.on('intervention-updated', handleInterventionUpdate);
        socketService.on('intervention-deleted', handleInterventionDeleted);

        return () => {
            socketService.off('new-intervention', handleNewIntervention);
            socketService.off('intervention-updated', handleInterventionUpdate);
            socketService.off('intervention-deleted', handleInterventionDeleted);
        };
    }, [fetchInterventions]);

    return {
        interventions,
        loading,
        error,
        fetchInterventions,
        updateIntervention,
        createIntervention
    };
};
