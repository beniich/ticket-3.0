8 
# 🚀 SYSTÈME DE NOTIFICATIONS INTELLIGENTES - CODE COMPLET

Je vais te fournir le code complet avec une approche approfondie pour le **système de notifications intelligentes**.

---

## 1. 📦 INSTALLATION DES DÉPENDANCES

### Backend (`backend/package.json`)
```json
{
  "dependencies": {
    "socket.io": "^4.7.5",
    "nodemailer": "^6.9.8",
    "twilio": "^4.20.1",
    "firebase-admin": "^12.0.0",
    "bull": "^4.12.0",
    "redis": "^4.6.13",
    "handlebars": "^4.7.8"
  }
}
```

Installe :
```bash
cd backend && npm install socket.io nodemailer twilio firebase-admin bull redis handlebars
```

---

## 2. 📁 STRUCTURE DES FICHIERS

```
backend/
├── src/
│   ├── models/
│   │   └── Notification.ts            ✨ NOUVEAU
│   ├── controllers/
│   │   └── notificationController.ts   ✨ NOUVEAU
│   ├── routes/
│   │   └── notifications.ts           ✨ NOUVEAU
│   ├── services/
│   │   ├── notificationService.ts      ✨ NOUVEAU
│   │   ├── emailService.ts            ✨ NOUVEAU
│   │   ├── smsService.ts              ✨ NOUVEAU
│   │   ├── pushService.ts             ✨ NOUVEAU
│   │   └── aiNotificationService.ts    ✨ NOUVEAU
│   ├── workers/
│   │   └── notificationWorker.ts       ✨ NOUVEAU
│   ├── templates/
│   │   └── notificationTemplates/      ✨ NOUVEAU
│   │       ├── email/
│   │       │   ├── complaint-created.hbs
│   │       │   ├── deadline-approaching.hbs
│   │       │   └── achievement-unlocked.hbs
│   │       └── sms/
│   │           └── default.txt
│   └── middleware/
│       └── notificationMiddleware.ts   ✨ NOUVEAU

frontend/
├── src/
│   ├── components/
│   │   ├── notifications/
│   │   │   ├── NotificationCenter.tsx   ✨ NOUVEAU
│   │   │   ├── NotificationItem.tsx    ✨ NOUVEAU
│   │   │   ├── NotificationPreferences.tsx ✨ NOUVEAU
│   │   │   ├── NotificationBadge.tsx   ✨ NOUVEAU
│   │   │   └── DigestSettings.tsx      ✨ NOUVEAU
│   ├── hooks/
│   │   └── useNotifications.ts         ✨ NOUVEAU
│   ├── types/
│   │   └── notification.ts             ✨ NOUVEAU
│   └── lib/
│       └── notificationUtils.ts        ✨ NOUVEAU
```

---

## 3. 📄 MODÈLES DE DONNÉES

### 📄 `backend/src/models/Notification.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: NotificationChannel[];
  read: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  actions?: NotificationAction[];
  metadata?: any;
  aiScore?: number; // Score de pertinence IA
  deliveredChannels?: DeliveredChannel[]; // Suivi des envois
  digestBatchId?: string; // Pour regroupement digest
}

