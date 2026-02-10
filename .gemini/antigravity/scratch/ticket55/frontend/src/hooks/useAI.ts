import { useState, useCallback } from 'react';
import api from '@/lib/api';

export interface AIClassification {
    category: string;
    subcategory: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    urgencyScore: number;
    confidence: number;
    suggestedActions: string[];
    estimatedResolutionTime: number;
    departmentsInvolved: string[];
}

export const useAI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const classifyComplaint = useCallback(async (description: string, location?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/ai/classify', { description, location });
            return { success: true, classification: response.data.classification as AIClassification };
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Erreur lors de la classification IA';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    const generateCitizenResponse = useCallback(async (classification: AIClassification) => {
        try {
            setLoading(true);
            const response = await api.post('/ai/response', { classification });
            return { success: true, text: response.data.response as string };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.error || 'Erreur lors de la génération' };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        classifyComplaint,
        generateCitizenResponse,
        loading,
        error
    };
};
