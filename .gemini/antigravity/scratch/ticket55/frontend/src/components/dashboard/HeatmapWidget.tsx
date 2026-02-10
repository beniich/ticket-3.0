'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationHotspot } from '@/types/dashboard';
import { MapPin, AlertTriangle } from 'lucide-react';

interface HeatmapWidgetProps {
    hotspots: LocationHotspot[];
}

export const HeatmapWidget = ({ hotspots }: HeatmapWidgetProps) => {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-orange-600 bg-orange-100';
            case 'low': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Zones à Risque</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {hotspots.map((hotspot, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-blue-500" />
                                <div>
                                    <h3 className="font-medium">{hotspot.location}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {hotspot.category}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(hotspot.severity)}`}>
                                    {hotspot.count} incidents
                                </span>
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
