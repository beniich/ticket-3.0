import { Request, Response } from 'express';
import exportService from '../services/exportService.js';
import { Complaint } from '../models/Complaint.js';
import Team from '../models/Team.js';
import { DataFormatter } from '../utils/formatters.js';

export class ExportController {
    // Export des réclamations
    static async exportComplaints(req: Request, res: Response) {
        try {
            const { format, startDate, endDate, status, priority } = req.query;

            // Construire la requête
            const query: any = {};

            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) query.createdAt.$gte = new Date(startDate as string);
                if (endDate) query.createdAt.$lte = new Date(endDate as string);
            }

            if (status) query.status = status;
            if (priority) query.priority = priority;

            // Récupérer les données
            const complaints = await Complaint.find(query)
                .populate('assignedTo', 'name')
                .populate('reportedBy', 'name')
                .sort({ createdAt: -1 });

            // Formatter les données pour l'export
            const exportData = complaints.map(complaint => ({
                'ID Ticket': (complaint as any).ticketId,
                'Titre': (complaint as any).title,
                'Description': DataFormatter.truncateText((complaint as any).description, 100),
                'Catégorie': DataFormatter.formatCategory((complaint as any).category),
                'Priorité': DataFormatter.formatPriority(complaint.priority),
                'Statut': DataFormatter.formatStatus(complaint.status),
                'Localisation': complaint.location?.address || 'Non spécifiée',
                'Assignée à': (complaint as any).assignedTo?.name || 'Non assignée',
                'Signalée par': (complaint as any).reportedBy?.name || 'Inconnu',
                'Date de création': DataFormatter.formatDate((complaint as any).createdAt),
                'Date de résolution': (complaint as any).resolvedAt ? DataFormatter.formatDate((complaint as any).resolvedAt) : 'En cours',
                'Temps de résolution': (complaint as any).resolvedAt ?
                    `${Math.round(((complaint as any).resolvedAt.getTime() - (complaint as any).createdAt.getTime()) / (1000 * 60 * 60))}h` :
                    'En cours'
            }));

            // Options d'export
            const exportOptions = {
                format: format as 'excel' | 'pdf' | 'csv' || 'excel',
                sheetName: 'Réclamations',
                title: 'Rapport des Réclamations',
                columns: [
                    { header: 'ID Ticket', key: 'ID Ticket', width: 15 },
                    { header: 'Titre', key: 'Titre', width: 25 },
                    { header: 'Description', key: 'Description', width: 30 },
                    { header: 'Catégorie', key: 'Catégorie', width: 15 },
                    { header: 'Priorité', key: 'Priorité', width: 12 },
                    { header: 'Statut', key: 'Statut', width: 15 },
                    { header: 'Localisation', key: 'Localisation', width: 25 },
                    { header: 'Assignée à', key: 'Assignée à', width: 20 },
                    { header: 'Signalée par', key: 'Signalée par', width: 20 },
                    { header: 'Date de création', key: 'Date de création', width: 20 },
                    { header: 'Date de résolution', key: 'Date de résolution', width: 20 },
                    { header: 'Temps de résolution', key: 'Temps de résolution', width: 18 }
                ],
                includeSummary: true,
                summaryFields: ['Priorité', 'Statut', 'Catégorie'],
                metadata: {
                    'Période': startDate && endDate ?
                        `${new Date(startDate as string).toLocaleDateString('fr-FR')} - ${new Date(endDate as string).toLocaleDateString('fr-FR')}` :
                        'Toutes les dates',
                    'Total réclamations': complaints.length.toString(),
                    'Généré par': req.user?.id || 'Système' // Changed to req.user.id
                }
            };

