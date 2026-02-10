import { z } from 'zod';

// ============================================================================
// INTERFACES DE CONTEXTE UTILISATEUR
// ============================================================================

export interface UserContext {
    userId: string;
    role: string;
    department?: string;
    preferences: UserPreferences;
    behavior: UserBehavior;
    currentSession: SessionContext;
    historicalData: HistoricalDataContext;
}

export interface UserPreferences {
    notificationPreferences: {
        channels: string[];
        priorityThreshold: 'low' | 'medium' | 'high' | 'urgent';
        quietHours: {
            start: string;
            end: string;
        };
        digestFrequency: 'never' | 'daily' | 'weekly';
    };
    aiSettings: {
        personalization: boolean;
        relevanceThreshold: number;
        learningRate: number;
    };
}

export interface UserBehavior {
    notificationInteraction: {
        openRate: number;
        clickRate: number;
        dismissRate: number;
        responseTime: number; // en minutes
    };
    preferredContent: string[];
    ignoredContent: string[];
    engagementScore: number; // 0-100
}

export interface SessionContext {
    currentActivity: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    device: {
        type: 'mobile' | 'desktop' | 'tablet';
        os: string;
        browser: string;
    };
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    networkStatus: 'online' | 'offline' | 'slow';
}

export interface HistoricalDataContext {
    recentNotifications: any[];
    pastInteractions: any[];
    seasonalPatterns: any;
    workPatterns: any;
}

// ============================================================================
// SCHÉMAS ZOD POUR VALIDATION
// ============================================================================

export const UserContextSchema = z.object({
    userId: z.string(),
    role: z.string(),
    department: z.string().optional(),
    preferences: z.object({
        notificationPreferences: z.object({
            channels: z.array(z.string()),
            priorityThreshold: z.enum(['low', 'medium', 'high', 'urgent']),
            quietHours: z.object({
                start: z.string(),
                end: z.string()
            }),
            digestFrequency: z.enum(['never', 'daily', 'weekly'])
        }),
        aiSettings: z.object({
            personalization: z.boolean(),
            relevanceThreshold: z.number().min(0).max(100),
            learningRate: z.number().min(0).max(100)
        })
    }),
    behavior: z.object({
        notificationInteraction: z.object({
            openRate: z.number().min(0).max(100),
            clickRate: z.number().min(0).max(100),
            dismissRate: z.number().min(0).max(100),
            responseTime: z.number()
        }),
        preferredContent: z.array(z.string()),
        ignoredContent: z.array(z.string()),
        engagementScore: z.number().min(0).max(100)
    }),
    currentSession: z.object({
        currentActivity: z.string(),
        location: z.object({
            latitude: z.number(),
            longitude: z.number()
        }).optional(),
        device: z.object({
            type: z.enum(['mobile', 'desktop', 'tablet']),
            os: z.string(),
            browser: z.string()
        }),
        timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']),
        networkStatus: z.enum(['online', 'offline', 'slow'])
    }),
    historicalData: z.any()
});

// ============================================================================
// CLASSE POUR CONSTRUIRE LE CONTEXTE
// ============================================================================

export class MCPContext {
    static async buildUserContext(userId: string): Promise<UserContext> {
        // Récupérer les données utilisateur
        const userData = await this.fetchUserData(userId);
        const behaviorData = await this.fetchUserBehavior(userId);
        const sessionData = await this.getCurrentSession(userId);
        const historicalData = await this.getHistoricalData(userId);

        const context: UserContext = {
            userId: userData.id,
            role: userData.role,
            department: userData.department,
            preferences: userData.preferences,
            behavior: behaviorData,
            currentSession: sessionData,
            historicalData: historicalData
        };

        // Valider le contexte
        UserContextSchema.parse(context);

        return context;
    }

    private static async fetchUserData(userId: string) {
        // TODO: Récupérer depuis la base de données
        // Pour l'instant, retourner des valeurs par défaut
        return {
            id: userId,
            role: 'technician',
            department: 'maintenance',
            preferences: {
                notificationPreferences: {
                    channels: ['email', 'push', 'sms'],
                    priorityThreshold: 'medium' as const,
                    quietHours: { start: '22:00', end: '07:00' },
                    digestFrequency: 'daily' as const
                },
                aiSettings: {
                    personalization: true,
                    relevanceThreshold: 75,
                    learningRate: 60
                }
            }
        };
    }

    private static async fetchUserBehavior(userId: string) {
        // TODO: Calculer depuis l'historique des notifications
        return {
            notificationInteraction: {
                openRate: 85,
                clickRate: 60,
                dismissRate: 15,
                responseTime: 120
            },
            preferredContent: ['complaint_assigned', 'deadline_approaching'],
            ignoredContent: ['system_maintenance'],
            engagementScore: 78
        };
    }

    private static async getCurrentSession(userId: string) {
        const hour = new Date().getHours();
        let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';

        if (hour >= 5 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
        else timeOfDay = 'night';

        return {
            currentActivity: 'viewing_dashboard',
            device: {
                type: 'desktop' as const,
                os: 'Windows',
                browser: 'Chrome'
            },
            timeOfDay,
            networkStatus: 'online' as const
        };
    }

    private static async getHistoricalData(userId: string) {
        // TODO: Récupérer depuis la base de données
        return {
            recentNotifications: [],
            pastInteractions: [],
            seasonalPatterns: {},
            workPatterns: {}
        };
    }
}
