import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validator } from '../middleware/validator.js';
import { protect } from '../middleware/auth.js';
import { Intervention } from '../models/Intervention.js';
import { io } from '../services/socketService.js';

const router = Router();

/* GET /api/interventions */
router.get('/', async (req, res, next) => {
    try {
        const interventions = await Intervention.find()
            .populate('complaintId')
            .populate('teamId')
            .sort({ createdAt: -1 });
        res.json(interventions);
    } catch (err) {
        next(err);
    }
});

/* GET /api/interventions/:id */
router.get('/:id', [
    param('id').isMongoId()
], validator, async (req, res, next) => {
    try {
        const intervention = await Intervention.findById(req.params.id)
            .populate('complaintId')
            .populate('teamId');
        if (!intervention) return res.status(404).json({ message: 'Intervention introuvable' });
        res.json(intervention);
    } catch (err) {
        next(err);
    }
});

/* POST /api/interventions */
router.post(
    '/',
    [
        body('complaintId').isMongoId(),
        body('title').notEmpty(),
        body('status').optional().isIn(['En attente', 'En cours', 'Validation', 'Terminé']),
        body('priority').optional().isIn(['Basse', 'Moyenne', 'Haute', 'Critique']),
    ],
    validator,
    async (req, res, next) => {
        try {
            const intervention = await Intervention.create(req.body);
            if (io) {
                io.emit('new-intervention', intervention);
            }
            res.status(201).json(intervention);
        } catch (err) {
            next(err);
        }
    }
);

/* PATCH /api/interventions/:id */
router.patch(
    '/:id',
    [
        param('id').isMongoId(),
        body('status').optional().isIn(['En attente', 'En cours', 'Validation', 'Terminé']),
        body('teamId').optional().isMongoId(),
    ],
    validator,
    async (req, res, next) => {
        try {
            const updated = await Intervention.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            if (!updated) return res.status(404).json({ message: 'Intervention introuvable' });

            if (io) {
                io.emit('intervention-updated', updated);
            }
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }
);

/* DELETE /api/interventions/:id */
router.delete('/:id', [
    param('id').isMongoId()
], validator, async (req, res, next) => {
    try {
        const deleted = await Intervention.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Intervention introuvable' });

        if (io) {
            io.emit('intervention-deleted', req.params.id);
        }
        res.json({ message: 'Intervention supprimée' });
    } catch (err) {
        next(err);
    }
});

export default router;
