'use client';

import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { TrendsChart } from '@/components/dashboard/TrendsChart';
import { TeamPerformanceChart } from '@/components/dashboard/TeamPerformance';
import { HeatmapWidget } from '@/components/dashboard/HeatmapWidget';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SmartNotificationManager } from '@/components/alerts/SmartNotificationManager';
import { DatePicker } from '@/components/ui/DatePicker';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ExportButton } from '@/components/export/ExportButton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
    const {
        data,
        loading,
        error,
        dateRange,
        autoRefresh,
        setAutoRefresh,
        refreshData,
        updateDateRange
    } = useDashboard();

    const handleExport = () => {
        // Implémentation de l'export
        console.log('Export dashboard data');
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600">Erreur</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">{error}</p>
                        <Button
                            onClick={refreshData}
                            className="mt-4 w-full"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Réessayer
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* En-tête */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Tableau de Bord</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Statistiques en temps réel des réclamations
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <DatePicker
                        startDate={dateRange.start}
                        endDate={dateRange.end}
                        onChange={(start, end) => updateDateRange({ start, end })}
                    />
                    <ExportButton
                        type="dashboard"
                        params={{ period: '7d' }}
                        className="bg-green-600 hover:bg-green-700"
                    />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Mis à jour: {data?.lastUpdated ?
                            format(new Date(data.lastUpdated), 'HH:mm:ss', { locale: fr }) :
                            'Jamais'}
                    </div>
                </div>
            </div>

            {/* Actions rapides */}
            <QuickActions
                onRefresh={refreshData}
                onExport={handleExport} // Kept for compatibility
                autoRefresh={autoRefresh}
                setAutoRefresh={setAutoRefresh}
            />

            <SmartNotificationManager />

            {/* Statistiques principales */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                </div>
            ) : data?.stats ? (
                <StatsOverview stats={data.stats} />
            ) : null}

            {/* Graphiques principaux */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-80 rounded-lg" />
                    <Skeleton className="h-80 rounded-lg" />
                </div>
            ) : data ? (
                <>
                    <CategoryChart categories={data.categories} />
                    <TrendsChart timeSeries={data.timeSeries} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TeamPerformanceChart teams={data.teams} />
                        <HeatmapWidget hotspots={data.hotspots} />
                    </div>
                </>
            ) : null}
        </div>
    );
}
