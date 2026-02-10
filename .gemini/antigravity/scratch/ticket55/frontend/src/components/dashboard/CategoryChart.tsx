'use client';

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { CategoryStats } from '@/types/dashboard';
import { Layers, PieChart } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface CategoryChartProps {
    categories: CategoryStats[];
}

export const CategoryChart = ({ categories }: CategoryChartProps) => {
    // Custom Premium Colors
    const colors = [
        '#2424eb', // primary
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#06b6d4', // cyan
        '#10b981', // emerald
        '#f59e0b', // amber
    ];

    const barData = {
        labels: categories.map(cat => cat.name),
        datasets: [
            {
                label: 'Tickets',
                data: categories.map(cat => cat.count),
                backgroundColor: colors[0],
                borderRadius: 8,
                barThickness: 32,
            }
        ]
    };

    const doughnutData = {
        labels: categories.map(cat => cat.name),
        datasets: [
            {
                data: categories.map(cat => cat.count),
                backgroundColor: colors.map(c => `${c}cc`),
                borderColor: 'transparent',
                borderWidth: 0,
                hoverOffset: 20
            }
        ]
    };

    const commonOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 },
                cornerRadius: 12,
                displayColors: false
            }
        }
    };

    const barOptions = {
        ...commonOptions,
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 10, weight: '700' }, color: '#94a3b8' }
            },
            y: {
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
                ticks: { font: { size: 10, weight: '700' }, color: '#94a3b8' }
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                        <Layers size={18} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">Category Distribution</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Volume per service type</p>
                    </div>
                </div>
                <div className="flex-1 min-h-[300px] flex items-center">
                    <Bar data={barData} options={barOptions as any} />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                        <PieChart size={18} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">Segment Share</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Proportional impact analysis</p>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center relative min-h-[300px]">
                    <div className="w-full max-w-[280px]">
                        <Doughnut data={doughnutData} options={commonOptions as any} />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">{categories.reduce((a, b) => a + b.count, 0)}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
