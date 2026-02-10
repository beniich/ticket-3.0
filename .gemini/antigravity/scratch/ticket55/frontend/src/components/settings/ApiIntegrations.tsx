'use client';

import { useState } from 'react';
import { Integration } from '@/types/settings';

interface ApiIntegrationsProps {
    integrations: Integration[];
}

export function ApiIntegrations({ integrations }: ApiIntegrationsProps) {
    const [integrationsState, setIntegrationsState] = useState(integrations);

    const toggleIntegration = (id: string) => {
        setIntegrationsState(prev =>
            prev.map(integration =>
                integration.id === id
                    ? { ...integration, enabled: !integration.enabled }
                    : integration
            )
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected':
                return 'bg-emerald-500';
            case 'disconnected':
                return 'bg-red-500';
            case 'pending':
                return 'bg-amber-500';
            default:
                return 'bg-slate-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'connected':
                return 'Connected';
            case 'disconnected':
                return 'Disconnected';
            case 'pending':
                return 'Pending';
            default:
                return 'Unknown';
        }
    };

    return (
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-icons text-primary text-xl">integration_instructions</span>
                    API Integrations
                </h2>
                <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded">
                    {integrationsState.filter(i => i.enabled).length} Active Services
                </span>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {integrationsState.map((integration) => (
                        <div
                            key={integration.id}
                            className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-primary/30 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg bg-${getIntegrationColor(integration.icon)}-50 dark:bg-${getIntegrationColor(integration.icon)}-900/20 flex items-center justify-center text-${getIntegrationColor(integration.icon)}-600`}>
                                        <span className="material-symbols-outlined">{integration.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{integration.name}</h3>
                                        <p className="text-xs text-slate-500">{integration.provider}</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        checked={integration.enabled}
                                        onChange={() => toggleIntegration(integration.id)}
                                        className="sr-only peer"
                                        type="checkbox"
                                    />
                                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${getStatusColor(integration.status)}`}></span>
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                                        {getStatusText(integration.status)}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {integration.apiKey ? 'API Key' : 'Client ID'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg pr-10 focus:ring-primary"
                                            readOnly
                                            type="password"
                                            value={integration.apiKey || integration.clientId || ''}
                                        />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <a
                                        className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                                        href="#"
                                    >
                                        <span className="material-symbols-outlined text-sm">menu_book</span> Documentation
                                    </a>
                                    <button className="text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors">
                                        Test Connection
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function getIntegrationColor(icon: string): string {
    switch (icon) {
        case 'sms': return 'blue';
        case 'map': return 'red';
        case 'sensors': return 'purple';
        case 'mail': return 'amber';
        default: return 'slate';
    }
}
