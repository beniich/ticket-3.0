import express from 'express';
import { body, param } from 'express-validator';
import { Assignment } from '../models/Assignment.js';
import { Complaint } from '../models/Complaint.js';
import { Team } from '../models/Team.js';
import { Intervention } from '../models/Intervention.js';
import { validator } from '../middleware/validator.js';
import { io } from '../services/socketService.js';

const router = express.Router();

// Get all assignments
router.get('/', async (req, res, next) => {
    try {
        const assignments = await Assignment.find()
            .populate('complaintId')
            .populate('teamId')
            .sort({ createdAt: -1 });
        res.json(assignments);
    } catch (err) {
        next(err);
    }
});

// Create assignment (links complaint to team)
router.post(
    '/',
    [
        body('complaintId').isMongoId(),
        body('teamId').isMongoId()
    ],
    validator,
    async (req, res, next) => {
        try {
            const { complaintId, teamId } = req.body;

            // 1. Create Assignment
            const assignment = await Assignment.create({
                complaintId,
                teamId,
                status: 'affecté'
            });

            // 2. Update Complaint Status
            const updatedComplaint = await Complaint.findByIdAndUpdate(
                complaintId,
                { status: 'en cours' },
                { new: true }
            );

            // 3. Update Team Status
            await Team.findByIdAndUpdate(teamId, { status: 'intervention' });

            // 4. Automatically create an Intervention (optional, but requested in some context)
            const intervention = await Intervention.create({
                complaintId,
                teamId,
                title: `Intervention pour ${updatedComplaint?.number}`,
                description: `Réparation suite à la réclamation ${updatedComplaint?.number}`,
                status: 'En attente',
                priority: 'Moyenne'
            });

            const populated = await assignment.populate(['complaintId', 'teamId']);

            if (io) {
                io.emit('new-assignment', populated);
                io.emit('complaint-updated', updatedComplaint);
                io.emit('new-intervention', intervention);
            }

            res.status(201).json(populated);
        } catch (err) {
            next(err);
        }
    }
);

// Update assignment status
router.patch(
    '/:id',
    [
        param('id').isMongoId(),
        body('status').isIn(['affecté', 'en cours', 'terminé'])
    ],
    validator,
    async (req, res, next) => {
        try {
            const updated = await Assignment.findByIdAndUpdate(
                req.params.id,
                { status: req.body.status },
                { new: true }
            ).populate(['complaintId', 'teamId']);

            if (!updated) return res.status(404).json({ message: 'Affectation introuvable' });

            if (io) {
                io.emit('assignment-updated', updated);
            }

            res.json(updated);
        } catch (err) {
            next(err);
        }
    }
);

export default router;
