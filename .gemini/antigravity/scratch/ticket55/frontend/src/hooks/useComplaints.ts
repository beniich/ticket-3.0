import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import socketService from '@/lib/socket';

export type ComplaintStatus = 'nouvelle' | 'en cours' | 'résolue' | 'fermée';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Complaint {
    _id: string;
    number: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    leakType: string;
    description?: string;
    priority?: ComplaintPriority;
    category?: string;
    status: ComplaintStatus;
    assignedTo?: string;
    location?: {
        address?: string;
        lat?: number;
        lng?: number;
    };
    resolvedAt?: Date;
    closedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateComplaintData {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    leakType: string;
    description?: string;
    priority?: ComplaintPriority;
    category?: string;
    location?: {
        address?: string;
        lat?: number;
        lng?: number;
    };
}

/**
 * Hook principal pour gérer la liste des réclamations
 */
export const useComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all complaints
    const fetchComplaints = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/complaints');
            setComplaints(response.data);
        } catch (err: any) {
            console.error('Error fetching complaints:', err);
            setError(err.response?.data?.message || 'Erreur lors du chargement des réclamations');
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new complaint
    const createComplaint = useCallback(async (data: CreateComplaintData) => {
        try {
            const response = await api.post('/complaints', data);
            setComplaints(prev => [response.data, ...prev]);
            return { success: true, data: response.data };
        } catch (err: any) {
            console.error('Error creating complaint:', err);
            return {
                success: false,
                error: err.response?.data?.message || 'Erreur lors de la création de la réclamation'
            };
        }
    }, []);

    // Update complaint status
    const updateComplaintStatus = useCallback(async (id: string, status: ComplaintStatus) => {
        try {
            const response = await api.patch(`/complaints/${id}`, { status });
            setComplaints(prev =>
                prev.map(c => c._id === id ? response.data : c)
            );
            return { success: true, data: response.data };
        } catch (err: any) {
            console.error('Error updating complaint:', err);
            return {
                success: false,
                error: err.response?.data?.message || 'Erreur lors de la mise à jour'
            };
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    // Real-time updates via WebSocket
    useEffect(() => {
        const socket = socketService.connect();

        const handleNewComplaint = (complaint: Complaint) => {
            setComplaints(prev => [complaint, ...prev]);
        };

        const handleComplaintUpdate = (updatedComplaint: Complaint) => {
            setComplaints(prev =>
                prev.map(c => c._id === updatedComplaint._id ? updatedComplaint : c)
            );
        };

        socketService.on('new-complaint', handleNewComplaint);
        socketService.on('complaint-updated', handleComplaintUpdate);

        return () => {
            socketService.off('new-complaint', handleNewComplaint);
            socketService.off('complaint-updated', handleComplaintUpdate);
        };
    }, []);

    return {
        complaints,
        loading,
        error,
        fetchComplaints,
        createComplaint,
        updateComplaintStatus
    };
};

/**
 * Hook pour une réclamation individuelle
 */
export const useComplaint = (id: string) => {
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchComplaint = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/complaints/${id}`);
            setComplaint(response.data);
        } catch (err: any) {
            console.error('Error fetching complaint:', err);
            setError(err.response?.data?.message || 'Réclamation introuvable');
        } finally {
            setLoading(false);
        }
    }, [id]);

    const assignTeam = useCallback(async (teamId: string) => {
        try {
            const response = await api.post('/assignments', {
                complaintId: id,
                teamId
            });
            // Assignment creation triggers a complaint update via socket
            // but we can also manually refetch or update state
            return { success: true, data: response.data };
        } catch (err: any) {
            console.error('Error assigning team:', err);
            return {
                success: false,
                error: err.response?.data?.message || 'Erreur lors de l\'assignation'
            };
        }
    }, [id]);

    const updateComplaint = useCallback(async (updates: Partial<Complaint>) => {
        try {
            const response = await api.patch(`/complaints/${id}`, updates);
            setComplaint(response.data);
            return { success: true, data: response.data };
        } catch (err: any) {
            console.error('Error updating complaint:', err);
            return {
                success: false,
                error: err.response?.data?.message || 'Erreur mise à jour'
            };
        }
    }, [id]);

    useEffect(() => {
        fetchComplaint();
    }, [fetchComplaint]);

    return {
        complaint,
        loading,
        error,
        updateComplaint,
        assignTeam,
        refetch: fetchComplaint
    };
};
