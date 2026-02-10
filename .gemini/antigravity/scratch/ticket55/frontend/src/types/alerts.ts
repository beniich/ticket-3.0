export interface Alert {
    _id: string; // Mongoose ID
    id: string;  // Normalized ID
    type: 'urgent_complaints' | 'high_priority' | 'slow_response' | 'low_confidence' | 'ai_recommendation' | 'custom';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    triggeredAt: string;
    resolvedAt?: string;
    resolved: boolean;
    acknowledged: boolean;
    recipients: string[];
    data?: any;
    actions?: AlertAction[];
    category?: string;
}

export interface AlertAction {
    label: string;
    action: string;
    payload?: any;
}

export interface AlertStats {
    dailyStats: {
        _id: {
            severity: string;
            date: string;
        };
        count: number;
    }[];
    severityStats: {
        _id: string;
        count: number;
    }[];
    total: number;
}
