import { Request, Response } from 'express';
import alertService from '../services/alertService.js';
import Alert from '../models/Alert.js';

export class AlertController {
    // Récupérer les alertes d'un utilisateur
    static async getUserAlerts(req: Request, res: Response) {
        try {
            const userId = req.user!.id; // Changed userId to id as per my auth middleware
            const {
                limit = 20,
                offset = 0,
                acknowledged,
                severity,
                type
            } = req.query;

            const options = {
                limit: parseInt(limit as string),
                offset: parseInt(offset as string),
                acknowledged: acknowledged === 'true',
                severity: severity as string,
                type: type as string
            };

            const result = await alertService.getUserAlerts(userId, options);

            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Marquer une alerte comme acquittée
    static async acknowledgeAlert(req: Request, res: Response) {
        try {
            const { alertId } = req.params;
            const userId = req.user!.id;

            const alert = await alertService.acknowledgeAlert(alertId, userId);

            if (!alert) {
                return res.status(404).json({ error: 'Alerte non trouvée' });
            }

            res.json({ success: true, alert });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Résoudre une alerte
    static async resolveAlert(req: Request, res: Response) {
        try {
            const { alertId } = req.params;
            const userId = req.user!.id;

            const alert = await alertService.resolveAlert(alertId, userId);

            if (!alert) {
                return res.status(404).json({ error: 'Alerte non trouvée' });
            }

            res.json({ success: true, alert });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Créer une alerte personnalisée
    static async createCustomAlert(req: Request, res: Response) {
        try {
            const alertData = req.body;
            const userId = req.user!.id;

            // Vérifier permissions admin pour alertes personnalisées
            if (alertData.type === 'custom' && req.user!.role !== 'admin') {
                return res.status(403).json({ error: 'Accès refusé' });
            }

            const alert = await alertService.createAlert({
                ...alertData,
                recipients: alertData.recipients || [userId]
            });

            res.status(201).json({ success: true, alert });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Statistiques des alertes
    static async getAlertStats(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const stats = await alertService.getAlertStats(userId);

            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Actions sur les alertes
    static async executeAlertAction(req: Request, res: Response) {
        try {
            const { alertId, actionIndex } = req.params;
            const userId = req.user!.id;

            const alert = await Alert.findOne({
                _id: alertId,
                recipients: userId
            });

            if (!alert) {
                return res.status(404).json({ error: 'Alerte non trouvée' });
            }

            if (!alert.actions || alert.actions.length <= parseInt(actionIndex)) {
                return res.status(400).json({ error: 'Action non disponible' });
            }

            const action = alert.actions[parseInt(actionIndex)];

            // Ici vous pouvez exécuter l'action (appeler un endpoint API, etc.)
            // Pour l'exemple, on retourne simplement les détails de l'action
            res.json({
                success: true,
                action: action,
                message: `Action "${action.label}" exécutée avec succès`
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
