import mongoose, { Schema, Document } from 'mongoose';

export type ComplaintStatus = 'nouvelle' | 'en cours' | 'résolue' | 'fermée';

export interface IComplaint extends Document {
    number: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    leakType: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    resolvedAt?: Date;
    closedAt?: Date;
    assignedTo?: string; // or Schema.Types.ObjectId
    location?: {
        address?: string;
        lat?: number;
        lng?: number;
    };
    status: ComplaintStatus;
    createdAt: Date;
    updatedAt: Date;
}

const ComplaintSchema: Schema = new Schema(
    {
        number: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        leakType: { type: String, required: true },
        description: { type: String },

        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'low'
        },
        category: { type: String, default: 'Autres' },
        resolvedAt: { type: Date },
        closedAt: { type: Date },
        assignedTo: { type: Schema.Types.ObjectId, ref: 'Team' },
        location: {
            address: { type: String },
            lat: { type: Number },
            lng: { type: Number }
        },
        status: {
            type: String,
            enum: ['nouvelle', 'en cours', 'résolue', 'fermée'],
            default: 'nouvelle'
        }
    },
    { timestamps: true }
);

// Auto-generate unique complaint number
ComplaintSchema.pre<IComplaint>('save', async function (next) {
    if (this.isNew) {
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomPart = Math.floor(100 + Math.random() * 900);
        this.number = `${datePart}-${randomPart}`;
    }
    next();
});

export const Complaint = mongoose.model<IComplaint>('Complaint', ComplaintSchema);
