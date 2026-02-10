import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DataFormatter } from '../utils/formatters.js';
import { PDFHeader } from '../templates/pdf/header.js';
import { PDFFooter } from '../templates/pdf/footer.js';
import { PDF_STYLES } from '../templates/pdf/styles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ExportService {
    private readonly EXPORT_DIR = path.join(__dirname, '../../exports');

    constructor() {
        // Créer le dossier d'export si nécessaire
        if (!fs.existsSync(this.EXPORT_DIR)) {
            fs.mkdirSync(this.EXPORT_DIR, { recursive: true });
        }
    }

    // Export Excel avancé
    async exportToExcel(data: any, options: ExportOptions): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'ReclamTrack';
        workbook.lastModifiedBy = 'ReclamTrack System';
        workbook.created = new Date();
        workbook.modified = new Date();

        // Créer la feuille principale
        const worksheet = workbook.addWorksheet(options.sheetName || 'Données');

        // Configurer les colonnes
        if (options.columns && options.columns.length > 0) {
            worksheet.columns = options.columns.map(col => ({
                header: col.header,
                key: col.key,
                width: col.width || 15
            }));
        }

        // Ajouter les données
        if (Array.isArray(data)) {
            data.forEach(row => {
                const formattedRow: any = {};
                Object.keys(row).forEach(key => {
                    formattedRow[key] = this.formatCellValue(row[key], key);
                });
                worksheet.addRow(formattedRow);
            });
        }

        // Styler l'en-tête
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF2563EB' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Ajouter des filtres
        worksheet.autoFilter = {
            from: 'A1',
            to: `${String.fromCharCode(64 + (options.columns?.length || 1))}1`
        };

        // Ajouter un résumé si demandé
        if (options.includeSummary && Array.isArray(data)) {
            const summarySheet = workbook.addWorksheet('Résumé');
            this.addSummaryToExcel(summarySheet, data, options.summaryFields || []);
        }

        // Générer le buffer
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    // Export PDF avancé
    async exportToPDF(data: any, options: ExportOptions): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margin: PDF_STYLES.margins
                });

                const chunks: Buffer[] = [];
                doc.on('data', chunk => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Ajouter l'en-tête
                PDFHeader.addHeader(doc, options.title || 'Rapport ReclamTrack', {
                    logoPath: path.join(__dirname, '../../public/templates/logo.png')
                });

                // Ajouter le titre principal
                doc.moveDown()
                    .font(PDF_STYLES.fonts.bold)
                    .fontSize(PDF_STYLES.fontSize.subtitle)
                    .text(options.title || 'Rapport de données', 50, 100);

                // Ajouter les métadonnées
                if (options.metadata) {
                    doc.font(PDF_STYLES.fonts.normal)
                        .fontSize(PDF_STYLES.fontSize.normal)
                        .moveDown();

                    Object.entries(options.metadata).forEach(([key, value]) => {
                        doc.text(`${key}: ${value}`);
                    });
                }

                // Ajouter les données en tableau
                if (Array.isArray(data) && data.length > 0) {
                    this.addDataTableToPDF(doc, data, options);
                }

                // Ajouter un graphique si demandé
                if (options.includeCharts && Array.isArray(data)) {
                    this.addChartsToPDF(doc, data, options);
                }

                // Ajouter le pied de page
                PDFFooter.addFooter(doc, 1, 1);

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    // Export CSV simple
    async exportToCSV(data: any, options: ExportOptions): Promise<string> {
        if (!Array.isArray(data)) {
            throw new Error('Les données doivent être un tableau pour l\'export CSV');
        }

        if (data.length === 0) {
            return '';
        }

        // Obtenir les colonnes à partir du premier objet
        const columns = options.columns?.map(col => col.key) || Object.keys(data[0]);
        const headers = options.columns?.map(col => col.header) || columns;

        // Créer l'en-tête CSV
        let csvContent = headers.join(';') + '\n';

        // Ajouter les lignes de données
        data.forEach(row => {
            const values = columns.map(col => {
                const value = row[col];
                const formattedValue = this.formatCellValue(value, col);
                // Échapper les caractères spéciaux
                return `"${String(formattedValue).replace(/"/g, '""')}"`;
            });
            csvContent += values.join(';') + '\n';
        });

        return csvContent;
    }

    // Formatage des cellules pour Excel
    private formatCellValue(value: any, columnKey: string): any {
        if (value === null || value === undefined) {
            return '';
        }

        // Formatage spécial pour certaines colonnes
        switch (columnKey.toLowerCase()) {
            case 'date':
            case 'createdat':
            case 'updatedat':
            case 'resolvedat':
                return DataFormatter.formatDate(value);

            case 'priority':
            case 'priorité':
                return DataFormatter.formatPriority(value);

            case 'status':
            case 'statut':
                return DataFormatter.formatStatus(value);

            case 'category':
            case 'catégorie':
                return DataFormatter.formatCategory(value);

            case 'amount':
            case 'montant':
                return typeof value === 'number' ? DataFormatter.formatNumber(value) : value;

            default:
                if (typeof value === 'object') {
                    return JSON.stringify(DataFormatter.sanitizeData(value));
                }
                return DataFormatter.sanitizeData(value);
        }
    }

    // Ajouter un résumé à l'Excel
    private addSummaryToExcel(worksheet: ExcelJS.Worksheet, data: any[], fields: string[]) {
        worksheet.addRow(['']);
        worksheet.addRow(['RÉSUMÉ']);

        fields.forEach(field => {
            const values = data.map(item => item[field]).filter(v => v !== undefined);
            if (values.length > 0) {
                const numericValues = values.filter(v => typeof v === 'number');
                if (numericValues.length > 0) {
                    const sum = numericValues.reduce((a, b) => a + b, 0);
                    const avg = sum / numericValues.length;
                    const min = Math.min(...numericValues);
                    const max = Math.max(...numericValues);

                    worksheet.addRow([`${field} - Total:`, sum]);
                    worksheet.addRow([`${field} - Moyenne:`, avg]);
                    worksheet.addRow([`${field} - Minimum:`, min]);
                    worksheet.addRow([`${field} - Maximum:`, max]);
                }
            }
        });
    }

    // Ajouter un tableau de données au PDF
    private addDataTableToPDF(doc: PDFKit.PDFDocument, data: any[], options: ExportOptions) {
        const startX = PDF_STYLES.margins.left;
        let currentY = doc.y + 30;

        // Colonnes à afficher
        const columns = options.columns?.map(col => ({
            header: col.header,
            key: col.key,
            width: col.width || 100
        })) || Object.keys(data[0]).map(key => ({
            header: key,
            key,
            width: 100
        }));

        // Dessiner l'en-tête du tableau
        let currentX = startX;
        columns.forEach(col => {
            doc.rect(currentX, currentY, col.width, 20)
                .fillAndStroke('#2563eb', '#2563eb');

            doc.fillColor('white')
                .font(PDF_STYLES.fonts.bold)
                .fontSize(PDF_STYLES.fontSize.small)
                .text(col.header, currentX + 5, currentY + 7, {
                    width: col.width - 10,
                    align: 'left'
                });

            currentX += col.width;
        });

        // Dessiner les lignes de données
        currentY += 25;
        const maxHeight = doc.page.height - 100;

        data.slice(0, 50).forEach((row, rowIndex) => {
            // Vérifier si on doit changer de page
            if (currentY > maxHeight) {
                doc.addPage();
                currentY = 50;
            }

            currentX = startX;
            columns.forEach(col => {
                doc.rect(currentX, currentY, col.width, 15)
                    .stroke('#cbd5e1');

                const value = this.formatCellValue(row[col.key], col.key);
                doc.fillColor('black')
                    .font(PDF_STYLES.fonts.normal)
                    .fontSize(PDF_STYLES.fontSize.small)
                    .text(String(value), currentX + 5, currentY + 3, {
                        width: col.width - 10,
                        align: 'left'
                    });

                currentX += col.width;
            });

            currentY += 20;
        });

        doc.moveDown();
    }

    // Ajouter des graphiques au PDF (simplifié)
    private addChartsToPDF(doc: PDFKit.PDFDocument, data: any[], options: ExportOptions) {
        doc.addPage();
        doc.font(PDF_STYLES.fonts.bold)
            .fontSize(PDF_STYLES.fontSize.subtitle)
            .text('Graphiques', 50, 50);

        // Ici vous pouvez ajouter des graphiques simples
        // Pour l'instant, on ajoute un placeholder
        doc.rect(100, 100, 400, 200)
            .stroke('#cbd5e1');

        doc.font(PDF_STYLES.fonts.normal)
            .fontSize(PDF_STYLES.fontSize.normal)
            .text('Graphique des données (à implémenter)', 200, 180);
    }

    // Générer un nom de fichier unique
    generateFilename(baseName: string, extension: string): string {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        return `${baseName}_${timestamp}.${extension}`;
    }

    // Sauvegarder le fichier localement
    async saveToFile(buffer: Buffer, filename: string): Promise<string> {
        const filePath = path.join(this.EXPORT_DIR, filename);
        await fs.promises.writeFile(filePath, buffer);
        return filePath;
    }
}

export interface ExportOptions {
    format: 'excel' | 'pdf' | 'csv';
    sheetName?: string;
    title?: string;
    columns?: ExportColumn[];
    includeSummary?: boolean;
    summaryFields?: string[];
    includeCharts?: boolean;
    metadata?: Record<string, string>;
}

export interface ExportColumn {
    header: string;
    key: string;
    width?: number;
}

export default new ExportService();
