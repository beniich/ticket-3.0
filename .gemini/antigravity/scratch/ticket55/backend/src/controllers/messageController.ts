import { Request, Response } from 'express';
import messageService from '../services/messageService.js';
import { Message, Thread } from '../models/Message.js';
import { User } from '../models/User.js';

export class MessageController {
    // Créer un nouveau fil de discussion
    static async createThread(req: Request, res: Response) {
        try {
            const { participants, title } = req.body;
            const userId = (req.user as any)?.id;

            if (!participants || !Array.isArray(participants)) {
                return res.status(400).json({ error: 'Participants requis' });
            }

            const thread = await messageService.createThread(participants, title, userId);
            res.status(201).json(thread);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Envoyer un message
    static async sendMessage(req: Request, res: Response) {
        try {
            const { threadId, content, attachments, replyTo, mentions } = req.body;
            const userId = (req.user as any)?.id;

            // Fetch user to get name
            const user = await User.findById(userId);
            const userName = user ? user.email.split('@')[0] : 'Utilisateur';

            if (!threadId || !content) {
                return res.status(400).json({ error: 'threadId et content requis' });
            }

            // Vérifier que l'utilisateur fait partie du thread
            const thread = await Thread.findOne({
                _id: threadId,
                'participants.id': userId
            });

            if (!thread) {
                return res.status(403).json({ error: 'Accès refusé au thread' });
            }

            const message = await messageService.sendMessage(
                threadId,
                userId,
                userName,
                content,
                attachments,
                replyTo,
                mentions
            );

            // Émettre via WebSocket
            req.app.get('io').emit(`thread:${threadId}:new_message`, message);

            res.status(201).json(message);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer les fils de discussion
    static async getUserThreads(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const limit = parseInt(req.query.limit as string) || 20;

            const threads = await messageService.getUserThreads(userId, limit);
            res.json(threads);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Récupérer les messages d'un fil
    static async getThreadMessages(req: Request, res: Response) {
        try {
            const { threadId } = req.params;
            const userId = (req.user as any)?.id;
            const limit = parseInt(req.query.limit as string) || 50;
            const before = req.query.before ? new Date(req.query.before as string) : undefined;

            const messages = await messageService.getThreadMessages(threadId, userId, limit, before);
            res.json(messages);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Marquer comme lu
    static async markAsRead(req: Request, res: Response) {
        try {
            const { threadId } = req.params;
            const userId = (req.user as any)?.id;

            await messageService.markMessagesAsRead(threadId, userId);

            // Émettre via WebSocket
            req.app.get('io').emit(`thread:${threadId}:read`, { userId, threadId });

            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Ajouter une réaction
    static async addReaction(req: Request, res: Response) {
        try {
            const { messageId, emoji } = req.body;
            const userId = (req.user as any)?.id;

            const message = await messageService.addReaction(messageId, userId, emoji);

            if (message) {
                // Émettre via WebSocket
                req.app.get('io').emit(`message:${messageId}:reaction_added`, {
                    userId,
                    emoji,
                    messageId
                });
                res.json(message);
            } else {
                res.status(404).json({ error: 'Message non trouvé' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Supprimer une réaction
    static async removeReaction(req: Request, res: Response) {
        try {
            const { messageId, emoji } = req.body;
            const userId = (req.user as any)?.id;

            const message = await messageService.removeReaction(messageId, userId, emoji);

            if (message) {
                // Émettre via WebSocket
                req.app.get('io').emit(`message:${messageId}:reaction_removed`, {
                    userId,
                    emoji,
                    messageId
                });
                res.json(message);
            } else {
                res.status(404).json({ error: 'Message non trouvé' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Rechercher des messages
    static async searchMessages(req: Request, res: Response) {
        try {
            const { q } = req.query;
            const userId = (req.user as any)?.id;
            const limit = parseInt(req.query.limit as string) || 20;

            if (!q || typeof q !== 'string') {
                return res.status(400).json({ error: 'Query parameter "q" requis' });
            }

            const messages = await messageService.searchMessages(userId, q, limit);
            res.json(messages);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Compter les messages non lus
    static async getUnreadCount(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const count = await messageService.getUnreadCount(userId);
            res.json({ count });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Créer ou récupérer un thread direct
    static async getOrCreateDirectThread(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            const currentUserId = (req.user as any)?.id;

            const thread = await messageService.getOrCreateDirectThread(currentUserId, userId);
            res.json(thread);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