export interface INotificationPreference extends Document {
  userId: string;
  channels: {
    email: {
      enabled: boolean;
      frequency: 'immediate' | 'daily_digest' | 'weekly_digest';
      time?: string; // Format: "HH:mm"
      template?: string;
    };
    sms: {
      enabled: boolean;
      priorityThreshold: 'medium' | 'high' | 'urgent';
      provider: 'twilio' | 'other';
    };
    push: {
      enabled: boolean;
      quietHours: {
        start: string; // Format: "HH:mm"
        end: string;   // Format: "HH:mm"
      };
      sound: boolean;
      vibration: boolean;
    };
    in_app: {
      enabled: boolean;
      badge: boolean;
      sound: boolean;
      autoDismiss: boolean;
      dismissTimeout: number; // secondes
    };
  };
  types: {
    [key in NotificationType]: boolean;
  };
  digestSettings: {
    daily: boolean;
    weekly: boolean;
    summaryOnly: boolean;
    preferredTime: {
      daily: string; // Format: "HH:mm"
      weekly: string; // Format: "HH:mm"
      timezone: string;
    };
  };
  aiSettings: {
    enablePersonalization: boolean;
    relevanceThreshold: number; // 0-100
    learningRate: number; // 0-100
    ignoreSimilar: boolean; // Ignorer notifications similaires
  };
  blacklist: {
    types: NotificationType[];
    keywords: string[];
    senders: string[]; // User IDs à ignorer
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveredChannel {
  channel: NotificationChannel;
  status: 'pending' | 'sent' | 'failed';
  timestamp: Date;
  providerResponse?: string;
  retryCount: number;
}

export type NotificationType = 
  | 'complaint_created'          // Nouvelle réclamation
  | 'complaint_assigned'         // Réclamation assignée
  | 'complaint_resolved'         // Réclamation résolue
  | 'complaint_escalated'        // Réclamation escaladée
  | 'team_assignment'            // Assignation à une équipe
  | 'deadline_approaching'       // Deadline proche
  | 'high_priority_alert'        // Alerte haute priorité
  | 'system_maintenance'         // Maintenance système
  | 'performance_update'         // Mise à jour performance
  | 'document_shared'            // Document partagé
  | 'message_received'           // Message reçu
  | 'achievement_unlocked'       // Achievement déverrouillé
  | 'report_ready'               // Rapport prêt
  | 'ai_insight'                 // Insight IA
  | 'training_available'         // Formation disponible
  | 'policy_update'              // Mise à jour politique
  | 'security_alert'             // Alerte sécurité
  | 'budget_threshold'           // Seuil budget atteint
  | 'equipment_maintenance'      // Maintenance équipement
  | 'weather_alert'              // Alerte météo
  | 'traffic_incident'           // Incident trafic
  | 'inventory_low'              // Stock bas
  | 'quality_issue'              // Problème qualité
  | 'safety_hazard'              // Danger sécurité
  | 'customer_feedback'          // Feedback client
  | 'meeting_reminder'           // Rappel réunion
  | 'task_overdue'               // Tâche en retard
  | 'goal_achieved'              // Objectif atteint
  | 'milestone_reached'          // Jalon atteint
  | 'anniversary_celebration'    // Anniversaire
  | 'birthday_wish'              // Anniversaire
  | 'custom';                    // Personnalisé

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export interface NotificationAction {
  label: string;
  action: string; // endpoint API ou URL
  payload?: any;
  style?: 'primary' | 'secondary' | 'danger' | 'success';
}

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels?: NotificationChannel[];
  actions?: NotificationAction[];
  metadata?: any;
  expiresAt?: Date;
  context?: any; // Contexte additionnel pour IA
}

export interface NotificationDigest {
  id: string;
  userId: string;
  type: 'daily' | 'weekly';
  notifications: INotification[];
  summary: {
    total: number;
    byPriority: Record<string, number>;
    byType: Record<NotificationType, number>;
    unread: number;
  };
  generatedAt: Date;
  sentAt?: Date;
  read: boolean;
}

// Schémas Mongoose
const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  type: { 
    type: String, 
    enum: [
      'complaint_created', 'complaint_assigned', 'complaint_resolved', 'complaint_escalated',
      'team_assignment', 'deadline_approaching', 'high_priority_alert', 'system_maintenance',
      'performance_update', 'document_shared', 'message_received', 'achievement_unlocked',
      'report_ready', 'ai_insight', 'training_available', 'policy_update', 'security_alert',
      'budget_threshold', 'equipment_maintenance', 'weather_alert', 'traffic_incident',
      'inventory_low', 'quality_issue', 'safety_hazard', 'customer_feedback', 'meeting_reminder',
      'task_overdue', 'goal_achieved', 'milestone_reached', 'anniversary_celebration',
      'birthday_wish', 'custom'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  channels: [{ 
    type: String, 
    enum: ['email', 'sms', 'push', 'in_app'] 
  }],
  read: { type: Boolean, default: false, index: true },
  archived: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, index: true },
  actions: [{
    label: String,
    action: String,
    payload: Schema.Types.Mixed,
    style: { type: String, enum: ['primary', 'secondary', 'danger', 'success'] }
  }],
  metadata: Schema.Types.Mixed,
  aiScore: { type: Number, min: 0, max: 1 },
  deliveredChannels: [{
    channel: { type: String, enum: ['email', 'sms', 'push', 'in_app'] },
    status: { type: String, enum: ['pending', 'sent', 'failed'] },
    timestamp: Date,
    providerResponse: String,
    retryCount: { type: Number, default: 0 }
  }],
  digestBatchId: String
});

