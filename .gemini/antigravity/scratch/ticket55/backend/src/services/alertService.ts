import Alert, { IAlert } from '../models/Alert.js';
import { sendEmailAlert, getEmailTemplate } from '../config/email.js';
import { sendSMSAlert, getSmsTemplate } from '../config/sms.js';
import { Complaint } from '../models/Complaint.js';
import { User } from '../models/User.js';
import { subHours, subDays } from 'date-fns';

export class AlertService {
    // Créer une alerte
    async createAlert(alertData: Partial<IAlert>): Promise<IAlert> {
        try {
            const alert = new Alert({
                ...alertData,
                triggeredAt: new Date(),
                resolved: false,
                acknowledged: false
            });

            const savedAlert = await alert.save();

            // Envoyer notifications
            await this.sendNotifications(savedAlert);

            return savedAlert;
        } catch (error) {
            console.error('Failed to create alert:', error);
            throw error;
        }
    }

    // Envoyer notifications selon les préférences utilisateur
    private async sendNotifications(alert: IAlert) {
        try {
            // Récupérer les utilisateurs destinataires
            const users = await User.find({
                _id: { $in: alert.recipients },
                isActive: true
            }).select('email phone preferences');

            for (const user of users) {
                // Vérifier préférences de notification
                const prefs = user.preferences?.notifications || {
                    email: true,
                    sms: false,
                    push: true
                };

                // Envoyer email si activé
                if (prefs.email && user.email) {
                    try {
                        const html = getEmailTemplate(alert);
                        await sendEmailAlert(
                            user.email,
                            `[ReclamTrack] ${alert.title}`,
                            html
                        );
                    } catch (error) {
                        console.error(`Failed to send email to ${user.email}:`, error);
                    }
                }

                // Envoyer SMS si activé
                if (prefs.sms && user.phone) {
                    try {
                        const message = getSmsTemplate(alert);
                        await sendSMSAlert(user.phone, message);
                    } catch (error) {
                        console.error(`Failed to send SMS to ${user.phone}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to send notifications:', error);
        }
    }

    // Vérifier les seuils critiques (job automatique)
    async checkThresholdAlerts() {
        try {
            console.log('Checking threshold alerts...');

            // Vérifier réclamations urgentes
            await this.checkUrgentComplaints();

            // Vérifier haute priorité
            await this.checkHighPriorityComplaints();

            // Vérifier temps de réponse
            await this.checkSlowResponseTimes();

            // Vérifier précision IA
            await this.checkAILowConfidence();

        } catch (error) {
            console.error('Error checking threshold alerts:', error);
        }
    }

    private async checkUrgentComplaints() {
        const threshold = parseInt(process.env.ALERT_THRESHOLD_URGENT_COMPLAINTS || '10');

        const urgentCount = await Complaint.countDocuments({
            priority: 'urgent',
            status: { $ne: 'closed' },
            createdAt: { $gte: subHours(new Date(), 24) } // 24h dernières heures
        });

        if (urgentCount >= threshold) {
            const admins = await User.find({ role: 'admin' }).select('_id');

            await this.createAlert({
                type: 'urgent_complaints',
                severity: 'critical',
                title: 'Nombre élevé de réclamations urgentes',
                message: `Il y a actuellement ${urgentCount} réclamations urgentes non résolues.`,
                recipients: admins.map(a => a._id.toString()),
                data: { count: urgentCount, threshold },
                actions: [
                    {
                        label: 'Voir les réclamations urgentes',
                        action: '/complaints?priority=urgent',
                        payload: { priority: 'urgent' }
                    }
                ]
            });
        }
    }

    private async checkHighPriorityComplaints() {
        const threshold = parseInt(process.env.ALERT_THRESHOLD_HIGH_PRIORITY || '50');

        const highPriorityCount = await Complaint.countDocuments({
            priority: { $in: ['high', 'urgent'] },
            status: { $ne: 'closed' },
            createdAt: { $gte: subDays(new Date(), 7) } // 7 derniers jours
        });

        if (highPriorityCount >= threshold) {
            const dispatchers = await User.find({
                role: { $in: ['admin', 'dispatcher'] }
            }).select('_id');

            await this.createAlert({
                type: 'high_priority',
                severity: 'high',
                title: 'Volume élevé de réclamations prioritaires',
                message: `Plus de ${threshold} réclamations hautes priorités en cours.`,
                recipients: dispatchers.map(d => d._id.toString()),
                data: { count: highPriorityCount, threshold },
                actions: [
                    {
                        label: 'Optimiser les affectations',
                        action: '/planning/optimize',
                        payload: { optimize: true }
                    }
                ]
            });
        }
    }

    private async checkSlowResponseTimes() {
        const threshold = parseInt(process.env.ALERT_THRESHOLD_RESPONSE_TIME || '48'); // heures

        const slowComplaints = await Complaint.find({
            status: 'pending',
            createdAt: { $lte: subHours(new Date(), threshold) }
        }).select('number leakType createdAt assignedTo');

        if (slowComplaints.length > 0) {
            const dispatchers = await User.find({
                role: { $in: ['admin', 'dispatcher'] }
            }).select('_id');

            await this.createAlert({
                type: 'slow_response',
                severity: 'medium',
                title: 'Réclamations en attente prolongée',
                message: `${slowComplaints.length} réclamations attendent depuis plus de ${threshold} heures.`,
                recipients: dispatchers.map(d => d._id.toString()),
                data: {
                    count: slowComplaints.length,
                    threshold,
                    complaints: slowComplaints.map(c => ({
                        id: c._id,
                        ticketId: c.number,
                        title: c.leakType,
                        hoursWaiting: Math.floor((Date.now() - c.createdAt.getTime()) / (1000 * 60 * 60))
                    }))
                },
                actions: [
                    {
                        label: 'Assigner automatiquement',
                        action: '/complaints/auto-assign',
                        payload: {
                            complaintIds: slowComplaints.map(c => c._id.toString()),
                            strategy: 'available_teams'
                        }
                    }
                ]
            });
        }
    }

    private async checkAILowConfidence() {
        const threshold = parseInt(process.env.ALERT_THRESHOLD_AI_CONFIDENCE || '70');

        // Cette vérification nécessiterait un historique des classifications IA
        // Pour l'exemple, nous simulons une vérification
        const lowConfidenceCount = await Complaint.countDocuments({
            'aiConfidence': { $lt: threshold },
            createdAt: { $gte: subDays(new Date(), 1) }
        });

        if (lowConfidenceCount > 5) {
            const admins = await User.find({ role: 'admin' }).select('_id');

            await this.createAlert({
                type: 'low_confidence',
                severity: 'medium',
                title: 'Précision IA en baisse',
                message: `${lowConfidenceCount} classifications IA avec confiance < ${threshold}%.`,
                recipients: admins.map(a => a._id.toString()),
                data: { count: lowConfidenceCount, threshold },
                actions: [
                    {
                        label: 'Revoir les paramètres IA',
                        action: '/settings/ai',
                        payload: { review: true }
                    }
                ]
            });
        }
    }

    // Récupérer les alertes d'un utilisateur
    async getUserAlerts(userId: string, options: any = {}) {
        const {
            limit = 20,
            offset = 0,
            acknowledged = false,
            severity,
            type
        } = options;

        const query: any = {
            recipients: userId
        };

        if (!acknowledged) {
            query.acknowledged = false;
        }

        if (severity) {
            query.severity = severity;
        }

        if (type) {
            query.type = type;
        }

        const alerts = await Alert.find(query)
            .sort({ triggeredAt: -1 })
            .limit(limit)
            .skip(offset);

        const total = await Alert.countDocuments(query);

        return { alerts, total };
    }

    // Marquer une alerte comme acquittée
    async acknowledgeAlert(alertId: string, userId: string) {
        const alert = await Alert.findOneAndUpdate(
            {
                _id: alertId,
                recipients: userId
            },
            {
                acknowledged: true,
                resolvedAt: new Date()
            },
            { new: true }
        );

        return alert;
    }

    // Résoudre une alerte
    async resolveAlert(alertId: string, userId: string) {
        const alert = await Alert.findOneAndUpdate(
            {
                _id: alertId,
                recipients: userId
            },
            {
                resolved: true,
                resolvedAt: new Date()
            },
            { new: true }
        );

        return alert;
    }

    // Statistiques des alertes
    async getAlertStats(userId: string) {
        const oneWeekAgo = subDays(new Date(), 7);

        const stats = await Alert.aggregate([
            {
                $match: {
                    recipients: userId,
                    triggeredAt: { $gte: oneWeekAgo }
                }
            },
            {
                $group: {
                    _id: {
                        severity: '$severity',
                        date: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$triggeredAt'
                            }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.date': 1 }
            }
        ]);

        const bySeverity = await Alert.aggregate([
            {
                $match: {
                    recipients: userId,
                    triggeredAt: { $gte: oneWeekAgo }
                }
            },
            {
                $group: {
                    _id: '$severity',
                    count: { $sum: 1 }
                }
            }
        ]);

        return {
            dailyStats: stats,
            severityStats: bySeverity,
            total: stats.reduce((sum, stat) => sum + stat.count, 0)
        };
    }
}

export default new AlertService();
