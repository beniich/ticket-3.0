import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryItem extends Document {
    name: string;
    category: 'tools' | 'parts' | 'vehicles' | 'safety' | 'other';
    quantity: number;
    minQuantity: number;
    unit: string;
    price: number;
    currency: string;
    status: 'available' | 'in_use' | 'maintenance' | 'out_of_stock';
    location: string;
    sku: string;
    lastMaintained?: Date;
    assignedTo?: string; // User ID or Team ID
    createdAt: Date;
    updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>({
    name: { type: String, required: true },
    category: {
        type: String,
        enum: ['tools', 'parts', 'vehicles', 'safety', 'other'],
        required: true
    },
    quantity: { type: Number, required: true, default: 0 },
    minQuantity: { type: Number, required: true, default: 5 },
    unit: { type: String, required: true, default: 'unité' },
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'MAD' },
    status: {
        type: String,
        enum: ['available', 'in_use', 'maintenance', 'out_of_stock'],
        default: 'available'
    },
    location: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    lastMaintained: { type: Date },
    assignedTo: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
