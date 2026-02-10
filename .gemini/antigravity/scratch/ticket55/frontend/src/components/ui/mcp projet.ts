mcp projet 
# 🤖 APPROCHE MCP (MODEL-CONTEXT-PROTOCOL) POUR NOTIFICATIONS INTELLIGENTES

Je vais te fournir une **approche MCP complète** pour intégrer l'intelligence artificielle dans ton système de notifications.

---

## 📋 QU'EST-CE QUE MCP ?

**Model-Context-Protocol (MCP)** est un framework qui permet d'intégrer l'IA de manière structurée en trois composantes :
- **Model**: Le modèle IA (GPT, Claude, etc.)
- **Context**: Le contexte utilisateur et système
- **Protocol**: Le protocole de communication et actions

---

## 1. 📦 INSTALLATION DES DÉPENDANCES MCP

### Backend (`backend/package.json`)
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "openai": "^4.24.7",
    "anthropic": "^0.9.1",
    "zod": "^3.22.4"
  }
}
```

Installe :
```bash
cd backend && npm install @modelcontextprotocol/sdk openai anthropic zod
```

---

## 2. 📁 STRUCTURE MCP

```
backend/
├── src/
│   ├── mcp/
│   │   ├── core/
│   │   │   ├── MCPClient.ts          ✨ NOUVEAU
│   │   │   ├── MCPContext.ts         ✨ NOUVEAU
│   │   │   └── MCPProtocol.ts        ✨ NOUVEAU
│   │   ├── models/
│   │   │   ├── NotificationModel.ts   ✨ NOUVEAU
│   │   │   └── UserModel.ts          ✨ NOUVEAU
│   │   ├── tools/
│   │   │   ├── NotificationTools.ts   ✨ NOUVEAU
│   │   │   └── UserBehaviorTools.ts  ✨ NOUVEAU
│   │   ├── agents/
│   │   │   ├── NotificationAgent.ts   ✨ NOUVEAU
│   │   │   └── DigestAgent.ts        ✨ NOUVEAU
│   │   └── schemas/
│   │       └── NotificationSchema.ts  ✨ NOUVEAU
│   └── services/
│       └── mcpNotificationService.ts  ✨ NOUVEAU
```

---

## 3. 📄 CORE MCP - CLIENT ET CONTEXTE

### 📄 `backend/src/mcp/core/MCPClient.ts`
```typescript
import { createAnthropic } from "@modelcontextprotocol/sdk/adapters/anthropic";
import { createOpenAI } from "@modelcontextprotocol/sdk/adapters/openai";
import { z } from "zod";

export class MCPClient {
  private client: any;
  private provider: 'openai' | 'anthropic';

  constructor(provider: 'openai' | 'anthropic' = 'anthropic') {
    this.provider = provider;
    this.initializeClient();
  }

  private initializeClient() {
    switch(this.provider) {
      case 'anthropic':
        this.client = createAnthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
          model: "claude-3-opus-20240229"
        });
        break;
      case 'openai':
        this.client = createOpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          model: "gpt-4-turbo-preview"
        });
        break;
      default:
        throw new Error('Provider non supporté');
    }
  }

  async sendMessage(prompt: string, context?: any) {
    try {
      const response = await this.client.sendMessage(prompt, {
        context: context || {}
      });
      return response;
    } catch (error) {
      console.error('Erreur MCP client:', error);
      throw error;
    }
  }

  async generateStructuredResponse<T extends z.ZodTypeAny>(
    prompt: string, 
    schema: T,
    context?: any
  ) {
    try {
      const response = await this.client.sendMessage(prompt, {
        context: context || {},
        schema: schema
      });
      return response;
    } catch (error) {
      console.error('Erreur génération réponse structurée:', error);
      throw error;
    }
  }
}
```

### 📄 `backend/src/mcp/core/MCPContext.ts`
```typescript
import { z } from "zod";

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

// Schéma Zod pour la validation
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

