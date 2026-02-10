import mongoose, { Schema, Document } from 'mongoose';

export interface IFinancialRecord extends Document {
    complaintId?: string;
    interventionId?: string;
    type: 'expense' | 'revenue';
    category: 'parts' | 'labor' | 'equipment' | 'fuel' | 'other';
    amount: number;
    currency: string;
    description: string;
    date: Date;
    status: 'pending' | 'approved' | 'paid' | 'cancelled';
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

const FinancialRecordSchema = new Schema<IFinancialRecord>({
    complaintId: { type: String, index: true },
    interventionId: { type: String, index: true },
    type: {
        type: String,
        enum: ['expense', 'revenue'],
        required: true
    },
    category: {
        type: String,
        enum: ['parts', 'labor', 'equipment', 'fuel', 'other'],
        required: true
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'MAD' },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'approved', 'paid', 'cancelled'],
        default: 'pending'
    },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const FinancialRecord = mongoose.model<IFinancialRecord>('FinancialRecord', FinancialRecordSchema);
