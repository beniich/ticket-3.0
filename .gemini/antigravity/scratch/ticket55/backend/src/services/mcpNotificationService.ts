import { NotificationAgent } from '../mcp/agents/NotificationAgent.js';
import alertService from './alertService.js';
import {
    NotificationRequest,
    NotificationDecision
} from '../mcp/models/NotificationModel.js';
import Alert from '../models/Alert.js';

export class MCPNotificationService {
    private notificationAgent: NotificationAgent;

    constructor() {
        this.notificationAgent = new NotificationAgent();
    }

    async createSmartNotification(payload: any): Promise<any> {
        try {
            // 1. Préparer la requête pour l'agent MCP
            const request: NotificationRequest = {
                userId: payload.userId,
                notificationType: payload.type,
                content: {
                    title: payload.title,
                    message: payload.message,
                    priority: payload.priority || 'medium',
                    category: payload.category || 'general'
                },
                context: payload.context,
                metadata: payload.metadata
            };

            // 2. Évaluer la notification avec l'IA
            const decision: NotificationDecision = await this.notificationAgent.evaluateNotification(request);

            // 3. Appliquer la décision
            if (decision.shouldSend) {
                // Personnaliser le message si demandé ou pour haute confiance
                let personalizedMessage = payload.message;
                if (decision.personalizedMessage) {
                    personalizedMessage = decision.personalizedMessage;
                } else if (decision.confidence > 0.8) {
                    // Personnalisation automatique
                    const context = await this.buildMinimalContext(payload.userId);
                    personalizedMessage = await this.notificationAgent.personalizeMessage(
                        payload.message,
                        payload.userId,
                        context
                    );
                }

                // Créer l'alerte/notification
                const alertData = {
                    type: payload.type,
                    severity: this.mapPriorityToSeverity(payload.priority || decision.confidence > 0.8 ? 'high' : 'medium'),
                    title: payload.title,
                    message: personalizedMessage,
                    recipients: [payload.userId],
                    data: {
                        ...payload.data,
                        mcpDecision: decision
                    },
                    actions: decision.actions || payload.actions
                };

                const alert = await alertService.createAlert(alertData);

                return {
                    notification: alert,
                    decision,
                    personalized: personalizedMessage !== payload.message
                };
            } else {
                console.log(`[MCP] Notification ignorée pour ${payload.userId}: ${decision.reasoning}`);
                return {
                    notification: null,
                    decision,
                    ignored: true
                };
            }
        } catch (error) {
            console.error('❌ Erreur création notification intelligente:', error);
            // Fallback: créer une notification standard
            const alert = await alertService.createAlert(payload);
            return { alert, fallback: true };
        }
    }

    async createSmartDigest(userId: string, type: 'daily' | 'weekly'): Promise<any> {
        try {
            // Récupérer les notifications candidates (non lues)
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - (type === 'daily' ? 1 : 7));

            const notifications = await Alert.find({
                recipients: userId,
                acknowledged: false,
                triggeredAt: { $gte: cutoffDate }
            }).sort({ triggeredAt: -1 });

            if (notifications.length === 0) {
                return { message: 'Aucune notification à inclure' };
            }

            // Obtenir les recommandations de l'agent MCP
            const recommendedNotifications = await this.notificationAgent.recommendDigestContent(
                userId,
                notifications
            );

            // Créer une alerte de type "digest"
            const digestAlert = await alertService.createAlert({
                type: `digest_${type}`,
                severity: 'info',
                title: `Votre résumé ${type === 'daily' ? 'quotidien' : 'hebdomadaire'}`,
                message: `Vous avez ${recommendedNotifications.length} notifications importantes à consulter.`,
                recipients: [userId],
                data: {
                    notificationIds: recommendedNotifications.map(n => n._id),
                    type
                }
            });

            return {
                digest: digestAlert,
                recommendations: recommendedNotifications,
                processed: true
            };
        } catch (error) {
            console.error('❌ Erreur création digest intelligent:', error);
            throw error;
        }
    }

    private mapPriorityToSeverity(priority: string): 'info' | 'low' | 'medium' | 'high' | 'critical' {
        switch (priority) {
            case 'low': return 'low';
            case 'medium': return 'medium';
            case 'high': return 'high';
            case 'urgent': return 'critical';
            default: return 'info';
        }
    }

    private async buildMinimalContext(userId: string): Promise<any> {
        // Dans une vraie app, on chargerait les données du User model
        return {
            role: 'technician',
            department: 'maintenance',
            currentSession: {
                currentActivity: 'online'
            }
        };
    }
}

export default new MCPNotificationService();