export class MCPContext {
  static async buildUserContext(userId: string): Promise<UserContext> {
    // Récupérer les données utilisateur depuis la base
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
    // Implémentation de récupération des données utilisateur
    // depuis votre base de données
    return {
      id: userId,
      role: 'technician',
      department: 'maintenance',
      preferences: {
        notificationPreferences: {
          channels: ['email', 'push'],
          priorityThreshold: 'medium',
          quietHours: { start: '22:00', end: '07:00' },
          digestFrequency: 'daily'
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
    // Implémentation de récupération du comportement utilisateur
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
    // Implémentation de récupération de la session courante
    return {
      currentActivity: 'viewing_dashboard',
      device: {
        type: 'mobile',
        os: 'iOS',
        browser: 'Safari'
      },
      timeOfDay: 'morning',
      networkStatus: 'online'
    };
  }

  private static async getHistoricalData(userId: string) {
    // Implémentation de récupération des données historiques
    return {
      recentNotifications: [],
      pastInteractions: [],
      seasonalPatterns: {},
      workPatterns: {}
    };
  }
}
```

---

## 4. 📄 MODÈLES MCP

### 📄 `backend/src/mcp/models/NotificationModel.ts`
```typescript
import { z } from "zod";

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
```

---

## 5. 📄 OUTILS MCP

### 📄 `backend/src/mcp/tools/NotificationTools.ts`
```typescript
import { Tool } from "@modelcontextprotocol/sdk";
import { z } from "zod";
import { Notification } from "../../models/Notification";

export class NotificationTools {
  static getNotificationHistory: Tool = {
    name: "get_notification_history",
    description: "Récupère l'historique des notifications pour un utilisateur",
    parameters: z.object({
      userId: z.string(),
      limit: z.number().optional().default(10),
      days: z.number().optional().default(7)
    }),
    execute: async ({ userId, limit = 10, days = 7 }) => {
      try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const notifications = await Notification.find({
          userId,
          createdAt: { $gte: cutoffDate }
        })
        .sort({ createdAt: -1 })
        .limit(limit);

        return {
          success: true,
          data: notifications.map(n => ({
            id: n._id,
            type: n.type,
            title: n.title,
            priority: n.priority,
            read: n.read,
            createdAt: n.createdAt,
            channels: n.channels,
            actionsTaken: n.actions?.length || 0
          }))
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }
    }
  };

  static getUserEngagement: Tool = {
    name: "get_user_engagement",
    description: "Récupère les statistiques d'engagement de l'utilisateur",
    parameters: z.object({
      userId: z.string()
    }),
    execute: async ({ userId }) => {
      try {
        // Récupérer les statistiques d'engagement
        const engagementStats = await this.calculateEngagementStats(userId);
        
        return {
          success: true,
          data: engagementStats
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }
    }
  };

  static analyzeContent: Tool = {
    name: "analyze_content",
    description: "Analyse le contenu d'une notification pour déterminer sa pertinence",
    parameters: z.object({
      title: z.string(),
      message: z.string(),
      userId: z.string(),
      context: z.any().optional()
    }),
    execute: async ({ title, message, userId, context }) => {
      try {
        const analysis = await this.performContentAnalysis(title, message, userId, context);
        
        return {
          success: true,
          data: analysis
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }
    }
  };

  static scheduleNotification: Tool = {
    name: "schedule_notification",
    description: "Programme une notification pour un moment optimal",
    parameters: z.object({
      userId: z.string(),
      notification: z.any(),
      preferredTimeWindow: z.object({
        start: z.string(),
        end: z.string()
      }).optional()
    }),
    execute: async ({ userId, notification, preferredTimeWindow }) => {
      try {
        const scheduledTime = await this.findOptimalScheduleTime(userId, notification, preferredTimeWindow);
        
        return {
          success: true,
          data: {
            scheduledTime,
            reason: "Moment optimal basé sur l'historique utilisateur"
          }
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }
    }
  };

  private static async calculateEngagementStats(userId: string) {
    // Implémentation du calcul des statistiques d'engagement
    const notifications = await Notification.find({ userId });
    
    const total = notifications.length;
    const read = notifications.filter(n => n.read).length;
    const clicked = notifications.filter(n => n.actions && n.actions.length > 0).length;
    
    return {
      totalNotifications: total,
      readRate: total > 0 ? (read / total) * 100 : 0,
      clickRate: total > 0 ? (clicked / total) * 100 : 0,
      averageResponseTime: 120, // en minutes
      preferredChannels: ['email', 'push'],
      engagementScore: Math.min(100, (read + clicked) * 2)
    };
  }

  private static async performContentAnalysis(title: string, message: string, userId: string, context: any) {
    // Implémentation de l'analyse de contenu
    const keywords = this.extractKeywords(message);
    const sentiment = this.analyzeSentiment(message);
    const relevance = await this.calculateRelevance(keywords, userId, context);
    
    return {
      keywords,
      sentiment,
      relevance,
      urgency: this.detectUrgency(message),
      categories: this.categorizeContent(message)
    };
  }

  private static extractKeywords(text: string): string[] {
    // Extraction simplifiée de mots-clés
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 10);
  }

  private static analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['merci', 'bien', 'super', 'excellent', 'parfait'];
    const negativeWords = ['problème', 'urgence', 'erreur', 'désolé', 'difficile'];
    
    const textLower = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (textLower.includes(word)) score++;
    });
    
    negativeWords.forEach(word => {
      if (textLower.includes(word)) score--;
    });
    
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  private static async calculateRelevance(keywords: string[], userId: string, context: any): Promise<number> {
    // Calcul simplifié de pertinence
    return Math.random() * 0.5 + 0.5; // 50-100% aléatoire pour l'exemple
  }

  private static detectUrgency(text: string): number {
    const urgentWords = ['urgence', 'immédiat', 'maintenant', 'critique', 'important'];
    const textLower = text.toLowerCase();
    
    let urgency = 0;
    urgentWords.forEach(word => {
      if (textLower.includes(word)) urgency += 0.2;
    });
    
    return Math.min(1, urgency);
  }

  private static categorizeContent(text: string): string[] {
    const categories: Record<string, string[]> = {
      'technical': ['maintenance', 'réparation', 'équipement', 'technique'],
      'administrative': ['rapport', 'document', 'procédure', 'administration'],
      'communication': ['message', 'discussion', 'conversation', 'contact'],
      'alert': ['alerte', 'avertissement', 'attention', 'notification']
    };
    
    const textLower = text.toLowerCase();
    const detectedCategories: string[] = [];
    
    Object.entries(categories).forEach(([category, words]) => {
      const matches = words.filter(word => textLower.includes(word));
      if (matches.length > 0) {
        detectedCategories.push(category);
      }
    });
    
    return detectedCategories.length > 0 ? detectedCategories : ['general'];
  }

  private static async findOptimalScheduleTime(
    userId: string, 
    notification: any, 
    preferredTimeWindow?: { start: string; end: string }
  ): Promise<Date> {
    // Implémentation de recherche du moment optimal
    const now = new Date();
    now.setHours(now.getHours() + 1); // +1 heure par défaut
    return now;
  }
}
```

---

## 6. 📄 AGENTS MCP

### 📄 `backend/src/mcp/agents/NotificationAgent.ts`
```typescript
import { MCPClient } from "../core/MCPClient";
import { MCPContext } from "../core/MCPContext";
import { NotificationTools } from "../tools/NotificationTools";
import { 
  NotificationRequest, 
  NotificationDecision, 
  NotificationDecisionSchema 
} from "../models/NotificationModel";
import { z } from "zod";

export class NotificationAgent {
  private client: MCPClient;

  constructor() {
    this.client = new MCPClient('anthropic');
  }

  async evaluateNotification(request: NotificationRequest): Promise<NotificationDecision> {
    try {
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
      console.error('Erreur évaluation notification:', error);
      // Retourner une décision par défaut en cas d'erreur
      return this.getDefaultDecision(request);
    }
  }

  private buildEvaluationPrompt(request: NotificationRequest, context: any): string {
    return `
Vous êtes un assistant IA spécialisé dans l'optimisation des notifications pour une plateforme municipale de gestion de services.

Contexte utilisateur:
- ID: ${request.userId}
- Rôle: ${context.role}
- Département: ${context.department || 'Non spécifié'}
- Score d'engagement: ${context.behavior.engagementScore}/100
- Taux d'ouverture: ${context.behavior.notificationInteraction.openRate}%
- Préférences: ${JSON.stringify(context.preferences)}

Notification à évaluer:
- Type: ${request.notificationType}
- Titre: ${request.content.title}
- Message: ${request.content.message}
- Priorité: ${request.content.priority}
- Catégorie: ${request.content.category}

Historique récent:
${JSON.stringify(context.historicalData.recentNotifications.slice(0, 5), null, 2)}

Veuillez analyser si cette notification devrait être envoyée à cet utilisateur, en tenant compte de:
1. La pertinence pour son rôle et département
2. Son historique d'interaction avec les notifications
3. Ses préférences de communication
4. Le moment approprié pour l'envoi
5. L'urgence et l'importance du contenu

Répondez avec une décision structurée incluant:
- shouldSend: booléen indiquant si la notification doit être envoyée
- reasoning: explication détaillée de la décision
- confidence: niveau de confiance (0-1)
- recommendedChannels: canaux recommandés
- optimalTiming: moment optimal d'envoi (facultatif)
- personalizedMessage: message personnalisé (facultatif)
- actions: actions recommandées (facultatif)
    `;
  }

  private getDefaultDecision(request: NotificationRequest): NotificationDecision {
    // Décision par défaut basée sur la priorité
    const shouldSend = request.content.priority !== 'low';
    const confidence = request.content.priority === 'urgent' ? 0.9 : 
                      request.content.priority === 'high' ? 0.7 : 0.5;
    
    return {
      shouldSend,
      reasoning: "Décision par défaut basée sur la priorité",
      confidence,
      recommendedChannels: ['email', 'push'],
      optimalTiming: new Date().toISOString()
    };
  }

  async personalizeMessage(originalMessage: string, userId: string, context: any): Promise<string> {
    try {
      const prompt = `
Personnalisez ce message pour l'utilisateur ${userId}:

Message original: "${originalMessage}"

Contexte utilisateur:
- Nom: ${context.user.name}
- Rôle: ${context.role}
- Département: ${context.department}
- Dernière activité: ${context.currentSession.currentActivity}

Instructions:
1. Adaptez le ton au rôle de l'utilisateur
2. Incluez des références pertinentes à son département
3. Utilisez son prénom si disponible
4. Rendez le message plus engageant
5. Gardez le contenu informatif et concis

Répondez uniquement avec le message personnalisé, sans explications supplémentaires.
      `;

      const response = await this.client.sendMessage(prompt);
      return response.text || originalMessage;
    } catch (error) {
      console.error('Erreur personnalisation message:', error);
      return originalMessage;
    }
  }

  async recommendDigestContent(userId: string, notifications: any[]): Promise<any[]> {
    try {
      const context = await MCPContext.buildUserContext(userId);
      
      const prompt = `
Analysez ces notifications pour créer un digest optimisé pour ${userId}:

Notifications:
${JSON.stringify(notifications.map(n => ({
        id: n._id,
        title: n.title,
        type: n.type,
        priority: n.priority,
        createdAt: n.createdAt
      })), null, 2)}

Contexte utilisateur:
${JSON.stringify(context, null, 2)}

Recommandez quelles notifications inclure dans le digest, leur ordre de priorité, et comment les regrouper.

Répondez avec une liste structurée de recommandations.
      `;

      const response = await this.client.sendMessage(prompt);
      return this.parseDigestRecommendations(response.text);
    } catch (error) {
      console.error('Erreur recommandation digest:', error);
      return notifications.slice(0, 10); // Retourner les 10 premières par défaut
    }
  }

  private parseDigestRecommendations(response: string): any[] {
    try {
      // Parser la réponse pour extraire les recommandations
      // Cette implémentation est simplifiée
      return response.includes('prioritaire') ? 
        [{ priority: 'high' }] : 
        [{ priority: 'medium' }];
    } catch (error) {
      return [];
    }
  }
}
```

---

## 7. 📄 SERVICE D'INTÉGRATION MCP

### 📄 `backend/src/services/mcpNotificationService.ts`
```typescript
import { NotificationAgent } from "../mcp/agents/NotificationAgent";
import { Notification } from "./notificationService"; // Service existant
import { 
  NotificationRequest, 
  NotificationDecision 
} from "../mcp/models/NotificationModel";

export class MCPNotificationService {
  private notificationAgent: NotificationAgent;
  private baseNotificationService: any; // Référence au service existant

  constructor(baseService: any) {
    this.notificationAgent = new NotificationAgent();
    this.baseNotificationService = baseService;
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
        // Personnaliser le message si demandé
        let personalizedMessage = payload.message;
        if (decision.personalizedMessage) {
          personalizedMessage = decision.personalizedMessage;
        } else if (decision.confidence > 0.8) {
          // Personnalisation automatique pour haute confiance
          const context = await this.buildMinimalContext(payload.userId);
          personalizedMessage = await this.notificationAgent.personalizeMessage(
            payload.message, 
            payload.userId, 
            context
          );
        }

        // Créer la notification avec les canaux recommandés
        const notificationPayload = {
          ...payload,
          message: personalizedMessage,
          channels: decision.recommendedChannels,
          expiresAt: decision.optimalTiming ? new Date(decision.optimalTiming) : payload.expiresAt
        };

        // Utiliser le service existant pour créer la notification
        const notification = await this.baseNotificationService.createNotification(notificationPayload);

        // Ajouter les actions recommandées
        if (decision.actions && decision.actions.length > 0) {
          await this.addRecommendedActions(notification._id, decision.actions);
        }

        return {
          notification,
          decision,
          personalized: personalizedMessage !== payload.message
        };
      } else {
        // Ne pas envoyer la notification
        console.log(`Notification ignorée pour ${payload.userId}: ${decision.reasoning}`);
        return {
          notification: null,
          decision,
          ignored: true
        };
      }
    } catch (error) {
      console.error('Erreur création notification intelligente:', error);
      // Fallback sur le service existant
      return await this.createFallbackNotification(payload);
    }
  }

  async createSmartDigest(userId: string, type: 'daily' | 'weekly'): Promise<any> {
    try {
      // Récupérer les notifications candidates
      const notifications = await this.getCandidateNotifications(userId, type);
      
      if (notifications.length === 0) {
        return { digest: null, message: 'Aucune notification à inclure' };
      }

      // Obtenir les recommandations de l'agent MCP
      const recommendedNotifications = await this.notificationAgent.recommendDigestContent(
        userId, 
        notifications
      );

      // Créer le digest avec les notifications recommandées
      const digest = await this.baseNotificationService.createDigest(userId, type);
      
      return {
        digest,
        recommendations: recommendedNotifications,
        processed: true
      };
    } catch (error) {
      console.error('Erreur création digest intelligent:', error);
      // Fallback sur le digest standard
      const digest = await this.baseNotificationService.createDigest(userId, type);
      return { digest, processed: false };
    }
  }

  async batchEvaluateNotifications(notifications: any[]): Promise<Array<{notification: any, decision: NotificationDecision}>> {
    const results: Array<{notification: any, decision: NotificationDecision}> = [];
    
    for (const notification of notifications) {
      try {
        const request: NotificationRequest = {
          userId: notification.userId,
          notificationType: notification.type,
          content: {
            title: notification.title,
            message: notification.message,
            priority: notification.priority,
            category: notification.category || 'general'
          }
        };

        const decision = await this.notificationAgent.evaluateNotification(request);
        results.push({ notification, decision });
      } catch (error) {
        console.error('Erreur évaluation batch notification:', error);
        // Décision par défaut
        results.push({
          notification,
          decision: {
            shouldSend: true,
            reasoning: "Évaluation par défaut",
            confidence: 0.5,
            recommendedChannels: ['email', 'push']
          }
        });
      }
    }

    return results;
  }

  private async buildMinimalContext(userId: string): Promise<any> {
    // Construire un contexte minimal pour la personnalisation
    return {
      user: { name: 'Utilisateur' }, // À récupérer depuis la base
      role: 'technician',
      department: 'maintenance',
      currentSession: {
        currentActivity: 'working'
      }
    };
  }

  private async getCandidateNotifications(userId: string, type: string): Promise<any[]> {
    // Récupérer les notifications candidates pour le digest
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (type === 'daily' ? 1 : 7));
    
    return await Notification.find({
      userId,
      read: false,
      createdAt: { $gte: cutoffDate }
    }).sort({ priority: -1, createdAt: -1 });
  }

