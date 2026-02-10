export interface TicketTimelineItem {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    color: string;
    statusUpdate?: string;
}

export interface TicketDetails {
    description: string;
    criticalConcern: string;
    targetArea: string;
    riskFactor: string;
}

export interface TicketNote {
    id: string;
    author: string;
    initials: string;
    role: string;
    timestamp: string;
    content: string;
}

export interface ClientInfo {
    company: string;
    contact: string;
    phone: string;
    email: string;
    address: string;
    avatar: string;
}

export interface SiteInfo {
    level: string;
    coordinates: string;
    eta: string;
    // added to match component usage
    [key: string]: any;
}

export interface EvidencePhoto {
    id: string;
    url: string;
    alt: string;
}

export interface TicketData {
    id: string;
    title: string;
    status: string;
    priority: string;
    date: string;
    time: string;
    source: string;
    timeline: TicketTimelineItem[];
    details: TicketDetails;
    notes: TicketNote[];
    client: ClientInfo;
    site: SiteInfo;
    evidence: EvidencePhoto[];
}
