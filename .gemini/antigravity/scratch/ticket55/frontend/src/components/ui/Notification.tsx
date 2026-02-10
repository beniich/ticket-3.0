import { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    read: boolean;
}

interface NotificationProps {
    notifications: NotificationItem[];
    onMarkAsRead?: (id: string) => void;
    onDismiss?: (id: string) => void;
    className?: string;
}

export function NotificationPanel({
    notifications,
    onMarkAsRead,
    onDismiss,
    className = ''
}: NotificationProps) {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
            case 'warning': return 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20';
            case 'error': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
            default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
        }
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 z-50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                            <span className="text-sm text-slate-500">
                                {unreadCount} unread
                            </span>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-l-4 ${getTypeColor(notification.type)} ${!notification.read ? 'bg-slate-50 dark:bg-slate-800/50' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg">{getTypeIcon(notification.type)}</span>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-900 dark:text-white">
                                                {notification.title}
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-2">
                                                {notification.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onDismiss?.(notification.id)}
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {!notification.read && (
                                        <button
                                            onClick={() => onMarkAsRead?.(notification.id)}
                                            className="mt-2 text-xs text-primary hover:underline"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-center">
                            <button className="text-sm text-primary hover:underline">
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