const NotificationPreferenceSchema = new Schema<INotificationPreference>({
  userId: { type: String, required: true, unique: true, index: true },
  channels: {
    email: {
      enabled: { type: Boolean, default: true },
      frequency: { 
        type: String, 
        enum: ['immediate', 'daily_digest', 'weekly_digest'],
        default: 'immediate'
      },
      time: String,
      template: String
    },
    sms: {
      enabled: { type: Boolean, default: false },
      priorityThreshold: { 
        type: String, 
        enum: ['medium', 'high', 'urgent'],
        default: 'high'
      },
      provider: { type: String, default: 'twilio' }
    },
    push: {
      enabled: { type: Boolean, default: true },
      quietHours: {
        start: { type: String, default: '22:00' },
        end: { type: String, default: '07:00' }
      },
      sound: { type: Boolean, default: true },
      vibration: { type: Boolean, default: true }
    },
    in_app: {
      enabled: { type: Boolean, default: true },
      badge: { type: Boolean, default: true },
      sound: { type: Boolean, default: false },
      autoDismiss: { type: Boolean, default: false },
      dismissTimeout: { type: Number, default: 0 }
    }
  },
  types: {
    type: Schema.Types.Mixed,
    default: {}
  },
  digestSettings: {
    daily: { type: Boolean, default: true },
    weekly: { type: Boolean, default: true },
    summaryOnly: { type: Boolean, default: false },
    preferredTime: {
      daily: { type: String, default: '09:00' },
      weekly: { type: String, default: '09:00' },
      timezone: { type: String, default: 'Europe/Paris' }
    }
  },
  aiSettings: {
    enablePersonalization: { type: Boolean, default: true },
    relevanceThreshold: { type: Number, default: 70, min: 0, max: 100 },
    learningRate: { type: Number, default: 50, min: 0, max: 100 },
    ignoreSimilar: { type: Boolean, default: false }
  },
  blacklist: {
    types: [{ type: String }],
    keywords: [{ type: String }],
    senders: [{ type: String }]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const NotificationDigestSchema = new Schema<NotificationDigest>({
  id: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ['daily', 'weekly'], required: true },
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  summary: {
    total: Number,
    byPriority: Schema.Types.Mixed,
    byType: Schema.Types.Mixed,
    unread: Number
  },
  generatedAt: { type: Date, default: Date.now },
  sentAt: Date,
  read: { type: Boolean, default: false }
});

// Index pour optimiser les requêtes
NotificationSchema.index({ userId: 1, read: 1, archived: 1 });
NotificationSchema.index({ userId: 1, priority: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
NotificationPreferenceSchema.index({ userId: 1 });
NotificationDigestSchema.index({ userId: 1, type: 1, generatedAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export const NotificationPreference = mongoose.model<INotificationPreference>('NotificationPreference', NotificationPreferenceSchema);
export const NotificationDigest = mongoose.model<NotificationDigest>('NotificationDigest', NotificationDigestSchema);
```

---

## 4. 📄 SERVICES DE NOTIFICATION

### 📄 `backend/src/services/notificationService.ts`
```typescript
import { 
  Notification, 
  NotificationPreference, 
  INotification, 
  NotificationPayload,
  NotificationDigest
} from '../models/Notification';
import { EmailService } from './emailService';
import { SMSService } from './smsService';
import { PushService } from './pushService';
import { AINotificationService } from './aiNotificationService';
import Queue from 'bull';
import redis from 'redis';

export class NotificationService {
  private emailService: EmailService;
  private smsService: SMSService;
  private pushService: PushService;
  private aiService: AINotificationService;
  private notificationQueue: Queue.Queue;
  private redisClient: redis.RedisClientType;

  constructor() {
    this.emailService = new EmailService();
    this.smsService = new SMSService();
    this.pushService = new PushService();
    this.aiService = new AINotificationService();
    
    // Initialiser la queue Redis
    this.notificationQueue = new Queue('notifications', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    });

    // Initialiser Redis client
    this.redisClient = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    });

    // Processus de la queue
    this.setupQueueProcessing();
  }

  // Créer et envoyer une notification
  async createNotification(payload: NotificationPayload): Promise<INotification> {
    try {
      // 1. Vérifier les préférences utilisateur
      const preferences = await this.getUserPreferences(payload.userId);
      if (!preferences) {
        throw new Error('Préférences utilisateur non trouvées');
      }

      // 2. Appliquer les filtres de blacklist
      if (this.isBlacklisted(payload, preferences)) {
        console.log('Notification blacklistée, ignorée');
        throw new Error('Notification blacklistée');
      }

      // 3. Appliquer l'intelligence artificielle
      const aiScore = await this.aiService.calculateRelevance(payload, preferences);
      
      // 4. Vérifier le seuil de pertinence
      if (aiScore < (preferences.aiSettings?.relevanceThreshold || 70) / 100) {
        console.log(`Score IA trop bas (${aiScore}), notification ignorée`);
        throw new Error('Score IA insuffisant');
      }

      // 5. Déterminer les canaux à utiliser
      const channels = this.determineChannels(payload, preferences);

      // 6. Créer la notification en base
      const notification = new Notification({
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        priority: payload.priority,
        channels,
        actions: payload.actions,
        metadata: payload.metadata,
        aiScore,
        expiresAt: payload.expiresAt,
        deliveredChannels: channels.map(channel => ({
          channel,
          status: 'pending',
          timestamp: new Date(),
          retryCount: 0
        }))
      });

      const savedNotification = await notification.save();

      // 7. Ajouter à la queue pour envoi asynchrone
      await this.notificationQueue.add('send_notification', {
        notificationId: savedNotification._id.toString(),
        payload,
        preferences
      }, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        },
        priority: this.getQueuePriority(payload.priority)
      });

      return savedNotification;
    } catch (error) {
      console.error('Erreur création notification:', error);
      throw error;
    }
  }

  // Envoyer une notification immédiatement
  async sendImmediateNotification(notificationId: string): Promise<void> {
    try {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        throw new Error('Notification non trouvée');
      }

      const preferences = await this.getUserPreferences(notification.userId);
      if (!preferences) {
        throw new Error('Préférences utilisateur non trouvées');
      }

      // Vérifier si l'envoi est dans les heures calmes
      if (this.isQuietHours(preferences.channels.push.quietHours)) {
        console.log('Heures calmes, report de l\'envoi push');
        // Reporter l'envoi
        await this.scheduleDelayedSend(notificationId, 'push');
        return;
      }

      // Envoyer via chaque canal
      for (const channel of notification.channels) {
        try {
          await this.sendViaChannel(notification, channel, preferences);
          
          // Mettre à jour le statut de livraison
          await Notification.findByIdAndUpdate(notificationId, {
            $set: {
              'deliveredChannels.$[elem].status': 'sent',
              'deliveredChannels.$[elem].timestamp': new Date()
            }
          }, {
            arrayFilters: [{ 'elem.channel': channel }]
          });

        } catch (error) {
          console.error(`Erreur envoi via ${channel}:`, error);
          
          // Mettre à jour le statut d'échec
          await Notification.findByIdAndUpdate(notificationId, {
            $set: {
              'deliveredChannels.$[elem].status': 'failed',
              'deliveredChannels.$[elem].timestamp': new Date(),
              'deliveredChannels.$[elem].providerResponse': error.message
            }
          }, {
            arrayFilters: [{ 'elem.channel': channel }]
          });

          // Réessayer si nécessaire
          const channelInfo = notification.deliveredChannels?.find(c => c.channel === channel);
          if (channelInfo && channelInfo.retryCount < 3) {
            await this.scheduleRetry(notificationId, channel, channelInfo.retryCount + 1);
          }
        }
      }
    } catch (error) {
      console.error('Erreur envoi notification immédiate:', error);
      throw error;
    }
  }

  // Envoyer via un canal spécifique
  private async sendViaChannel(
    notification: INotification, 
    channel: string, 
    preferences: any
  ): Promise<void> {
    switch(channel) {
      case 'email':
        if (preferences.channels.email.enabled) {
          await this.emailService.sendEmail({
            to: notification.userId, // À adapter avec l'email réel
            subject: notification.title,
            template: preferences.channels.email.template || 'default',
            data: {
              title: notification.title,
              message: notification.message,
              actions: notification.actions,
              priority: notification.priority
            }
          });
        }
        break;

      case 'sms':
        if (preferences.channels.sms.enabled) {
          const priorityThreshold = preferences.channels.sms.priorityThreshold;
          if (this.shouldSendSMS(notification.priority, priorityThreshold)) {
            await this.smsService.sendSMS({
              to: notification.userId, // À adapter avec le numéro réel
              message: `${notification.title}: ${notification.message.substring(0, 160)}`,
              priority: notification.priority
            });
          }
        }
        break;

      case 'push':
        if (preferences.channels.push.enabled) {
          await this.pushService.sendPush({
            userId: notification.userId,
            title: notification.title,
            body: notification.message,
            data: {
              notificationId: notification._id.toString(),
              actions: notification.actions
            },
            sound: preferences.channels.push.sound,
            vibration: preferences.channels.push.vibration
          });
        }
        break;

      case 'in_app':
        if (preferences.channels.in_app.enabled) {
          // La notification in-app est déjà en base
          // Elle sera récupérée par le frontend
          console.log('Notification in-app créée:', notification._id);
        }
        break;

      default:
        console.warn('Canal de notification inconnu:', channel);
    }
  }

  // Créer un digest de notifications
  async createDigest(userId: string, type: 'daily' | 'weekly'): Promise<NotificationDigest> {
    try {
      const cutoffDate = new Date();
      if (type === 'daily') {
        cutoffDate.setDate(cutoffDate.getDate() - 1);
      } else {
        cutoffDate.setDate(cutoffDate.getDate() - 7);
      }

      // Récupérer les notifications non lues
      const notifications = await Notification.find({
        userId,
        read: false,
        createdAt: { $gte: cutoffDate }
      }).sort({ priority: -1, createdAt: -1 });

      if (notifications.length === 0) {
        throw new Error('Aucune notification à inclure dans le digest');
      }

      // Calculer le résumé
      const summary = this.calculateDigestSummary(notifications);

      // Créer le digest
      const digest = new NotificationDigest({
        id: `digest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type,
        notifications: notifications.map(n => n._id),
        summary,
        generatedAt: new Date(),
        read: false
      });

      const savedDigest = await digest.save();

      // Envoyer le digest selon les préférences
      const preferences = await this.getUserPreferences(userId);
      if (preferences && preferences.digestSettings[type]) {
        await this.sendDigest(savedDigest, preferences);
      }

      return savedDigest;
    } catch (error) {
      console.error('Erreur création digest:', error);
      throw error;
    }
  }

  // Récupérer les notifications d'un utilisateur
  async getUserNotifications(
    userId: string, 
    options: {
      limit?: number;
      offset?: number;
      read?: boolean;
      archived?: boolean;
      priority?: string[];
      types?: string[];
    } = {}
  ): Promise<{ notifications: INotification[]; total: number }> {
    try {
      const {
        limit = 20,
        offset = 0,
        read,
        archived,
        priority,
        types
      } = options;

      const query: any = { userId };

      if (read !== undefined) query.read = read;
      if (archived !== undefined) query.archived = archived;
      if (priority && priority.length > 0) query.priority = { $in: priority };
      if (types && types.length > 0) query.type = { $in: types };

      const [notifications, total] = await Promise.all([
        Notification.find(query)
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(offset),
        Notification.countDocuments(query)
      ]);

      return { notifications, total };
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      throw error;
    }
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { 
          read: true, 
          updatedAt: new Date() 
        },
        { new: true }
      );

      return notification;
    } catch (error) {
      console.error('Erreur marquage notification lue:', error);
      throw error;
    }
  }

  // Archiver une notification
  async archiveNotification(notificationId: string, userId: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { 
          archived: true, 
          updatedAt: new Date() 
        },
        { new: true }
      );

      return notification;
    } catch (error) {
      console.error('Erreur archivage notification:', error);
      throw error;
    }
  }

  // Récupérer les préférences utilisateur
  async getUserPreferences(userId: string): Promise<any> {
    try {
      let preferences = await NotificationPreference.findOne({ userId });
      
      if (!preferences) {
        // Créer des préférences par défaut
        preferences = await this.createDefaultPreferences(userId);
      }

      return preferences;
    } catch (error) {
      console.error('Erreur récupération préférences:', error);
      throw error;
    }
  }

  // Mettre à jour les préférences utilisateur
  async updateUserPreferences(userId: string, updates: any): Promise<any> {
    try {
      const preferences = await NotificationPreference.findOneAndUpdate(
        { userId },
        { 
          ...updates,
          updatedAt: new Date() 
        },
        { new: true, upsert: true }
      );

      return preferences;
    } catch (error) {
      console.error('Erreur mise à jour préférences:', error);
      throw error;
    }
  }

  // Méthodes utilitaires privées
  private async createDefaultPreferences(userId: string): Promise<any> {
    const defaultPreferences = new NotificationPreference({
      userId,
      channels: {
        email: {
          enabled: true,
          frequency: 'immediate',
          time: '09:00'
        },
        sms: {
          enabled: false,
          priorityThreshold: 'high',
          provider: 'twilio'
        },
        push: {
          enabled: true,
          quietHours: {
            start: '22:00',
            end: '07:00'
          },
          sound: true,
          vibration: true
        },
        in_app: {
          enabled: true,
          badge: true,
          sound: false,
          autoDismiss: false,
          dismissTimeout: 0
        }
      },
      types: this.getDefaultTypePreferences(),
      digestSettings: {
        daily: true,
        weekly: true,
        summaryOnly: false,
        preferredTime: {
          daily: '09:00',
          weekly: '09:00',
          timezone: 'Europe/Paris'
        }
      },
      aiSettings: {
        enablePersonalization: true,
        relevanceThreshold: 70,
        learningRate: 50,
        ignoreSimilar: false
      },
      blacklist: {
        types: [],
        keywords: [],
        senders: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return await defaultPreferences.save();
  }

  private getDefaultTypePreferences(): Record<string, boolean> {
    const types: NotificationType[] = [
      'complaint_created', 'complaint_assigned', 'complaint_resolved',
      'team_assignment', 'deadline_approaching', 'high_priority_alert',
      'achievement_unlocked', 'message_received', 'document_shared'
    ];

    const preferences: Record<string, boolean> = {};
    types.forEach(type => {
      preferences[type] = true;
    });

    return preferences;
  }

  private isBlacklisted(payload: NotificationPayload, preferences: any): boolean {
    // Vérifier les types blacklistés
    if (preferences.blacklist.types.includes(payload.type)) {
      return true;
    }

    // Vérifier les mots-clés blacklistés
    const messageLower = (payload.message || '').toLowerCase();
    const titleLower = (payload.title || '').toLowerCase();
    
    for (const keyword of preferences.blacklist.keywords) {
      if (messageLower.includes(keyword.toLowerCase()) || 
          titleLower.includes(keyword.toLowerCase())) {
        return true;
      }
    }

    // Vérifier les expéditeurs blacklistés
    if (payload.metadata?.senderId && 
        preferences.blacklist.senders.includes(payload.metadata.senderId)) {
      return true;
    }

    return false;
  }

  private determineChannels(payload: NotificationPayload, preferences: any): string[] {
    const channels: string[] = [];

    // Si des canaux sont spécifiés dans le payload, les utiliser
    if (payload.channels && payload.channels.length > 0) {
      return payload.channels;
    }

    // Sinon, utiliser les préférences utilisateur
    if (preferences.channels.email.enabled) channels.push('email');
    if (preferences.channels.sms.enabled) channels.push('sms');
    if (preferences.channels.push.enabled) channels.push('push');
    if (preferences.channels.in_app.enabled) channels.push('in_app');

    return channels;
  }

  private isQuietHours(quietHours: { start: string; end: string }): boolean {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMinute] = quietHours.start.split(':').map(Number);
    const [endHour, endMinute] = quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    // Gérer le cas où les heures calmes traversent minuit
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }

  private shouldSendSMS(priority: string, threshold: string): boolean {
    const priorityLevels: Record<string, number> = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'urgent': 4
    };

    const priorityLevel = priorityLevels[priority] || 2;
    const thresholdLevel = priorityLevels[threshold] || 3;

    return priorityLevel >= thresholdLevel;
  }

  private getQueuePriority(priority: string): number {
    const priorities: Record<string, number> = {
      'low': 3,
      'medium': 2,
      'high': 1,
      'urgent': 0
    };

    return priorities[priority] || 2;
  }

  private setupQueueProcessing(): void {
    this.notificationQueue.process('send_notification', async (job) => {
      const { notificationId, payload, preferences } = job.data;
      
      try {
        await this.sendImmediateNotification(notificationId);
        return { success: true, notificationId };
      } catch (error) {
        console.error('Erreur traitement queue notification:', error);
        throw error;
      }
    });

    this.notificationQueue.process('send_digest', async (job) => {
      const { digestId, userId, preferences } = job.data;
      
      try {
        const digest = await NotificationDigest.findById(digestId);
        if (digest) {
          await this.sendDigest(digest, preferences);
          return { success: true, digestId };
        }
        throw new Error('Digest non trouvé');
      } catch (error) {
        console.error('Erreur traitement queue digest:', error);
        throw error;
      }
    });
  }

  private async scheduleDelayedSend(notificationId: string, channel: string): Promise<void> {
    // Programmer un envoi différé
    setTimeout(async () => {
      try {
        const notification = await Notification.findById(notificationId);
        if (notification) {
          const preferences = await this.getUserPreferences(notification.userId);
          await this.sendViaChannel(notification, channel, preferences);
        }
      } catch (error) {
        console.error('Erreur envoi différé:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes
  }

  private async scheduleRetry(notificationId: string, channel: string, retryCount: number): Promise<void> {
    const delay = Math.pow(2, retryCount) * 60 * 1000; // Exponential backoff
    
    setTimeout(async () => {
      try {
        const notification = await Notification.findById(notificationId);
        if (notification) {
          const preferences = await this.getUserPreferences(notification.userId);
          await this.sendViaChannel(notification, channel, preferences);
        }
      } catch (error) {
        console.error('Erreur retry:', error);
      }
    }, delay);
  }

  private calculateDigestSummary(notifications: INotification[]): any {
    const summary: any = {
      total: notifications.length,
      byPriority: {},
      byType: {},
      unread: notifications.filter(n => !n.read).length
    };

    notifications.forEach(notification => {
      // Compter par priorité
      summary.byPriority[notification.priority] = 
        (summary.byPriority[notification.priority] || 0) + 1;

      // Compter par type
      summary.byType[notification.type] = 
        (summary.byType[notification.type] || 0) + 1;
    });

    return summary;
  }

  private async sendDigest(digest: any, preferences: any): Promise<void> {
    // Envoyer le digest selon les préférences utilisateur
    if (preferences.channels.email.enabled) {
      await this.emailService.sendEmail({
        to: digest.userId, // À adapter avec l'email réel
        subject: `Résumé ${digest.type} de vos notifications`,
        template: 'digest',
        data: {
          summary: digest.summary,
          notifications: await Notification.find({
            _id: { $in: digest.notifications }
          }).limit(10) // Limiter à 10 notifications dans le digest
        }
      });
    }
  }
}

export default new NotificationService();
```

---

## 5. 📄 SERVICES SPÉCIALISÉS

### 📄 `backend/src/services/emailService.ts`
```typescript
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: any;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private templateDir: string;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    this.templateDir = path.join(__dirname, '../templates/notificationTemplates/email');
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const templatePath = path.join(this.templateDir, `${options.template}.hbs`);
      
      // Vérifier si le template existe
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template email non trouvé: ${options.template}`);
      }

      // Compiler le template
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);
      const html = template(options.data);

      // Envoyer l'email
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@reclamtrack.com',
        to: options.to,
        subject: options.subject,
        html: html,
        attachments: options.attachments?.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType
        }))
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email envoyé:', info.messageId);
    } catch (error) {
      console.error('Erreur envoi email:', error);
      throw error;
    }
  }

  async sendBulkEmail(emails: EmailOptions[]): Promise<void> {
    try {
      const promises = emails.map(email => this.sendEmail(email));
      await Promise.all(promises);
      console.log(`${emails.length} emails envoyés avec succès`);
    } catch (error) {
      console.error('Erreur envoi emails en masse:', error);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Serveur email connecté avec succès');
      return true;
    } catch (error) {
      console.error('Erreur connexion serveur email:', error);
      return false;
    }
  }
}
```

### 📄 `backend/src/services/smsService.ts`
```typescript
import twilio from 'twilio';

