'use client';

import React from 'react';
import { DocumentLibrary } from '@/components/documents/DocumentLibrary';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

export default function DocumentsPage() {
    return (
        <ResponsiveLayout pageTitle="Bibliothèque de Documents">
            <div className="h-full">
                <DocumentLibrary />
            </div>
        </ResponsiveLayout>
    );
}
