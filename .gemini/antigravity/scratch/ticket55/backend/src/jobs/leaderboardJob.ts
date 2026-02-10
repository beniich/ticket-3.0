import cron from 'node-cron';
import gamificationService from '../services/gamificationService.js';

// Réinitialiser les statistiques hebdomadaires chaque lundi à minuit
cron.schedule('0 0 * * 1', async () => {
    try {
        console.log('Resetting weekly leaderboard stats...');
        await gamificationService.resetWeeklyStats();
        console.log('Weekly stats reset completed');
    } catch (error) {
        console.error('Error resetting weekly stats:', error);
    }
});

// Réinitialiser les statistiques mensuelles le premier jour de chaque mois
cron.schedule('0 0 1 * *', async () => {
    try {
        console.log('Resetting monthly leaderboard stats...');
        await gamificationService.resetMonthlyStats();
        console.log('Monthly stats reset completed');
    } catch (error) {
        console.error('Error resetting monthly stats:', error);
    }
});

// Mettre à jour les classements chaque heure
cron.schedule('0 * * * *', async () => {
    try {
        console.log('Updating leaderboard rankings...');
        // Ici vous pouvez implémenter la mise à jour des rangs
        console.log('Leaderboard rankings updated');
    } catch (error) {
        console.error('Error updating leaderboard rankings:', error);
    }
});

console.log('Leaderboard jobs scheduled');