interface SMSOptions {
  to: string;
  message: string;
  priority: string;
  mediaUrl?: string;
}

export class SMSService {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';
  }

  async sendSMS(options: SMSOptions): Promise<void> {
    try {
      if (!this.fromNumber) {
        throw new Error('Numéro Twilio non configuré');
      }

      const messageOptions: any = {
        body: this.formatMessage(options.message, options.priority),
        from: this.fromNumber,
        to: options.to
      };

      if (options.mediaUrl) {
        messageOptions.mediaUrl = [options.mediaUrl];
      }

      const message = await this.client.messages.create(messageOptions);
      console.log('SMS envoyé:', message.sid);
    } catch (error) {
      console.error('Erreur envoi SMS:', error);
      throw error;
    }
  }

  private formatMessage(message: string, priority: string): string {
    const priorityPrefix = this.getPriorityEmoji(priority);
    return `${priorityPrefix} ${message.substring(0, 160 - priorityPrefix.length - 1)}`;
  }

  private getPriorityEmoji(priority: string): string {
    switch(priority) {
      case 'urgent': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔔';
      case 'low': return 'ℹ️';
      default: return '📢';
    }
  }

  async getBalance(): Promise<any> {
    try {
      const balance = await this.client.balance.fetch();
      return {
        currency: balance.currency,
        balance: balance.balance,
        incomingPhoneNumbers: balance.incomingPhoneNumbers
      };
    } catch (error) {
      console.error('Erreur récupération solde SMS:', error);
      throw error;
    }
  }
}
```

### 📄 `backend/src/services/pushService.ts`
```typescript
import admin from 'firebase-admin';
import path from 'path';

