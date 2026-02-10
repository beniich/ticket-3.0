'use client';

import React, { useState } from 'react';
import { useAlerts } from '@/hooks/useAlerts';
import { AlertItem } from '@/components/alerts/AlertItem';
import { AlertStatsComponent } from '@/components/alerts/AlertStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    RefreshCw,
    Filter,
    CheckCircle,
    X,
    AlertTriangle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AlertsPage() {
    const {
        alerts,
        stats,
        loading,
        error,
        fetchAlerts,
        acknowledgeAlert,
        resolveAlert,
        executeAction
    } = useAlerts();

    const [filters, setFilters] = useState({
        severity: '',
        acknowledged: false,
        resolved: false
    });

    const filteredAlerts = alerts.filter(alert => {
        if (filters.severity && alert.severity !== filters.severity) return false;
        if (filters.acknowledged && !alert.acknowledged) return false;
        if (filters.resolved && !alert.resolved) return false;
        return true;
    });

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleAcknowledgeAll = async () => {
        try {
            const unacknowledged = alerts.filter(a => !a.acknowledged);
            for (const alert of unacknowledged) {
                await acknowledgeAlert(alert.id);
            }
        } catch (error) {
            console.error('Erreur acquittement massif:', error);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Erreur
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">{error}</p>
                        <Button
                            onClick={() => fetchAlerts()}
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
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Alertes</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Gestion des alertes critiques et notifications
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <Button variant="outline" onClick={() => fetchAlerts()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualiser
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleAcknowledgeAll}
                        disabled={alerts.filter(a => !a.acknowledged).length === 0}
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Tout acquitter
                    </Button>
                </div>
            </div>

            {/* Filtres */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Filtres
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Sévérité:</label>
                        <select
                            value={filters.severity}
                            onChange={(e) => handleFilterChange('severity', e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value="">Toutes</option>
                            <option value="critical">Critique</option>
                            <option value="high">Haute</option>
                            <option value="medium">Moyenne</option>
                            <option value="low">Basse</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="acknowledged"
                            checked={filters.acknowledged}
                            onChange={(e) => handleFilterChange('acknowledged', e.target.checked)}
                            className="rounded"
                        />
                        <label htmlFor="acknowledged" className="text-sm">Acquittées</label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="resolved"
                            checked={filters.resolved}
                            onChange={(e) => handleFilterChange('resolved', e.target.checked)}
                            className="rounded"
                        />
                        <label htmlFor="resolved" className="text-sm">Résolues</label>
                    </div>
                </CardContent>
            </Card>

            {/* Statistiques */}
            {loading ? (
                <Skeleton className="h-48 rounded-lg mb-6" />
            ) : stats ? (
                <AlertStatsComponent stats={stats} />
            ) : null}

            {/* Liste des alertes */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Alertes ({filteredAlerts.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-20 rounded-lg" />
                            ))}
                        </div>
                    ) : filteredAlerts.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Aucune alerte
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Toutes les alertes ont été traitées.
                            </p>
                        </div>
                    ) : (
                        <div>
                            {filteredAlerts.map((alert) => (
                                <AlertItem
                                    key={alert.id}
                                    alert={alert}
                                    onAcknowledge={acknowledgeAlert}
                                    onResolve={resolveAlert}
                                    onExecuteAction={executeAction}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
