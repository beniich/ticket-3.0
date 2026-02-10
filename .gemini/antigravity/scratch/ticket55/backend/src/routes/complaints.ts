import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validator } from '../middleware/validator.js';
import { protect } from '../middleware/auth.js';
import { Complaint } from '../models/Complaint.js';
import { io } from '../services/socketService.js';

const router = Router();

/* GET /api/complaints - with filtering */
router.get('/', [
    query('status').optional().isIn(['nouvelle', 'en cours', 'résolue', 'fermée']),
    query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    query('search').optional().isString()
], validator, async (req, res, next) => {
    try {
        const { status, priority, search } = req.query;
        let query: any = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (search) {
            query.$or = [
                { number: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }

        const complaints = await Complaint.find(query).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        next(err);
    }
});

/* GET /api/complaints/:id */
router.get('/:id', [
    param('id').isMongoId()
], validator, async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Réclamation introuvable' });
        res.json(complaint);
    } catch (err) {
        next(err);
    }
});

/* POST /api/complaints */
router.post(
    '/',
    [
        body('firstName').notEmpty(),
        body('lastName').notEmpty(),
        body('address').notEmpty(),
        body('phone').notEmpty(),
        body('leakType').notEmpty()
    ],
    validator,
    async (req, res, next) => {
        try {
            const complaint = await Complaint.create(req.body);
            // Emit real-time event
            if (io) {
                io.emit('new-complaint', complaint);
            }
            res.status(201).json(complaint);
        } catch (err) {
            next(err);
        }
    }
);

/* PATCH /api/complaints/:id */
router.patch(
    '/:id',
    [
        param('id').isMongoId(),
        body('status').optional().isIn(['nouvelle', 'en cours', 'résolue', 'fermée']),
        body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
        body('assignedTo').optional().isString()
    ],
    validator,
    async (req, res, next) => {
        try {
            const updated = await Complaint.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            if (!updated) return res.status(404).json({ message: 'Réclamation introuvable' });

            if (io) {
                io.emit('complaint-updated', updated);
            }
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }
);

/* DELETE /api/complaints/:id */
router.delete('/:id', [
    param('id').isMongoId()
], validator, async (req, res, next) => {
    try {
        const deleted = await Complaint.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Réclamation introuvable' });

        if (io) {
            io.emit('complaint-deleted', req.params.id);
        }
        res.json({ message: 'Réclamation supprimée' });
    } catch (err) {
        next(err);
    }
});

export default router;