interface PushOptions {
  userId: string;
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  vibration?: boolean;
  channelId?: string;
}

export class PushService {
  constructor() {
    // Initialiser Firebase Admin SDK
    if (!admin.apps.length) {
      const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
  }

  async sendPush(options: PushOptions): Promise<void> {
    try {
      // Récupérer le token FCM de l'utilisateur (à implémenter selon votre système)
      const fcmToken = await this.getUserFCMToken(options.userId);
      if (!fcmToken) {
        console.log('Aucun token FCM trouvé pour l\'utilisateur:', options.userId);
        return;
      }

      const message: admin.messaging.Message = {
        token: fcmToken,
        notification: {
          title: options.title,
          body: options.body
        },
        data: {
          ...options.data,
          timestamp: new Date().toISOString()
        },
        android: {
          notification: {
            sound: options.sound ? 'default' : undefined,
            channelId: options.channelId || 'default_channel'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: options.sound ? 'default' : undefined,
              badge: options.data?.badgeCount || 1
            }
          }
        }
      };

      const response = await admin.messaging().send(message);
      console.log('Notification push envoyée:', response);
    } catch (error) {
      console.error('Erreur envoi notification push:', error);
      throw error;
    }
  }

  async sendMulticastPush(userIds: string[], options: PushOptions): Promise<void> {
    try {
      const tokens: string[] = [];
      
      // Récupérer tous les tokens FCM
      for (const userId of userIds) {
        const token = await this.getUserFCMToken(userId);
        if (token) {
          tokens.push(token);
        }
      }

      if (tokens.length === 0) {
        console.log('Aucun token FCM trouvé pour les utilisateurs');
        return;
      }

      const message: admin.messaging.MulticastMessage = {
        tokens: tokens,
        notification: {
          title: options.title,
          body: options.body
        },
        data: {
          ...options.data,
          timestamp: new Date().toISOString()
        }
      };

      const response = await admin.messaging().sendMulticast(message);
      console.log(`Notifications push envoyées: ${response.successCount}/${response.total}`);
    } catch (error) {
      console.error('Erreur envoi notifications push multicast:', error);
      throw error;
    }
  }

