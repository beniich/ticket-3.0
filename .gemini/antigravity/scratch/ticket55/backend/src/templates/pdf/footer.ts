import PDFDocument from 'pdfkit';
import { PDF_STYLES, PDF_FOOTER_CONFIG } from './styles';

export class PDFFooter {
    static addFooter(doc: PDFKit.PDFDocument, pageNumber: number, totalPages: number) {
        const { width } = doc.page;
        const footerY = doc.page.height - 30;
        const startX = PDF_STYLES.margins.left;

        // Numéro de page
        if (PDF_FOOTER_CONFIG.showPageNumbers) {
            doc.font(PDF_STYLES.fonts.normal)
                .fontSize(PDF_STYLES.fontSize.small)
                .fillColor(PDF_STYLES.colors.secondary)
                .text(
                    `Page ${pageNumber} sur ${totalPages}`,
                    startX,
                    footerY,
                    { align: 'center', width: width - PDF_STYLES.margins.left - PDF_STYLES.margins.right }
                );
        }

        // Confidentialité
        if (PDF_FOOTER_CONFIG.showConfidential) {
            doc.font(PDF_STYLES.fonts.italic)
                .fontSize(PDF_STYLES.fontSize.small)
                .fillColor(PDF_STYLES.colors.secondary)
                .text(
                    'Document confidentiel - Usage interne uniquement',
                    startX,
                    footerY + 15
                );
        }

        // Généré par
        if (PDF_FOOTER_CONFIG.showGeneratedBy) {
            doc.font(PDF_STYLES.fonts.normal)
                .fontSize(PDF_STYLES.fontSize.small)
                .fillColor(PDF_STYLES.colors.secondary)
                .text(
                    `Généré par ReclamTrack - ${new Date().getFullYear()}`,
                    width - PDF_STYLES.margins.right - 150,
                    footerY + 15
                );
        }
    }
}
