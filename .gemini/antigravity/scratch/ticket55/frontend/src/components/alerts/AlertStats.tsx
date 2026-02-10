'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertStats } from '@/types/alerts';

interface AlertStatsProps {
    stats: AlertStats;
}

export const AlertStatsComponent = ({ stats }: AlertStatsProps) => {
    const severityColors: Record<string, string> = {
        critical: 'bg-red-500',
        high: 'bg-orange-500',
        medium: 'bg-yellow-500',
        low: 'bg-blue-500'
    };

    const severityLabels: Record<string, string> = {
        critical: 'Critique',
        high: 'Haute',
        medium: 'Moyenne',
        low: 'Basse'
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Statistiques des Alertes (7 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {stats.severityStats.map((stat) => (
                        <div
                            key={stat._id}
                            className="p-4 rounded-lg border flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${severityColors[stat._id] || 'bg-gray-500'}`}></div>
                                <span className="font-medium">{severityLabels[stat._id] || stat._id}</span>
                            </div>
                            <span className="text-2xl font-bold">{stat.count}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Évolution quotidienne
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {stats.dailyStats.map((stat, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {stat._id.date} ({severityLabels[stat._id.severity]})
                                </span>
                                <span className="font-medium">{stat.count} alertes</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
