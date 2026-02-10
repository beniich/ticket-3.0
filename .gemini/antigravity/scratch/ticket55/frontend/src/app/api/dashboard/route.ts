import { NextResponse } from 'next/server';

// Données mock pour le dashboard
const mockDashboardData = {
    stats: {
        totalComplaints: 1247,
        activeComplaints: 342,
        resolvedToday: 89,
        avgResponseTime: '2.4h',
        satisfactionRate: 94.2,
        criticalIssues: 12
    },
    recentComplaints: [
        {
            id: 'REC-001',
            title: 'Water Leakage in Main Lobby',
            status: 'In Progress',
            priority: 'High',
            date: 'Oct 24, 2023',
            assignedTo: 'John Smith'
        },
        {
            id: 'REC-002',
            title: 'Broken Street Light',
            status: 'New',
            priority: 'Medium',
            date: 'Oct 24, 2023',
            assignedTo: 'Unassigned'
        },
        {
            id: 'REC-003',
            title: 'Garbage Collection Delay',
            status: 'Resolved',
            priority: 'Low',
            date: 'Oct 23, 2023',
            assignedTo: 'Sarah Johnson'
        }
    ],
    chartData: {
        complaintsByCategory: {
            labels: ['Water', 'Electricity', 'Roads', 'Waste', 'Other'],
            data: [320, 180, 240, 150, 357]
        },
        complaintsByStatus: {
            labels: ['New', 'In Progress', 'Resolved', 'Closed'],
            data: [156, 342, 589, 160]
        },
        complaintsTrend: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            data: [120, 135, 148, 142, 156, 168, 175, 182, 190, 198]
        }
    },
    teamPerformance: [
        { name: 'John Smith', resolved: 45, pending: 8, rating: 4.8 },
        { name: 'Sarah Johnson', resolved: 38, pending: 12, rating: 4.6 },
        { name: 'Mike Davis', resolved: 32, pending: 15, rating: 4.5 },
        { name: 'Emily Brown', resolved: 28, pending: 10, rating: 4.7 }
    ],
    lastUpdated: new Date().toISOString()
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // En production, filtrer les données selon les dates
        // Pour l'instant, on retourne les données mock

        return NextResponse.json(mockDashboardData);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
