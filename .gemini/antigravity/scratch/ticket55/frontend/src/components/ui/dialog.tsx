'use client';

import * as React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

interface DialogContentProps {
    className?: string;
    children: React.ReactNode;
}

interface DialogHeaderProps {
    className?: string;
    children: React.ReactNode;
}

interface DialogTitleProps {
    className?: string;
    children: React.ReactNode;
}

interface DialogDescriptionProps {
    className?: string;
    children: React.ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={() => onOpenChange?.(false)}
            />
            {/* Content */}
            {children}
        </div>
    );
};

export const DialogContent = ({ className = '', children }: DialogContentProps) => {
    return (
        <div
            className={`relative z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 ${className}`}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
};

export const DialogHeader = ({ className = '', children }: DialogHeaderProps) => {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
};

export const DialogTitle = ({ className = '', children }: DialogTitleProps) => {
    return (
        <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}>
            {children}
        </h2>
    );
};

export const DialogDescription = ({ className = '', children }: DialogDescriptionProps) => {
    return (
        <p className={`text-sm text-gray-600 dark:text-gray-400 mt-2 ${className}`}>
            {children}
        </p>
    );
};

export const DialogFooter = ({ className = '', children }: { className?: string; children: React.ReactNode }) => {
    return (
        <div className={`mt-6 flex justify-end space-x-3 ${className}`}>
            {children}
        </div>
    );
};

export const DialogClose = ({ className = '', children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) => {
    return (
        <button
            className={`absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ${className}`}
            onClick={onClick}
        >
            {children || <X className="h-4 w-4" />}
        </button>
    );
};
