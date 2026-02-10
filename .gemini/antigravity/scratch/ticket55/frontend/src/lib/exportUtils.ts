import { saveAs } from 'file-saver';

export class ExportUtils {
    static async exportData(
        endpoint: string,
        format: 'excel' | 'pdf' | 'csv' = 'excel',
        params: Record<string, any> = {}
    ) {
        try {
            const queryParams = new URLSearchParams({
                format,
                ...params
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/export${endpoint}?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }

            const blob = await response.blob();
            const contentDisposition = response.headers.get('content-disposition');
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') || 'export.xlsx'
                : `export_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`;

            saveAs(blob, filename);
            return { success: true, filename };
        } catch (error) {
            console.error('Erreur export:', error);
            throw error;
        }
    }

    static async exportComplaints(params: any = {}) {
        return this.exportData('/complaints', 'excel', params);
    }

    static async exportPlanning(params: any = {}) {
        return this.exportData('/planning', 'excel', params);
    }

    static async exportDashboard(format: 'excel' | 'pdf' | 'csv' = 'excel', period?: string) {
        return this.exportData('/dashboard', format, { period });
    }

    static getExportFormats() {
        return [
            { value: 'excel', label: 'Excel (.xlsx)', icon: '📊' },
            { value: 'pdf', label: 'PDF (.pdf)', icon: '📄' },
            { value: 'csv', label: 'CSV (.csv)', icon: '📑' }
        ];
    }
}
