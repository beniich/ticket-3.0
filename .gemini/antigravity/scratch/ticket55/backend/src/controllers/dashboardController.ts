import { Request, Response } from 'express';
import { Complaint } from '../models/Complaint.js';
import { Team } from '../models/Team.js';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export class DashboardController {
    static async getDashboardData(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;

            const start = startDate ? new Date(startDate as string) : subDays(new Date(), 7);
            const end = endDate ? new Date(endDate as string) : new Date();

            // Données statistiques principales
            const [
                totalComplaints,
                newComplaints,
                inProgress,
                resolved,
                closed,
                urgent
            ] = await Promise.all([
                Complaint.countDocuments({
                    createdAt: { $gte: start, $lte: end }
                }),
                Complaint.countDocuments({
                    status: 'nouvelle',
                    createdAt: { $gte: start, $lte: end }
                }),
                Complaint.countDocuments({
                    status: 'en cours',
                    createdAt: { $gte: start, $lte: end }
                }),
                Complaint.countDocuments({
                    status: 'résolue',
                    createdAt: { $gte: start, $lte: end }
                }),
                Complaint.countDocuments({
                    status: 'fermée',
                    createdAt: { $gte: start, $lte: end }
                }),
                Complaint.countDocuments({
                    priority: 'urgent',
                    createdAt: { $gte: start, $lte: end }
                })
            ]);

            // Temps moyen de résolution
            const resolvedComplaints = await Complaint.find({
                status: { $in: ['résolue', 'fermée'] },
                createdAt: { $gte: start, $lte: end },
                resolvedAt: { $exists: true }
            }).select('createdAt resolvedAt');

            let totalResolutionTime = 0;
            resolvedComplaints.forEach(complaint => {
                if (complaint.resolvedAt) {
                    const resolutionTime = (new Date(complaint.resolvedAt).getTime() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60);
                    totalResolutionTime += resolutionTime;
                }
            });

            const avgResolutionTime = resolvedComplaints.length > 0
                ? totalResolutionTime / resolvedComplaints.length
                : 0;

            // Distribution par catégorie
            const categoryAggregation = await Complaint.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);

            const categories = categoryAggregation.map(item => ({
                name: item._id || 'Non classé',
                count: item.count,
                percentage: totalComplaints > 0 ? (item.count / totalComplaints) * 100 : 0,
                trend: 'stable' as const
            }));

            // Distribution par priorité
            const priorityAggregation = await Complaint.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: "$priority",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const priorities = priorityAggregation.map(item => ({
                level: item._id as any,
                count: item.count,
                percentage: totalComplaints > 0 ? (item.count / totalComplaints) * 100 : 0
            }));

            // Données temporelles (7 derniers jours)
            const timeSeries = [];
            const currentDate = new Date(start);
            // Clone date for loop
            const loopDate = new Date(currentDate);

            while (loopDate <= end) {
                const dayStart = startOfDay(loopDate);
                const dayEnd = endOfDay(loopDate);

                const dayStats = await Complaint.aggregate([
                    {
                        $match: {
                            createdAt: { $gte: dayStart, $lte: dayEnd }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            resolved: {
                                $sum: {
                                    $cond: [{ $in: ["$status", ["résolue", "fermée"]] }, 1, 0]
                                }
                            }
                        }
                    }
                ]);

                const stats = dayStats[0] || { total: 0, resolved: 0 };

                timeSeries.push({
                    date: loopDate.toISOString().split('T')[0],
                    complaints: stats.total,
                    resolved: stats.resolved,
                    avgResponseTime: avgResolutionTime // Simplifié pour l'exemple
                });

                loopDate.setDate(loopDate.getDate() + 1);
            }

            // Performance des équipes
            const teams = await Team.find({}).populate('members.userId');
            const teamPerformance = await Promise.all(teams.map(async (team) => {
                const teamComplaints = await Complaint.countDocuments({
                    assignedTo: team._id,
                    createdAt: { $gte: start, $lte: end }
                });

                const resolvedComplaints = await Complaint.countDocuments({
                    assignedTo: team._id,
                    status: { $in: ['résolue', 'fermée'] },
                    createdAt: { $gte: start, $lte: end }
                });

                return {
                    id: team._id.toString(),
                    name: team.name,
                    completed: resolvedComplaints,
                    avgTime: avgResolutionTime,
                    satisfaction: 85 + Math.random() * 10, // Simulé
                    efficiency: teamComplaints > 0 ? Math.min(100, (resolvedComplaints / teamComplaints) * 100) : 0
                };
            }));

            // Zones à risque (basé sur localisation)
            const locationHotspots = await Complaint.aggregate([
                {
                    $match: {
                        'location.address': { $exists: true, $ne: '' },
                        createdAt: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: {
                            $arrayElemAt: [{ $split: ['$location.address', ','] }, 0]
                        },
                        count: { $sum: 1 },
                        categories: { $addToSet: '$category' }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 10
                }
            ]).then(results =>
                results.map((item, index) => ({
                    location: item._id,
                    count: item.count,
                    category: item.categories[0] || 'Divers',
                    severity: item.count > 10 ? 'high' : item.count > 5 ? 'medium' : 'low'
                }))
            );

            // Précision IA (si disponible)
            const aiAccuracy = 87 + Math.random() * 8; // Simulé

            const dashboardData = {
                stats: {
                    totalComplaints,
                    newComplaints,
                    inProgress,
                    resolved,
                    closed,
                    urgent,
                    avgResolutionTime: Math.round(avgResolutionTime * 100) / 100,
                    satisfactionRate: 85 + Math.random() * 10,
                    aiAccuracy: Math.round(aiAccuracy)
                },
                categories,
                priorities,
                timeSeries,
                teams: teamPerformance,
                hotspots: locationHotspots,
                lastUpdated: new Date()
            };

            res.json(dashboardData);
        } catch (error: any) {
            console.error('Dashboard Error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Endpoint pour les tendances IA
    static async getAITrends(req: Request, res: Response) {
        try {
            // Cette donnée viendrait normalement de l'IA
            const aiTrends = [
                {
                    category: 'Électricité',
                    confidence: 92,
                    frequency: 25,
                    recommendations: [
                        'Inspection préventive des réseaux',
                        'Renforcement infrastructure'
                    ]
                },
                {
                    category: 'Routes',
                    confidence: 88,
                    frequency: 30,
                    recommendations: [
                        'Programme entretien annuel',
                        'Surveillance zones critiques'
                    ]
                }
            ];

            res.json(aiTrends);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
