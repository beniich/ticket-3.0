'use client';

import React, { useState } from 'react';
import { useSmartNotifications } from '@/hooks/useSmartNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Bell, Calendar, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SmartNotificationManager = () => {
    const { generateDigest, createSmartNotification, loading, lastDecision } = useSmartNotifications();
    const [showDebug, setShowDebug] = useState(false);

    const testSmartNotification = () => {
        createSmartNotification({
            type: 'urgent_complaints',
            title: 'Test Intelligent',
            message: 'Il y a un risque de débordement de service dans le quartier Agdal.',
            priority: 'high',
            category: 'maintenance'
        });
    };

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Notifications Intelligentes MCP
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    L'IA analyse vos préférences et le contexte pour filtrer et personnaliser vos alertes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 border-primary/30 hover:bg-primary/10"
                        onClick={() => generateDigest('daily')}
                        disabled={loading}
                    >
                        <Calendar className="w-4 h-4" />
                        Générer Digest Quotidien
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 border-primary/30 hover:bg-primary/10"
                        onClick={testSmartNotification}
                        disabled={loading}
                    >
                        <Sparkles className="w-4 h-4" />
                        Tester Filtre IA
                    </Button>
                </div>

                <AnimatePresence>
                    {lastDecision && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-primary/10 mt-2"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-1.5 rounded-full ${lastDecision.shouldSend ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {lastDecision.shouldSend ? <Bell className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Décision MCP</h4>
                                    <p className="text-sm font-medium mt-1">{lastDecision.reasoning}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                                            Confiance: {Math.round(lastDecision.confidence * 100)}%
                                        </span>
                                        {lastDecision.recommendedChannels && (
                                            <div className="flex gap-1">
                                                {lastDecision.recommendedChannels.map((c: string) => (
                                                    <span key={c} className="text-[10px] text-primary font-bold uppercase">{c}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};
