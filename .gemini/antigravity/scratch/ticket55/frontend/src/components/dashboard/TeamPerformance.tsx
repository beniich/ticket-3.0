'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamPerformance } from '@/types/dashboard';
import { Trophy, Award, Medal } from 'lucide-react';

interface TeamPerformanceProps {
    teams: TeamPerformance[];
}

export const TeamPerformanceChart = ({ teams }: TeamPerformanceProps) => {
    const sortedTeams = [...teams].sort((a, b) => b.efficiency - a.efficiency);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 1: return <Medal className="h-5 w-5 text-gray-400" />;
            case 2: return <Award className="h-5 w-5 text-amber-600" />;
            default: return <span className="text-sm font-medium">#{index + 1}</span>;
        }
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Performance des Équipes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sortedTeams.map((team, index) => (
                        <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                            <div className="flex items-center space-x-3">
                                {getRankIcon(index)}
                                <div>
                                    <h3 className="font-medium">{team.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {team.completed} tâches complétées
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-lg">
                                    {team.efficiency.toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Efficacité
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