  async subscribeToTopic(userId: string, topic: string): Promise<void> {
    try {
      const fcmToken = await this.getUserFCMToken(userId);
      if (fcmToken) {
        await admin.messaging().subscribeToTopic(fcmToken, topic);
        console.log(`Utilisateur ${userId} abonné au topic ${topic}`);
      }
    } catch (error) {
      console.error('Erreur abonnement topic:', error);
      throw error;
    }
  }

  async unsubscribeFromTopic(userId: string, topic: string): Promise<void> {
    try {
      const fcmToken = await this.getUserFCMToken(userId);
      if (fcmToken) {
        await admin.messaging().unsubscribeFromTopic(fcmToken, topic);
        console.log(`Utilisateur ${userId} désabonné du topic ${topic}`);
      }
    } catch (error) {
      console.error('Erreur désabonnement topic:', error);
      throw error;
    }
  }

  private async getUserFCMToken(userId: string): Promise<string | null> {
    // Implémenter selon votre système de stockage des tokens
    // Par exemple, requête à votre base de données
    try {
      // Exemple de requête MongoDB
      // const user = await User.findById(userId);
      // return user?.fcmToken || null;
      
      // Pour l'instant, retourner null (à implémenter)
      return null;
    } catch (error) {
      console.error('Erreur récupération token FCM:', error);
      return null;
    }
  }
}
```

### 📄 `backend/src/services/aiNotificationService.ts`
```typescript
import { NotificationPayload } from '../models/Notification';

