export const PDF_STYLES = {
    fonts: {
        regular: 'Helvetica',
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italic: 'Helvetica-Oblique'
    },

    colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        background: '#ffffff',
        text: '#000000',
        borderColor: '#cbd5e1'
    },

    margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    },

    fontSize: {
        title: 18,
        subtitle: 14,
        heading: 12,
        normal: 10,
        small: 8
    },

    table: {
        headerBackgroundColor: '#f1f5f9',
        borderColor: '#cbd5e1',
        rowHeight: 20,
        headerHeight: 25
    }
};

export const PDF_HEADER_CONFIG = {
    height: 80,
    showLogo: true,
    showTitle: true,
    showDate: true,
    showPageNumbers: true
};

export const PDF_FOOTER_CONFIG = {
    height: 40,
    showSignature: false,
    showConfidential: true,
    showGeneratedBy: true,
    showPageNumbers: true
};
