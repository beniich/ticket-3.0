'use client';

import React, { ReactNode } from 'react';
import Header from '../Header'; // Assuming Header is in root components folder
// import Sidebar from '../Sidebar'; // Assuming Sidebar is in root components folder
// Since I couldn't confirm Sidebar location with list_dir, I will try to use a relative import or just assume it's used in page layout contexts usually.
// But wait, the user provided code for `MessagesPage` in Step 382 used manual layout without a dedicated Sidebar component import visible in snippet?
// Ah, `MessagesPage` (Step 382) didn't show Sidebar import in the snippet I saw? Wait, looking at Step 382 snippet:
// `export default function MessagesPage() { ... return ( ... <ThreadList ... /> ... <MessageThread ... /> ... )`
// It didn't involve sidebar. It seems `messages/page.tsx` was just content.
// The root layout `app/layout.tsx` likely handles the sidebar.
// However, the `ResponsiveLayout` usually implies handling sidebar visibility on mobile or structure.
// Let's create a simple layout wrapper that includes the Header and potentially a sidebar slot or just content structure.

interface ResponsiveLayoutProps {
    children: ReactNode;
    pageTitle: string;
}

export const ResponsiveLayout = ({ children, pageTitle }: ResponsiveLayoutProps) => {
    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            {/* If Header is globally applied in layout.tsx, we might duplicate it here. 
          But looking at user request context, they often ask for specific layout components.
          I'll assume Header needs to be included or at least the page structure needs to be correct.
      */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between shrink-0">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
                </header>
                <main className="flex-1 overflow-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
};
