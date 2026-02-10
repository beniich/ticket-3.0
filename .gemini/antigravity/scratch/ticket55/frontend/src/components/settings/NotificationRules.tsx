'use client';

import { NotificationRule } from '@/types/settings';

interface NotificationRulesProps {
    notifications: NotificationRule[];
}

export function NotificationRules({ notifications }: NotificationRulesProps) {
    const getChannelStyle = (channel: string) => {
        if (channel === 'ALL CHANNELS') {
            return 'bg-primary text-white';
        }
        return 'bg-primary/10 text-primary';
    };

    return (
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-icons text-primary">notifications_active</span>
                    Notification Rules
                </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((notification) => (
                    <div key={notification.id} className="p-6 flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{notification.name}</p>
                            <p className="text-sm text-slate-500">{notification.description}</p>
                        </div>
                        <div className="flex gap-3">
                            {notification.channels.map((channel, index) => (
                                <span
                                    key={index}
                                    className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${getChannelStyle(channel)}`}
                                >
                                    {channel}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
