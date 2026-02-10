import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import socketService from '@/lib/socket';

export interface TeamMember {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phone: string;
}

export interface Team {
    _id: string;
    name: string;
    status: 'disponible' | 'intervention' | 'repos';
    location?: {
        lat: number;
        lng: number;
    };
    members: any[]; // User objects
}

export const useTeams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTeams = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/teams');
            setTeams(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la récupération des équipes');
        } finally {
            setLoading(false);
        }
    }, []);

    const createTeam = async (data: any) => {
        try {
            const response = await api.post('/teams', data);
            return { success: true, data: response.data };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || 'Erreur lors de la création' };
        }
    };

    const updateTeamStatus = async (id: string, status: string) => {
        try {
            const response = await api.patch(`/teams/${id}`, { status });
            return { success: true, data: response.data };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || 'Erreur lors de la mise à jour' };
        }
    };

    useEffect(() => {
        fetchTeams();

        const socket = socketService.connect();

        const handleNewTeam = (newTeam: Team) => {
            setTeams(prev => [...prev, newTeam]);
        };

        const handleTeamUpdate = (updatedTeam: Team) => {
            setTeams(prev => prev.map(item =>
                item._id === updatedTeam._id ? updatedTeam : item
            ));
        };

        socketService.on('new-team', handleNewTeam);
        socketService.on('team-updated', handleTeamUpdate);

        return () => {
            socketService.off('new-team', handleNewTeam);
            socketService.off('team-updated', handleTeamUpdate);
        };
    }, [fetchTeams]);

    return {
        teams,
        loading,
        error,
        fetchTeams,
        createTeam,
        updateTeamStatus
    };
};
