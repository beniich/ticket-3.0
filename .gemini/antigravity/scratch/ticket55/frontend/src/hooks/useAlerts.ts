import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import socketService from '@/lib/socket';
import { Alert } from '@/types/alerts';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertType = 'urgent_complaints' | 'high_priority' | 'slow_response' | 'low_confidence' | 'ai_recommendation' | 'custom';

export const useAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAlerts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/alerts');
            const data = response.data.alerts || response.data;
            const normalized = Array.isArray(data) ? data.map((a: any) => ({ ...a, id: a._id })) : [];
            setAlerts(normalized);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur lors de la récupération des alertes');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const response = await api.get('/alerts/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching alert stats:', err);
        }
    }, []);

    const acknowledgeAlert = async (id: string) => {
        try {
            const response = await api.post(`/alerts/${id}/acknowledge`);
            setAlerts(prev => prev.map(a => a._id === id ? { ...response.data.alert, id: response.data.alert._id } : a));
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.error || 'Erreur lors de l\'acquittement' };
        }
    };

    const resolveAlert = async (id: string) => {
        try {
            const response = await api.post(`/alerts/${id}/resolve`);
            setAlerts(prev => prev.map(a => a._id === id ? { ...response.data.alert, id: response.data.alert._id } : a));
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.error || 'Erreur lors de la résolution' };
        }
    };

    const executeAction = async (id: string, actionIndex: number) => {
        try {
            const response = await api.post(`/alerts/${id}/actions/${actionIndex}`);
            return { success: true, data: response.data };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.error || 'Erreur lors de l\'exécution' };
        }
    };

    useEffect(() => {
        fetchAlerts();
        fetchStats();

        const socket = socketService.connect();

        const handleNewAlert = (alert: any) => {
            const normalized = { ...alert, id: alert._id };
            setAlerts(prev => [normalized, ...prev]);
        };

        const handleAlertUpdated = (alert: any) => {
            const normalized = { ...alert, id: alert._id };
            setAlerts(prev => prev.map(a => a._id === normalized._id ? normalized : a));
        };

        socketService.on('new-alert', handleNewAlert);
        socketService.on('alert-updated', handleAlertUpdated);

        return () => {
            socketService.off('new-alert', handleNewAlert);
            socketService.off('alert-updated', handleAlertUpdated);
        };
    }, [fetchAlerts, fetchStats]);

    return {
        alerts,
        stats,
        loading,
        error,
        acknowledgeAlert,
        resolveAlert,
        executeAction,
        fetchAlerts
    };
};
