import { Request, Response } from 'express';
import mcpNotificationService from '../services/mcpNotificationService.js';

export class MCPNotificationController {
    // Créer une notification intelligente
    static async createSmartNotification(req: Request, res: Response) {
        try {
            const payload = req.body;
            const userId = req.user!.id;

            // S'assurer que le userId du payload est celui du créateur ou un destinataire spécifique
            payload.userId = payload.userId || userId;

            const result = await mcpNotificationService.createSmartNotification(payload);

            if (result.ignored) {
                return res.status(202).json({
                    message: "Notification filtrée par l'intelligence contextuelle",
                    decision: result.decision
                });
            }

            res.status(201).json({
                success: true,
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
            const userId = req.user!.id;

            const result = await mcpNotificationService.createSmartDigest(userId, type as any);

            res.json({
                success: true,
                ...result
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
