import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { envValidator } from './config/envValidator.js';
import { connectDB } from './config/db.js';
import { initSocket } from './services/socketService.js';
import { logger } from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';
import teamRoutes from './routes/teams.js';
import assignmentRoutes from './routes/assignments.js';
import planningRoutes from './routes/planning.js';
import dashboardRoutes from './routes/dashboard.js';
import aiRoutes from './routes/ai.js';
import alertRoutes from './routes/alerts.js';
import exportRoutes from './routes/export.js';
import messageRoutes from './routes/messages.js';
import documentRoutes from './routes/documents.js';
import gamificationRoutes from './routes/gamification.js';
import interventionRoutes from './routes/interventions.js';
import financeRoutes from './routes/finance.js';
import inventoryRoutes from './routes/inventory.js';
import './jobs/alertJobs.js';
import './jobs/leaderboardJob.js';
import './jobs/mcpJobs.js';

// Validate environment
envValidator();

const app = express();
const httpServer = createServer(app);

// Security middleware
app.use(helmet());
app.use(cors({ origin: '*' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/planning', planningRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/gamification', gamificationRoutes); // Added route mount
app.use('/api/finance', financeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'ReclamTrack API' });
});
app.use('/api/interventions', interventionRoutes);

// Error handler
app.use(errorHandler);

// Initialize Socket.IO
const io = initSocket(httpServer);
app.set('io', io);

// Start server
const start = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5001;
        httpServer.listen(PORT, () => {
            logger.info(`🚀 API ReclamTrack écoute sur le port ${PORT}`);
        });
    } catch (err) {
        logger.error('❌ Échec démarrage serveur', err);
        process.exit(1);
    }
};

start();