            // Générer l'export
            await ExportController.generateExport(res, exportData, exportOptions);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Export du planning des équipes
    static async exportPlanning(req: Request, res: Response) {
        try {
            const { format, startDate, endDate, teamId } = req.query;

            // Ici vous pouvez implémenter l'export du planning
            // Pour l'exemple, on simule des données

            const planningData = [
                {
                    'Équipe': 'Équipe Alpha',
                    'Technicien': 'Jean Dupont',
                    'Date': '01/02/2026',
                    'Heure début': '08:00',
                    'Heure fin': '17:00',
                    'Tâche': 'Maintenance préventive',
                    'Localisation': 'Quartier Centre',
                    'Statut': 'Terminé'
                },
                {
                    'Équipe': 'Équipe Beta',
                    'Technicien': 'Marie Martin',
                    'Date': '02/02/2026',
                    'Heure début': '09:00',
                    'Heure fin': '16:00',
                    'Tâche': 'Réparation urgente',
                    'Localisation': 'Quartier Nord',
                    'Statut': 'En cours'
                }
            ];

            const exportOptions = {
                format: format as 'excel' | 'pdf' | 'csv' || 'excel',
                sheetName: 'Planning',
                title: 'Planning des Interventions',
                columns: [
                    { header: 'Équipe', key: 'Équipe', width: 15 },
                    { header: 'Technicien', key: 'Technicien', width: 20 },
                    { header: 'Date', key: 'Date', width: 12 },
                    { header: 'Heure début', key: 'Heure début', width: 12 },
                    { header: 'Heure fin', key: 'Heure fin', width: 12 },
                    { header: 'Tâche', key: 'Tâche', width: 25 },
                    { header: 'Localisation', key: 'Localisation', width: 20 },
                    { header: 'Statut', key: 'Statut', width: 15 }
                ],
                metadata: {
                    'Période': startDate && endDate ?
                        `${new Date(startDate as string).toLocaleDateString('fr-FR')} - ${new Date(endDate as string).toLocaleDateString('fr-FR')}` :
                        'Toutes les dates'
                }
            };

            await ExportController.generateExport(res, planningData, exportOptions);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Export des statistiques du dashboard
    static async exportDashboardStats(req: Request, res: Response) {
        try {
            const { format, period } = req.query;

            // Simuler des données de dashboard
            const dashboardData = {
                stats: {
                    totalComplaints: 150,
                    newComplaints: 25,
                    inProgress: 45,
                    resolved: 60,
                    closed: 20,
                    urgent: 8,
                    avgResolutionTime: 32.5,
                    satisfactionRate: 87.3,
                    aiAccuracy: 92.1
                },
                categories: [
                    { name: 'Électricité', count: 45, percentage: 30 },
                    { name: 'Routes', count: 35, percentage: 23.3 },
                    { name: 'Eau', count: 28, percentage: 18.7 },
                    { name: 'Assainissement', count: 22, percentage: 14.7 },
                    { name: 'Autre', count: 20, percentage: 13.3 }
                ]
            };

            // Convertir en format tabulaire pour l'export
            const exportData = [
                { 'Métrique': 'Total Réclamations', 'Valeur': dashboardData.stats.totalComplaints },
                { 'Métrique': 'Nouvelles', 'Valeur': dashboardData.stats.newComplaints },
                { 'Métrique': 'En Cours', 'Valeur': dashboardData.stats.inProgress },
                { 'Métrique': 'Résolues', 'Valeur': dashboardData.stats.resolved },
                { 'Métrique': 'Fermées', 'Valeur': dashboardData.stats.closed },
                { 'Métrique': 'Urgentes', 'Valeur': dashboardData.stats.urgent },
                { 'Métrique': 'Temps Moyen Résolution (heures)', 'Valeur': dashboardData.stats.avgResolutionTime },
                { 'Métrique': 'Taux Satisfaction (%)', 'Valeur': dashboardData.stats.satisfactionRate },
                { 'Métrique': 'Précision IA (%)', 'Valeur': dashboardData.stats.aiAccuracy }
            ];

            const exportOptions = {
                format: format as 'excel' | 'pdf' | 'csv' || 'excel',
                sheetName: 'Statistiques',
                title: 'Statistiques Dashboard',
                columns: [
                    { header: 'Métrique', key: 'Métrique', width: 30 },
                    { header: 'Valeur', key: 'Valeur', width: 15 }
                ],
                metadata: {
                    'Période': period ? `Derniers ${period}` : '7 derniers jours'
                }
            };

            await ExportController.generateExport(res, exportData, exportOptions);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Génération générique d'export
    private static async generateExport(
        res: Response,
        data: any[],
        options: any
    ) {
        try {
            let buffer: Buffer | string;
            let contentType: string;
            let filename: string;

            switch (options.format) {
                case 'excel':
                    buffer = await exportService.exportToExcel(data, options);
                    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    filename = exportService.generateFilename('export_reclamtrack', 'xlsx');
                    break;

                case 'pdf':
                    buffer = await exportService.exportToPDF(data, options);
                    contentType = 'application/pdf';
                    filename = exportService.generateFilename('export_reclamtrack', 'pdf');
                    break;

                case 'csv':
                    const csvContent = await exportService.exportToCSV(data, options);
                    buffer = Buffer.from(csvContent, 'utf8');
                    contentType = 'text/csv';
                    filename = exportService.generateFilename('export_reclamtrack', 'csv');
                    break;

                default:
                    throw new Error('Format d\'export non supporté');
            }

            // Envoyer le fichier
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(buffer);
        } catch (error) {
            throw error;
        }
    }
}
