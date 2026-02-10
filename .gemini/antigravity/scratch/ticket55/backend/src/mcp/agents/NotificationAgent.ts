import { MCPClient } from '../core/MCPClient.js';
import { MCPContext } from '../core/MCPContext.js';
import {
    NotificationRequest,
    NotificationDecision,
    NotificationDecisionSchema
} from '../models/NotificationModel.js';

export class NotificationAgent {
    private client: MCPClient;
    private isAIEnabled: boolean;

    constructor() {
        this.client = new MCPClient();
        this.isAIEnabled = this.client.isConfigured();

        if (!this.isAIEnabled) {
            console.warn('⚠️  Agent de notification en mode dégradé (pas de clé API IA)');
        }
    }

    async evaluateNotification(request: NotificationRequest): Promise<NotificationDecision> {
        try {
            // Si l'IA n'est pas configurée, retourner une décision par défaut
            if (!this.isAIEnabled) {
                return this.getDefaultDecision(request);
            }

            // Construire le contexte utilisateur
            const userContext = await MCPContext.buildUserContext(request.userId);

            // Préparer le prompt pour l'IA
            const prompt = this.buildEvaluationPrompt(request, userContext);

            // Obtenir la décision de l'IA
            const decision = await this.client.generateStructuredResponse(
                prompt,
                NotificationDecisionSchema
            );

            return decision;
        } catch (error) {
            console.error('❌ Erreur évaluation notification:', error);
            // Retourner une décision par défaut en cas d'erreur
            return this.getDefaultDecision(request);
        }
    }

    private buildEvaluationPrompt(request: NotificationRequest, context: any): string {
        return `
Vous êtes un assistant IA spécialisé dans l'optimisation des notifications pour ReclamTrack, une plateforme municipale de gestion de services.

**Contexte utilisateur:**
- ID: ${request.userId}
- Rôle: ${context.role}
- Département: ${context.department || 'Non spécifié'}
- Score d'engagement: ${context.behavior.engagementScore}/100
- Taux d'ouverture: ${context.behavior.notificationInteraction.openRate}%
- Préférences canaux: ${context.preferences.notificationPreferences.channels.join(', ')}
- Seuil priorité: ${context.preferences.notificationPreferences.priorityThreshold}

**Notification à évaluer:**
- Type: ${request.notificationType}
- Titre: ${request.content.title}
- Message: ${request.content.message}
- Priorité: ${request.content.priority}
- Catégorie: ${request.content.category}

**Moment actuel:** ${context.currentSession.timeOfDay}

Analysez si cette notification devrait être envoyée à cet utilisateur en tenant compte de:
1. La pertinence pour son rôle et département
2. Son historique d'interaction (${context.behavior.notificationInteraction.openRate}% d'ouverture)
3. Ses préférences de communication
4. Le moment approprié pour l'envoi (heures calmes: ${context.preferences.notificationPreferences.quietHours.start}-${context.preferences.notificationPreferences.quietHours.end})
5. L'urgence et l'importance du contenu

Répondez avec un JSON contenant:
- shouldSend: true/false
- reasoning: explication détaillée
- confidence: 0.0-1.0
- recommendedChannels: tableau de string
- optimalTiming: ISO timestamp (optionnel)
- personalizedMessage: message personnalisé (optionnel)
- actions: tableau d'actions recommandées (optionnel)
    `.trim();
    }

    private getDefaultDecision(request: NotificationRequest): NotificationDecision {
        // Décision par défaut basée sur la priorité
        const shouldSend = request.content.priority !== 'low';
        const confidence = request.content.priority === 'urgent' ? 0.9 :
            request.content.priority === 'high' ? 0.7 : 0.5;

        return {
            shouldSend,
            reasoning: `Décision par défaut basée sur la priorité (${request.content.priority}). IA non configurée.`,
            confidence,
            recommendedChannels: ['push', 'email'],
            optimalTiming: new Date().toISOString()
        };
    }

    async personalizeMessage(
        originalMessage: string,
        userId: string,
        context: any
    ): Promise<string> {
        if (!this.isAIEnabled) {
            return originalMessage;
        }

        try {
            const prompt = `
Personnalisez ce message pour l'utilisateur ${userId}:

**Message original:** "${originalMessage}"

**Contexte utilisateur:**
- Rôle: ${context.role}
- Département: ${context.department}
- Activité actuelle: ${context.currentSession?.currentActivity || 'Inconnue'}

**Instructions:**
1. Adaptez le ton au rôle de l'utilisateur
2. Rendez le message plus engageant
3. Gardez le contenu informatif et concis
4. Respectez le sens original

Répondez UNIQUEMENT avec le message personnalisé, sans explications supplémentaires.
      `.trim();

            const response = await this.client.sendMessage(prompt);
            return response.text || originalMessage;
        } catch (error) {
            console.error('❌ Erreur personnalisation message:', error);
            return originalMessage;
        }
    }

    async recommendDigestContent(userId: string, notifications: any[]): Promise<any[]> {
        if (!this.isAIEnabled || notifications.length === 0) {
            return notifications.slice(0, 10); // Retourner les 10 premières par défaut
        }

        try {
            const context = await MCPContext.buildUserContext(userId);

            const prompt = `
Analysez ces ${notifications.length} notifications pour créer un digest optimisé pour ${userId}:

**Notifications:**
${JSON.stringify(notifications.map(n => ({
                id: n._id || n.id,
                title: n.title,
                type: n.type,
                priority: n.priority,
                createdAt: n.createdAt
            })).slice(0, 20), null, 2)}

**Contexte utilisateur:**
- Rôle: ${context.role}
- Contenu préféré: ${context.behavior.preferredContent.join(', ')}
- Score engagement: ${context.behavior.engagementScore}/100

Recommandez quelles notifications inclure dans le digest (max 10), leur ordre de priorité, et comment les regrouper.

Répondez avec un tableau JSON des IDs à inclure, triés par priorité décroissante.
      `.trim();

            const response = await this.client.sendMessage(prompt);

            // Parser la réponse pour extraire les IDs recommandés
            const recommendedIds = this.parseDigestRecommendations(response.text);

            // Filtrer et réordonner les notifications
            return notifications
                .filter(n => recommendedIds.includes(n._id?.toString() || n.id))
                .slice(0, 10);
        } catch (error) {
            console.error('❌ Erreur recommandation digest:', error);
            return notifications.slice(0, 10);
        }
    }

    private parseDigestRecommendations(response: string): string[] {
        try {
            // Chercher un tableau JSON dans la réponse
            const arrayMatch = response.match(/\[[\s\S]*?\]/);
            if (arrayMatch) {
                const ids = JSON.parse(arrayMatch[0]);
                return Array.isArray(ids) ? ids.map(id => String(id)) : [];
            }
            return [];
        } catch (error) {
            return [];
        }
    }
}
