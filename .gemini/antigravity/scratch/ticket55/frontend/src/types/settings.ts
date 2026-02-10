export interface BrandSettings {
    logo: string;
    colors: {
        primary: string;
        dark: string;
        success: string;
    };
    typography: {
        heading: string;
        body: string;
    };
}

export interface Integration {
    id: string;
    name: string;
    provider: string;
    enabled: boolean;
    apiKey?: string;
    clientId?: string;
    status: 'connected' | 'disconnected' | 'pending';
    icon: string;
}

export interface NotificationRule {
    id: string;
    name: string;
    description: string;
    channels: string[];
}

export interface Preferences {
    language: string;
    darkMode: boolean;
    compactView: boolean;
}

export interface MaintenanceInfo {
    status: 'operational' | 'maintenance' | 'issues';
    cacheSize: string;
}

export interface SettingsData {
    brand: BrandSettings;
    integrations: Integration[];
    notifications: NotificationRule[];
    preferences: Preferences;
    maintenance: MaintenanceInfo;
    metadata: {
        version: string;
        lastUpdated: string;
        updatedBy: string;
    };
}
