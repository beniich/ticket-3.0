import mongoose, { Schema, Document } from 'mongoose';

export type InterventionStatus = 'En attente' | 'En cours' | 'Validation' | 'Terminé';
export type InterventionPriority = 'Basse' | 'Moyenne' | 'Haute' | 'Critique';

export interface IIntervention extends Document {
    complaintId: mongoose.Types.ObjectId;
    teamId?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    status: InterventionStatus;
    priority: InterventionPriority;
    location: string;
    startTime?: Date;
    endTime?: Date;
    checklist: Array<{ task: string; completed: boolean }>;
    notes: Array<{ userId: mongoose.Types.ObjectId; text: string; createdAt: Date }>;
}

const InterventionSchema: Schema = new Schema(
    {
        complaintId: { type: Schema.Types.ObjectId, ref: 'Complaint', required: true },
        teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
        title: { type: String, required: true },
        description: { type: String },
        status: {
            type: String,
            enum: ['En attente', 'En cours', 'Validation', 'Terminé'],
            default: 'En attente'
        },
        priority: {
            type: String,
            enum: ['Basse', 'Moyenne', 'Haute', 'Critique'],
            default: 'Moyenne'
        },
        location: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        checklist: [{
            task: { type: String },
            completed: { type: Boolean, default: false }
        }],
        notes: [{
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            text: { type: String },
            createdAt: { type: Date, default: Date.now }
        }]
    },
    { timestamps: true }
);

export const Intervention = mongoose.model<IIntervention>('Intervention', InterventionSchema);
