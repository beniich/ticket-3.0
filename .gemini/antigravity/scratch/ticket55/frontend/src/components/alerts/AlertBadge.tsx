'use client';

import React from 'react';
import { Bell, BellOff, AlertTriangle, Info } from 'lucide-react';

interface AlertBadgeProps {
    count: number;
    onClick: () => void;
}

export const AlertBadge = ({ count, onClick }: AlertBadgeProps) => {
    if (count === 0) {
        return (
            <div className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <BellOff className="h-5 w-5 text-gray-400" />
            </div>
        );
    }

    return (
        <div className="relative" onClick={onClick}>
            <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <Bell className="h-5 w-5 text-red-500" />
            </div>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {count > 99 ? '99+' : count}
            </span>
        </div>
    );
};
