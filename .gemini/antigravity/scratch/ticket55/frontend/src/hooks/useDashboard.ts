import { useState, useEffect, useCallback } from 'react';
import { DashboardData, DateRange } from '@/types/dashboard';
import socketService from '@/lib/socket';

export const useDashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 jours
        end: new Date()
    });
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                startDate: dateRange.start.toISOString(),
                endDate: dateRange.end.toISOString()
            });

            const response = await fetch(`/api/dashboard?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error('Failed to fetch dashboard data');
            }

            const data = await response.json();
            setData(data);
        } catch (err: any) {
            setError(err.message || 'Erreur chargement dashboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    // Chargement initial
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Auto-refresh
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetchDashboardData();
        }, 30000); // 30 secondes

        return () => clearInterval(interval);
    }, [autoRefresh, fetchDashboardData]);

    // Mise à jour en temps réel via WebSocket
    useEffect(() => {
        const socket = socketService.connect();

        const handleDashboardUpdate = (updateData: any) => {
            if (data) {
                setData(prev => prev ? ({
                    ...prev,
                    ...updateData,
                    lastUpdated: new Date()
                }) : null);
            }
        };

        const handleComplaintUpdate = (complaintData: any) => {
            // Rafraîchir les données quand une réclamation est mise à jour
            fetchDashboardData();
        };

        socketService.on('dashboard-update', handleDashboardUpdate);
        socketService.on('complaint-update', handleComplaintUpdate);

        return () => {
            socketService.off('dashboard-update', handleDashboardUpdate);
            socketService.off('complaint-update', handleComplaintUpdate);
        };
    }, [data, fetchDashboardData]);

    const refreshData = () => {
        fetchDashboardData();
    };

    const updateDateRange = (range: DateRange) => {
        setDateRange(range);
    };

    return {
        data,
        loading,
        error,
        dateRange,
        autoRefresh,
        setAutoRefresh,
        refreshData,
        updateDateRange
    };
};