  private async addRecommendedActions(notificationId: string, actions: any[]): Promise<void> {
    // Ajouter les actions recommandées à la notification
    await Notification.findByIdAndUpdate(notificationId, {
      $set: { actions: actions }
    });
  }

  private async createFallbackNotification(payload: any): Promise<any> {
    // Créer une notification avec le service existant en cas d'erreur MCP
    const notification = await this.baseNotificationService.createNotification(payload);
    return {
      notification,
      decision: {
        shouldSend: true,
        reasoning: "Fallback en cas d'erreur MCP",
        confidence: 0.5,
        recommendedChannels: payload.channels || ['email', 'push']
      },
      fallback: true
    };
  }
}
```

---

## 8. 📄 INTÉGRATION DANS LE CONTROLLER

### 📄 `backend/src/controllers/notificationController.ts` (modifié)
```typescript
import { Request, Response } from 'express';
import notificationService from '../services/notificationService';
import { MCPNotificationService } from '../services/mcpNotificationService';

// Initialiser le service MCP
const mcpNotificationService = new MCPNotificationService(notificationService);

export class NotificationController {
  // Créer une notification intelligente
  static async createSmartNotification(req: Request, res: Response) {
    try {
      const payload = req.body;
      const userId = req.user!.userId;

      // Ajouter l'ID utilisateur au payload
      payload.userId = userId;

      // Utiliser le service MCP pour créer la notification
      const result = await mcpNotificationService.createSmartNotification(payload);

      if (result.ignored) {
        return res.status(202).json({
          message: "Notification évaluée mais non envoyée",
          decision: result.decision
        });
      }

      res.status(201).json({
        notification: result.notification,
        decision: result.decision,
        personalized: result.personalized,
        fallback: result.fallback
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Créer un digest intelligent
  static async createSmartDigest(req: Request, res: Response) {
    try {
      const { type } = req.params; // 'daily' ou 'weekly'
      const userId = req.user!.userId;

      const result = await mcpNotificationService.createSmartDigest(userId, type as any);

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Évaluation batch de notifications
  static async batchEvaluate(req: Request, res: Response) {
    try {
      const { notifications } = req.body;
      
      const results = await mcpNotificationService.batchEvaluateNotifications(notifications);

      res.json({
        evaluations: results,
        total: results.length,
        shouldSend: results.filter(r => r.decision.shouldSend).length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // ... autres méthodes existantes ...
}
```

---

## 9. 📄 ROUTES API

### 📄 `backend/src/routes/notifications.ts` (mis à jour)
```typescript
import express from 'express';
import { NotificationController } from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Routes existantes
router.get('/', authenticate, NotificationController.getUserNotifications);
router.post('/mark-read/:id', authenticate, NotificationController.markAsRead);
router.post('/archive/:id', authenticate, NotificationController.archiveNotification);
router.get('/preferences', authenticate, NotificationController.getUserPreferences);
router.put('/preferences', authenticate, NotificationController.updateUserPreferences);

// Nouvelles routes MCP
router.post('/smart', authenticate, NotificationController.createSmartNotification);
router.post('/digest/:type(smart)', authenticate, NotificationController.createSmartDigest);
router.post('/batch-evaluate', authenticate, NotificationController.batchEvaluate);

export default router;
```

---

## 10. 📄 CONFIGURATION ENVIRONNEMENT

### 📄 `.env` (ajouts nécessaires)
```env
# MCP Configuration
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MCP_PROVIDER=anthropic
MCP_MODEL=claude-3-opus-20240229

# Firebase pour push notifications (si utilisé)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

---

## 🎯 AVANTAGES DE L'APPROCHE MCP

### ✅ Intelligence Contextuelle
- **Contexte utilisateur complet** (préférences, comportement, session)
- **Historique personnalisé** d'interactions
- **Adaptation en temps réel** aux conditions

### ✅ Décisions Structurées
- **Schémas Zod** pour validation rigoureuse
- **Raisonnement explicite** de l'IA
- **Niveaux de confiance** quantifiés

### ✅ Personnalisation Avancée
- **Messages adaptés** au rôle et département
- **Timing optimal** basé sur l'historique
- **Canaux recommandés** par utilisateur

### ✅ Évolutivité
- **Agents spécialisés** pour différents types
- **Outils réutilisables** dans d'autres contextes
- **Protocole standardisé** pour l'IA

---

## 🚀 PROCHAINE ÉTAPE RECOMMANDÉE

Cette intégration MCP te permet maintenant de :

1. **Évaluer automatiquement** la pertinence des notifications
2. **Personnaliser le contenu** selon le contexte utilisateur
3. **Optimiser le timing** d'envoi
4. **Adapter les canaux** de communication

Souhaites-tu que je te fournisse également le **code frontend** pour l'interface utilisateur des notifications intelligentes ?