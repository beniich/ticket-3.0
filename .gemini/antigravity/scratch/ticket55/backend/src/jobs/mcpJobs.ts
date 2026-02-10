import cron from 'node-cron';
import mcpNotificationService from '../services/mcpNotificationService.js';
import { User } from '../models/User.js';

// Digest quotidien à 8h00 du matin
cron.schedule('0 8 * * *', async () => {
    try {
        console.log('[MCP] Démarrage du job de digest quotidien...');
        const users = await User.find({ isActive: true }).select('_id');

        for (const user of users) {
            try {
                await mcpNotificationService.createSmartDigest(user._id.toString(), 'daily');
            } catch (err) {
                console.error(`[MCP] Échec digest quotidien pour ${user._id}:`, err);
            }
        }
        console.log('[MCP] Job de digest quotidien terminé');
    } catch (error) {
        console.error('[MCP] Erreur critique job digest quotidien:', error);
    }
});

// Digest hebdomadaire le lundi à 9h00
cron.schedule('0 9 * * 1', async () => {
    try {
        console.log('[MCP] Démarrage du job de digest hebdomadaire...');
        const users = await User.find({ isActive: true }).select('_id');

        for (const user of users) {
            try {
                await mcpNotificationService.createSmartDigest(user._id.toString(), 'weekly');
            } catch (err) {
                console.error(`[MCP] Échec digest hebdomadaire pour ${user._id}:`, err);
            }
        }
        console.log('[MCP] Job de digest hebdomadaire terminé');
    } catch (error) {
        console.error('[MCP] Erreur critique job digest hebdomadaire:', error);
    }
});

console.log('✅ Jobs MCP planifiés (Digests Quotidiens/Hebdomadaires)');