interface UserNotificationHistory {
  userId: string;
  notificationTypes: Record<string, {
    count: number;
    lastSeen: Date;
    interactionRate: number; // 0-1
  }>;
  preferredTimes: {
    morning: number; // 6h-12h
    afternoon: number; // 12h-18h
    evening: number; // 18h-24h
    night: number; // 0h-6h
  };
  ignoredNotifications: string[]; // IDs des notifications ignorées
  engagementScore: number; // 0-100
}

export class AINotificationService {
  private userHistories: Map<string, UserNotificationHistory> = new Map();

  async calculateRelevance(
    payload: NotificationPayload, 
    preferences: any
  ): Promise<number> {
    try {
      const userId = payload.userId;
      const history = this.getUserHistory(userId);
      
      // Facteur 1: Historique d'interaction (40% du score)
      const historyScore = this.calculateHistoryScore(history, payload.type);
      
      // Facteur 2: Contexte temporel (20% du score)
      const timeScore = this.calculateTimeScore(history, payload);
      
      // Facteur 3: Contenu et priorité (25% du score)
      const contentScore = this.calculateContentScore(payload);
      
      // Facteur 4: Préférences utilisateur (15% du score)
      const preferenceScore = this.calculatePreferenceScore(preferences, payload.type);
      
      // Score final pondéré
      const finalScore = (
        historyScore * 0.4 +
        timeScore * 0.2 +
        contentScore * 0.25 +
        preferenceScore * 0.15
      );

      // Appliquer le learning rate
      const learningRate = (preferences.aiSettings?.learningRate || 50) / 100;
      const adjustedScore = this.applyLearningRate(finalScore, history, payload);

      // Sauvegarder l'historique mis à jour
      await this.updateUserHistory(userId, payload.type, adjustedScore);

      return Math.min(1, Math.max(0, adjustedScore));
    } catch (error) {
      console.error('Erreur calcul pertinence IA:', error);
      return 0.5; // Score neutre en cas d'erreur
    }
  }

