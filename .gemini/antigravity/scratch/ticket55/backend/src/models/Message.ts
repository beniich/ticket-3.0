import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IMessage extends Document {
    threadId: string; // ID du fil de discussion
    sender: {
        id: string; // User ID
        name: string;
        avatar?: string;
    };
    content: string;
    attachments?: Attachment[];
    reactions?: Reaction[];
    status: 'sent' | 'delivered' | 'read';
    replyTo?: string; // Message ID si c'est une réponse
    mentions?: string[]; // User IDs mentionnés
    createdAt: Date;
    updatedAt: Date;
}

export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'document' | 'pdf' | 'other';
    size: number; // en octets
}

export interface Reaction {
    userId: string;
    emoji: string;
    createdAt: Date;
}

export interface IThread extends Document {
    participants: {
        id: string;
        name: string;
        avatar?: string;
        lastRead?: Date;
    }[];
    title?: string; // Pour les groupes
    isGroup: boolean;
    createdBy: string; // User ID
    createdAt: Date;
    updatedAt: Date;
    lastMessage?: {
        content: string;
        sender: string;
        timestamp: Date;
    };
}

const AttachmentSchema = new Schema<Attachment>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: {
        type: String,
        enum: ['image', 'document', 'pdf', 'other'],
        default: 'other'
    },
    size: { type: Number, required: true }
});

const ReactionSchema = new Schema<Reaction>({
    userId: { type: String, required: true },
    emoji: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const MessageSchema = new Schema<IMessage>({
    threadId: { type: String, required: true, index: true },
    sender: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        avatar: { type: String }
    },
    content: { type: String, required: true, maxlength: 5000 },
    attachments: [AttachmentSchema],
    reactions: [ReactionSchema],
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    replyTo: { type: String },
    mentions: [{ type: String }],
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now }
});

MessageSchema.plugin(uniqueValidator);

const ThreadSchema = new Schema<IThread>({
    participants: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        avatar: { type: String },
        lastRead: { type: Date }
    }],
    title: { type: String },
    isGroup: { type: Boolean, default: false },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastMessage: {
        content: { type: String },
        sender: { type: String },
        timestamp: { type: Date }
    }
});

// Index pour optimiser les recherches
MessageSchema.index({ threadId: 1, createdAt: -1 });
ThreadSchema.index({ participants: 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
export const Thread = mongoose.model<IThread>('Thread', ThreadSchema);
