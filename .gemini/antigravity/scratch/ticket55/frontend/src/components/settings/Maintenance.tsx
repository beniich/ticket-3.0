'use client';

import { MaintenanceInfo } from '@/types/settings';

interface MaintenanceProps {
    maintenance: MaintenanceInfo;
    onClearCache: () => void;
    onGenerateBackup: () => void;
    onPurgeLogs: () => void;
}

export function Maintenance({
    maintenance,
    onClearCache,
    onGenerateBackup,
    onPurgeLogs
}: MaintenanceProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400';
            case 'maintenance':
                return 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-400';
            case 'issues':
                return 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400';
            default:
                return 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'operational':
                return 'All systems operational';
            case 'maintenance':
                return 'Scheduled maintenance';
            case 'issues':
                return 'Service disruptions';
            default:
                return 'System status unknown';
        }
    };

    return (
        <>
            <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <span className="material-icons text-primary">build</span>
                        Maintenance
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div
                        className={`p-4 border rounded-lg flex items-center gap-3 ${getStatusColor(maintenance.status)}`}
                    >
                        <span className="material-icons text-emerald-500">check_circle</span>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider">
                                System Status
                            </p>
                            <p className="text-sm font-medium">{getStatusText(maintenance.status)}</p>
                        </div>
                    </div>
                    <div className="space-y-3 pt-2">
                        <button
                            onClick={onClearCache}
                            className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-slate-400 group-hover:text-primary transition-colors">
                                    cleaning_services
                                </span>
                                <span className="text-sm font-semibold">Clear System Cache</span>
                            </div>
                            <span className="text-xs text-slate-400">{maintenance.cacheSize}</span>
                        </button>
                        <button
                            onClick={onGenerateBackup}
                            className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-slate-400 group-hover:text-primary transition-colors">
                                    backup
                                </span>
                                <span className="text-sm font-semibold">Generate Backup</span>
                            </div>
                            <span className="text-xs text-slate-400">Manual</span>
                        </button>
                        <button
                            onClick={onPurgeLogs}
                            className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-red-500">warning</span>
                                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                    Purge Audit Logs
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </section>
            <div className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">Need assistance?</h3>
                    <p className="text-blue-100 text-sm mb-4">
                        Our documentation hub contains detailed guides for every configuration.
                    </p>
                    <a
                        className="inline-block bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors"
                        href="#"
                    >
                        Open Docs
                    </a>
                </div>
                <span className="material-icons absolute -bottom-4 -right-4 text-white/10 text-9xl select-none">
                    help_center
                </span>
            </div>
        </>
    );
}
