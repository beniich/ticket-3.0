import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
    type: 'urgent_complaints' | 'high_priority' | 'slow_response' | 'low_confidence' | 'ai_recommendation' | 'custom';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    triggeredAt: Date;
    resolvedAt?: Date;
    resolved: boolean;
    acknowledged: boolean;
    recipients: string[]; // User IDs
    data?: any; // Données contextuelles
    actions?: AlertAction[];
    category?: string; // Pour filtrage
}

export interface AlertAction {
    label: string;
    action: string; // endpoint API
    payload?: any;
}

const AlertSchema: Schema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['urgent_complaints', 'high_priority', 'slow_response', 'low_confidence', 'ai_recommendation', 'custom']
    },
    severity: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high', 'critical']
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    triggeredAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date
    },
    resolved: {
        type: Boolean,
        default: false
    },
    acknowledged: {
        type: Boolean,
        default: false
    },
    recipients: [{
        type: String,
        ref: 'User'
    }],
    data: Schema.Types.Mixed,
    actions: [{
        label: String,
        action: String,
        payload: Schema.Types.Mixed
    }],
    category: String
});

export default mongoose.model<IAlert>('Alert', AlertSchema);
