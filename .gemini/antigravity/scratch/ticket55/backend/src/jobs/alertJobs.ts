import cron from 'node-cron';
import alertService from '../services/alertService.js';
import Alert from '../models/Alert.js';

// Job toutes les 30 minutes pour vérifier les seuils
cron.schedule('*/30 * * * *', async () => {
    try {
        await alertService.checkThresholdAlerts();
        console.log('Alert threshold check completed');
    } catch (error) {
        console.error('Alert threshold job failed:', error);
    }
});

// Job quotidien pour nettoyer les anciennes alertes résolues
cron.schedule('0 2 * * *', async () => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await Alert.deleteMany({
            resolved: true,
            resolvedAt: { $lt: thirtyDaysAgo }
        });

        console.log(`Cleaned up ${result.deletedCount} old resolved alerts`);
    } catch (error) {
        console.error('Alert cleanup job failed:', error);
    }
});

// Job hebdomadaire pour statistiques
cron.schedule('0 3 * * 1', async () => {
    try {
        console.log('Weekly alert statistics job running...');
        // Ici vous pouvez générer des rapports hebdomadaires
    } catch (error) {
        console.error('Weekly alert stats job failed:', error);
    }
});

console.log('Alert jobs scheduled and running');
