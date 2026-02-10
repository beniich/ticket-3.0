export interface Message {
    id: string;
    threadId: string;
    sender: {
        id: string;
        name: string;
        avatar?: string;
    };
    content: string;
    attachments?: Attachment[];
    reactions?: Reaction[];
    status: 'sent' | 'delivered' | 'read';
    replyTo?: string;
    mentions?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'document' | 'pdf' | 'other';
    size: number;
}

export interface Reaction {
    userId: string;
    emoji: string;
    createdAt: string;
}

export interface Thread {
    id: string;
    participants: {
        id: string;
        name: string;
        avatar?: string;
        lastRead?: string;
    }[];
    title?: string;
    isGroup: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    lastMessage?: {
        content: string;
        sender: string;
        timestamp: string;
    };
}

export interface MessageFormData {
    content: string;
    attachments?: File[];
    replyTo?: string;
    mentions?: string[];
}
