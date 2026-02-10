import PDFDocument from 'pdfkit';
import { PDF_STYLES, PDF_HEADER_CONFIG } from './styles';

export class PDFHeader {
    static async addHeader(
        doc: PDFKit.PDFDocument,
        title: string,
        options: any = {}
    ) {
        const { width } = doc.page;
        const startX = PDF_STYLES.margins.left;
        const headerY = 20;

        // Ajouter logo si disponible
        if (PDF_HEADER_CONFIG.showLogo && options.logoPath) {
            try {
                doc.image(options.logoPath, startX, headerY, { width: 40, height: 40 });
            } catch (error) {
                console.warn('Logo non trouvé:', error);
            }
        }

        // Titre du document
        if (PDF_HEADER_CONFIG.showTitle) {
            const titleX = PDF_HEADER_CONFIG.showLogo && options.logoPath ?
                startX + 50 : startX;

            doc.font(PDF_STYLES.fonts.bold)
                .fontSize(PDF_STYLES.fontSize.title)
                .fillColor(PDF_STYLES.colors.primary)
                .text(title, titleX, headerY);
        }

        // Date de génération
        if (PDF_HEADER_CONFIG.showDate) {
            const dateStr = new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            doc.font(PDF_STYLES.fonts.normal)
                .fontSize(PDF_STYLES.fontSize.small)
                .fillColor(PDF_STYLES.colors.secondary)
                .text(`Généré le: ${dateStr}`, startX, headerY + 25);
        }

        // Ligne de séparation
        doc.moveTo(startX, 60)
            .lineTo(width - PDF_STYLES.margins.right, 60)
            .strokeColor(PDF_STYLES.colors.borderColor)
            .stroke();

        return 80; // Hauteur de l'en-tête
    }
}
