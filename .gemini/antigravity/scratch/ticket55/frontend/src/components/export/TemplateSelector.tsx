'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateOption {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
}

interface TemplateSelectorProps {
    onSelect: (templateId: string) => void;
}

export const TemplateSelector = ({ onSelect }: TemplateSelectorProps) => {
    const templates: TemplateOption[] = [
        {
            id: 'standard',
            name: 'Standard',
            description: 'Format classique avec toutes les colonnes',
            icon: '📋',
            category: 'Réclamations'
        },
        {
            id: 'summary',
            name: 'Sommaire',
            description: 'Vue condensée avec statistiques',
            icon: '📊',
            category: 'Réclamations'
        },
        {
            id: 'detailed',
            name: 'Détaillé',
            description: 'Toutes les informations avec photos',
            icon: '🔍',
            category: 'Réclamations'
        },
        {
            id: 'planning-weekly',
            name: 'Planning Hebdo',
            description: 'Planning des interventions hebdomadaire',
            icon: '📅',
            category: 'Planning'
        },
        {
            id: 'dashboard-summary',
            name: 'Résumé Dashboard',
            description: 'Statistiques principales du dashboard',
            icon: '📈',
            category: 'Statistiques'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
                <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onSelect(template.id)}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <span className="text-2xl mr-2">{template.icon}</span>
                            {template.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {template.description}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {template.category}
                        </span>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
