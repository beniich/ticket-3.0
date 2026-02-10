import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export class DataFormatter {
    // Formater les dates
    static formatDate(date: Date | string): string {
        if (!date) return 'N/A';
        return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
    }

    // Formater les priorités
    static formatPriority(priority: string): string {
        const translations: Record<string, string> = {
            'low': 'Basse',
            'medium': 'Moyenne',
            'high': 'Haute',
            'urgent': 'Urgente'
        };
        return translations[priority] || priority;
    }

    // Formater les statuts
    static formatStatus(status: string): string {
        const translations: Record<string, string> = {
            'pending': 'En attente',
            'assigned': 'Assignée',
            'in_progress': 'En cours',
            'resolved': 'Résolue',
            'closed': 'Fermée'
        };
        return translations[status] || status;
    }

    // Formater les catégories
    static formatCategory(category: string): string {
        const translations: Record<string, string> = {
            'water': 'Eau',
            'electricity': 'Électricité',
            'roads': 'Routes',
            'sanitation': 'Assainissement',
            'lighting': 'Éclairage public',
            'waste': 'Collecte déchets',
            'green_spaces': 'Espaces verts',
            'buildings': 'Bâtiments publics',
            'telecom': 'Télécommunications',
            'other': 'Autre'
        };
        return translations[category] || category;
    }

    // Convertir nombres en français
    static formatNumber(num: number): string {
        return num.toLocaleString('fr-FR');
    }

    // Convertir pourcents
    static formatPercentage(value: number): string {
        return `${value.toFixed(1)}%`;
    }

    // Tronquer les textes longs
    static truncateText(text: string, maxLength: number = 50): string {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Nettoyer les données pour export
    static sanitizeData(data: any): any {
        if (typeof data === 'object' && data !== null) {
            if (Array.isArray(data)) {
                return data.map(item => this.sanitizeData(item));
            }
            const sanitized: any = {};
            for (const [key, value] of Object.entries(data)) {
                sanitized[key] = this.sanitizeData(value);
            }
            return sanitized;
        }
        if (typeof data === 'string') {
            // Nettoyer les caractères spéciaux problématiques
            return data.replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
        }
        return data;
    }
}
