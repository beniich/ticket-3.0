'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BrandIdentity } from '@/components/settings/BrandIdentity';
import { ApiIntegrations } from '@/components/settings/ApiIntegrations';
import { NotificationRules } from '@/components/settings/NotificationRules';
import { AppPreferences } from '@/components/settings/AppPreferences';
import { Maintenance } from '@/components/settings/Maintenance';
import { SettingsData } from '@/types/settings';
import { getSettings, updatePartialSettings } from '@/lib/api';

export default function SettingsPage() {
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getSettings();
            setSettings(data);
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChanges = async () => {
        if (!settings) return;

        try {
            await updatePartialSettings(settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings');
        }
    };

    const updatePreferences = (updates: Partial<SettingsData['preferences']>) => {
        if (settings) {
            setSettings({
                ...settings,
                preferences: { ...settings.preferences, ...updates }
            });
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 ml-64 p-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading settings...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 ml-64 p-8 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 text-lg font-medium">Failed to load settings</p>
                        <button
                            onClick={loadSettings}
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar activeSection="branding" />
            <main className="flex-1 ml-64 p-8 max-w-7xl">
                <header className="mb-10">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                        <span>Settings</span>
                        <span className="material-icons text-sm">chevron_right</span>
                        <span className="text-primary font-medium">Branding & System Hub</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold">Brand Identity & Core Settings</h1>
                            <p className="text-slate-500 mt-1">
                                Manage your platform visual assets and global system behaviors.
                            </p>
                        </div>
                        <button
                            onClick={handleSaveChanges}
                            className="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                            <span className="material-icons text-sm">save</span>
                            Save All Changes
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <BrandIdentity brand={settings.brand} />
                        <ApiIntegrations integrations={settings.integrations} />
                        <NotificationRules notifications={settings.notifications} />
                    </div>

                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <AppPreferences
                            preferences={settings.preferences}
                            onUpdate={updatePreferences}
                        />
                        <Maintenance
                            maintenance={settings.maintenance}
                            onClearCache={() => alert('Cache cleared')}
                            onGenerateBackup={() => alert('Backup generated')}
                            onPurgeLogs={() => alert('Audit logs purged')}
                        />
                    </div>
                </div>

                <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center pb-12">
                    <p className="text-slate-400 text-sm">
                        System Version {settings.metadata.version} • Last updated {settings.metadata.lastUpdated} by{' '}
                        <span className="font-semibold">{settings.metadata.updatedBy}</span>
                    </p>
                </footer>
            </main>
        </div>
    );
}
