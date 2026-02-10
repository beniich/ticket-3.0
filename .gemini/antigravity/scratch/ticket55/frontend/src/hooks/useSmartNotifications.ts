import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useSmartNotifications = () => {
    const [loading, setLoading] = useState(false);
    const [lastDecision, setLastDecision] = useState<any>(null);

    const createSmartNotification = useCallback(async (payload: any) => {
        try {
            setLoading(true);
            const response = await fetch('/api/alerts/smart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.status === 202) {
                toast.success('Notification filtrée par l\'IA (non urgente)', { icon: '🛡️' });
            } else if (response.ok) {
                toast.success(data.personalized ? 'Notification personnalisée par l\'IA envoyée' : 'Notification intelligente envoyée', { icon: '🤖' });
            } else {
                throw new Error(data.error || 'Erreur lors de la création de la notification');
            }

            setLastDecision(data.decision);
            return data;
        } catch (error: any) {
            const message = error.message || 'Erreur lors de la création de la notification';
            toast.error(message);
            console.error('Smart notification error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const generateDigest = useCallback(async (type: 'daily' | 'weekly') => {
        try {
            setLoading(true);
            const response = await fetch(`/api/alerts/digest/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                if (data.digest) {
                    toast.success(`Digest ${type} généré avec succès`, { icon: '📋' });
                } else {
                    toast.success(data.message || 'Aucune notification à résumer', { icon: 'ℹ️' });
                }
            } else {
                throw new Error(data.error || 'Erreur lors de la génération du digest');
            }

            return data;
        } catch (error: any) {
            toast.error('Erreur lors de la génération du digest');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createSmartNotification,
        generateDigest,
        lastDecision,
        loading
    };
};

