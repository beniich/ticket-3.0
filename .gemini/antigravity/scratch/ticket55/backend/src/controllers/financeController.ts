import { Request, Response } from 'express';
import { FinancialRecord } from '../models/FinancialRecord.js';

export class FinanceController {
    static async getRecords(req: Request, res: Response) {
        try {
            const { type, category, status, start, end } = req.query;
            const query: any = {};

            if (type) query.type = type;
            if (category) query.category = category;
            if (status) query.status = status;
            if (start && end) {
                query.date = { $gte: new Date(start as string), $lte: new Date(end as string) };
            }

            const records = await FinancialRecord.find(query).sort({ date: -1 });
            res.json(records);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getStats(req: Request, res: Response) {
        try {
            const stats = await FinancialRecord.aggregate([
                {
                    $group: {
                        _id: '$type',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                }
            ]);

            const categoryStats = await FinancialRecord.aggregate([
                { $match: { type: 'expense' } },
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: '$amount' }
                    }
                }
            ]);

            res.json({ stats, categoryStats });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createRecord(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const record = new FinancialRecord({
                ...req.body,
                createdBy: userId
            });
            await record.save();
            res.status(201).json(record);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const record = await FinancialRecord.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
            if (!record) return res.status(404).json({ error: 'Record non trouvé' });
            res.json(record);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
