import { z } from 'zod';

// ============================================================================
// SCHÉMAS DE NOTIFICATION
// ============================================================================

export const NotificationRequestSchema = z.object({
    userId: z.string(),
    notificationType: z.string(),
    content: z.object({
        title: z.string(),
        message: z.string(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']),
        category: z.string()
    }),
    context: z.any().optional(),
    metadata: z.any().optional()
});

export const NotificationDecisionSchema = z.object({
    shouldSend: z.boolean(),
    reasoning: z.string(),
    confidence: z.number().min(0).max(1),
    recommendedChannels: z.array(z.string()),
    optimalTiming: z.string().optional(),
    personalizedMessage: z.string().optional(),
    actions: z.array(z.object({
        label: z.string(),
        action: z.string(),
        priority: z.enum(['primary', 'secondary']).optional()
    })).optional()
});

export const DigestRecommendationSchema = z.object({
    shouldInclude: z.boolean(),
    priority: z.number().min(0).max(10),
    summary: z.string(),
    grouping: z.string().optional(),
    actions: z.array(z.string()).optional()
});

// ============================================================================
// INTERFACES TYPESCRIPT
// ============================================================================

export interface NotificationRequest {
    userId: string;
    notificationType: string;
    content: {
        title: string;
        message: string;
        priority: 'low' | 'medium' | 'high' | 'urgent';
        category: string;
    };
    context?: any;
    metadata?: any;
}

export interface NotificationDecision {
    shouldSend: boolean;
    reasoning: string;
    confidence: number;
    recommendedChannels: string[];
    optimalTiming?: string;
    personalizedMessage?: string;
    actions?: Array<{
        label: string;
        action: string;
        priority?: 'primary' | 'secondary';
    }>;
}

export interface DigestRecommendation {
    shouldInclude: boolean;
    priority: number;
    summary: string;
    grouping?: string;
    actions?: string[];
}
