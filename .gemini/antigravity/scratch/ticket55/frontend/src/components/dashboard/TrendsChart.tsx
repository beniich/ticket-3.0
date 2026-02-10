'use client';

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeSeriesData } from '@/types/dashboard';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface TrendsChartProps {
    timeSeries: TimeSeriesData[];
}

export const TrendsChart = ({ timeSeries }: TrendsChartProps) => {
    const data = {
        labels: timeSeries.map(item => item.date),
        datasets: [
            {
                label: 'Réclamations créées',
                data: timeSeries.map(item => item.complaints),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.4
            },
            {
                label: 'Réclamations résolues',
                data: timeSeries.map(item => item.resolved),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Évolution des Réclamations (7 derniers jours)'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Tendances Temporelles</CardTitle>
            </CardHeader>
            <CardContent>
                <Line data={data} options={options} />
            </CardContent>
        </Card>
    );
};
