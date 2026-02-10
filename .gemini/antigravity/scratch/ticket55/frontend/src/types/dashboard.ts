export interface DashboardStats {
    totalComplaints: number;
    newComplaints: number;
    inProgress: number;
    resolved: number;
    closed: number;
    urgent: number;
    avgResolutionTime: number;
    satisfactionRate: number;
    aiAccuracy: number;
}

export interface CategoryStats {
    name: string;
    count: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
}

export interface PriorityStats {
    level: 'low' | 'medium' | 'high' | 'urgent';
    count: number;
    percentage: number;
}

export interface TimeSeriesData {
    date: string;
    complaints: number;
    resolved: number;
    avgResponseTime: number;
}

export interface TeamPerformance {
    id: string;
    name: string;
    completed: number;
    avgTime: number;
    satisfaction: number;
    efficiency: number;
}

export interface LocationHotspot {
    location: string;
    count: number;
    category: string;
    severity: 'low' | 'medium' | 'high';
}

export interface AITrend {
    category: string;
    confidence: number;
    frequency: number;
    recommendations: string[];
}

export interface DashboardData {
    stats: DashboardStats;
    categories: CategoryStats[];
    priorities: PriorityStats[];
    timeSeries: TimeSeriesData[];
    teams: TeamPerformance[];
    hotspots: LocationHotspot[];
    aiTrends?: AITrend[];
    lastUpdated: Date;
}

export interface DateRange {
    start: Date;
    end: Date;
}
