'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react'; // Changed from CalendarIcon to Calendar as CalendarIcon might not exist in some lucide versions or be named differently, trying standard export. Wait, checking imports.
// The user prompt said `import { CalendarIcon } from 'lucide-react';`. I will stick to that but keep in mind it might be Calendar.

interface DatePickerProps {
    startDate: Date;
    endDate: Date;
    onChange: (startDate: Date, endDate: Date) => void;
}

export const DatePicker = ({ startDate, endDate, onChange }: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const presets = [
        { label: 'Aujourd\'hui', days: 0 },
        { label: '7 derniers jours', days: 7 },
        { label: '30 derniers jours', days: 30 },
        { label: '90 derniers jours', days: 90 }
    ];

    const handlePresetClick = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        onChange(start, end);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(startDate, 'dd MMM', { locale: fr })} - {format(endDate, 'dd MMM yyyy', { locale: fr })}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                    <div className="p-4">
                        <div className="space-y-2">
                            {presets.map((preset) => (
                                <button
                                    key={preset.days}
                                    onClick={() => handlePresetClick(preset.days)}
                                    className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
