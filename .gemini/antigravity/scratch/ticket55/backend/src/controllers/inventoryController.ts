import { Request, Response } from 'express';
import { InventoryItem } from '../models/InventoryItem.js';

export class InventoryController {
    static async getItems(req: Request, res: Response) {
        try {
            const { category, status, search } = req.query;
            const query: any = {};

            if (category) query.category = category;
            if (status) query.status = status;
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { sku: { $regex: search, $options: 'i' } }
                ];
            }

            const items = await InventoryItem.find(query).sort({ updatedAt: -1 });
            res.json(items);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getItem(req: Request, res: Response) {
        try {
            const item = await InventoryItem.findById(req.params.id);
            if (!item) return res.status(404).json({ error: 'Item non trouvé' });
            res.json(item);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createItem(req: Request, res: Response) {
        try {
            const item = new InventoryItem(req.body);
            await item.save();
            res.status(201).json(item);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateItem(req: Request, res: Response) {
        try {
            const item = await InventoryItem.findByIdAndUpdate(
                req.params.id,
                { ...req.body, updatedAt: new Date() },
                { new: true }
            );
            if (!item) return res.status(404).json({ error: 'Item non trouvé' });
            res.json(item);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteItem(req: Request, res: Response) {
        try {
            const item = await InventoryItem.findByIdAndDelete(req.params.id);
            if (!item) return res.status(404).json({ error: 'Item non trouvé' });
            res.json({ message: 'Item supprimé' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