  async getOptimalSendTime(userId: string, notificationType: string): Promise<Date> {
    const history = this.getUserHistory(userId);
    
    // Déterminer la meilleure période d'envoi
    const periods = history.preferredTimes;
    const bestPeriod = Object.entries(periods)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Créer une date dans la meilleure période
    const now = new Date();
    let optimalTime = new Date(now);

    switch(bestPeriod) {
      case 'morning':
        optimalTime.setHours(9, 0, 0, 0);
        break;
      case 'afternoon':
        optimalTime.setHours(14, 0, 0, 0);
        break;
      case 'evening':
        optimalTime.setHours(19, 0, 0, 0);
        break;
      case 'night':
        optimalTime.setDate(optimalTime.getDate() + 1);
        optimalTime.setHours(8, 0, 0, 0);
        break;
    }

    // Si l'heure optimale est déjà passée, programmer pour demain
    if (optimalTime < now) {
      optimalTime.setDate(optimalTime.getDate() + 1);
    }

    return optimalTime;
  }

  async shouldIgnoreSimilar(userId: string, payload: NotificationPayload): Promise<boolean> {
    if (!this.userHistories.has(userId)) return false;

    const history = this.userHistories.get(userId)!;
    
    // Si l'utilisateur ignore les notifications similaires
    if (history.ignoredNotifications.includes(payload.type)) {
      return true;
    }

    // Vérifier si une notification similaire a été envoyée récemment
    const recentNotifications = history.notificationTypes[payload.type];
    if (recentNotifications) {
      const timeSinceLast = Date.now() - recentNotifications.lastSeen.getTime();
      const hoursSinceLast = timeSinceLast / (1000 * 60 * 60);
      
      // Si moins de 2 heures et interaction rate < 30%
      if (hoursSinceLast < 2 && recentNotifications.interactionRate < 0.3) {
        return true;
      }
    }

    return false;
  }

  private getUserHistory(userId: string): UserNotificationHistory {
    if (!this.userHistories.has(userId)) {
      this.userHistories.set(userId, {
        userId,
        notificationTypes: {},
        preferredTimes: {
          morning: 0.5,
          afternoon: 0.5,
          evening: 0.5,
          night: 0.5
        },
        ignoredNotifications: [],
        engagementScore: 50
      });
    }

    return this.userHistories.get(userId)!;
  }

  private calculateHistoryScore(history: UserNotificationHistory, type: string): number {
    const typeHistory = history.notificationTypes[type];
    if (!typeHistory) return 0.5; // Score neutre

    // Score basé sur le taux d'interaction
    return typeHistory.interactionRate;
  }

  private calculateTimeScore(history: UserNotificationHistory, payload: NotificationPayload): number {
    const now = new Date();
    const hour = now.getHours();
    
    // Déterminer la période actuelle
    let currentPeriod: keyof typeof history.preferredTimes;
    if (hour >= 6 && hour < 12) {
      currentPeriod = 'morning';
    } else if (hour >= 12 && hour < 18) {
      currentPeriod = 'afternoon';
    } else if (hour >= 18 && hour < 24) {
      currentPeriod = 'evening';
    } else {
      currentPeriod = 'night';
    }

    // Score basé sur les préférences temporelles
    return history.preferredTimes[currentPeriod];
  }

  private calculateContentScore(payload: NotificationPayload): number {
    let score = 0.5; // Score de base

    // Boost pour la priorité
    switch(payload.priority) {
      case 'urgent': score += 0.3; break;
      case 'high': score += 0.2; break;
      case 'medium': score += 0.1; break;
    }

    // Boost pour les actions disponibles
    if (payload.actions && payload.actions.length > 0) {
      score += 0.1;
    }

    // Pénalité pour les notifications expirées
    if (payload.expiresAt && payload.expiresAt < new Date()) {
      score -= 0.5;
    }

    return Math.min(1, Math.max(0, score));
  }

  private calculatePreferenceScore(preferences: any, type: string): number {
    // Vérifier si le type est activé dans les préférences
    if (preferences.types && preferences.types[type] === false) {
      return 0;
    }

    // Vérifier la blacklist
    if (preferences.blacklist && preferences.blacklist.types.includes(type)) {
      return 0;
    }

    return 1; // Autorisé par défaut
  }

  private applyLearningRate(score: number, history: UserNotificationHistory, payload: NotificationPayload): number {
    // Ajuster le score basé sur l'engagement général de l'utilisateur
    const engagementFactor = history.engagementScore / 100;
    return score * (0.7 + 0.3 * engagementFactor); // 70-100% du score original
  }

  private async updateUserHistory(userId: string, type: string, interactionScore: number): Promise<void> {
    const history = this.getUserHistory(userId);
    
    // Mettre à jour les statistiques du type
    if (!history.notificationTypes[type]) {
      history.notificationTypes[type] = {
        count: 0,
        lastSeen: new Date(),
        interactionRate: 0
      };
    }

    const typeStats = history.notificationTypes[type];
    typeStats.count += 1;
    typeStats.lastSeen = new Date();
    
    // Calculer le nouveau taux d'interaction
    const totalInteractions = typeStats.count * typeStats.interactionRate + interactionScore;
    typeStats.interactionRate = totalInteractions / (typeStats.count + 1);

    // Mettre à jour les préférences temporelles
    const now = new Date();
    const hour = now.getHours();
    let period: keyof typeof history.preferredTimes;
    
    if (hour >= 6 && hour < 12) {
      period = 'morning';
    } else if (hour >= 12 && hour < 18) {
      period = 'afternoon';
    } else if (hour >= 18 && hour < 24) {
      period = 'evening';
    } else {
      period = 'night';
    }

    // Ajuster la préférence temporelle
    history.preferredTimes[period] = Math.min(1, history.preferredTimes[period] + 0.05 * interactionScore);