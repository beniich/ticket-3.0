import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmailAlert = async (to: string, subject: string, html: string) => {
    try {
        const info = await emailTransporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        });
        console.log('Email alert sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Failed to send email alert:', error);
        throw error; // Changed: throw error to propagate failure
    }
};

export const getEmailTemplate = (alert: any) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .btn { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .severity-${alert.severity} { 
                border-left: 4px solid ${alert.severity === 'critical' ? '#dc2626' :
            alert.severity === 'high' ? '#ea580c' :
                alert.severity === 'medium' ? '#ca8a04' : '#64748b'
        }; 
                padding-left: 15px; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Alerte ReclamTrack</h1>
                <p>${alert.title}</p>
            </div>
            <div class="content">
                <div class="severity-${alert.severity}">
                    <h2 style="color: ${alert.severity === 'critical' ? '#dc2626' :
            alert.severity === 'high' ? '#ea580c' :
                alert.severity === 'medium' ? '#ca8a04' : '#64748b'
        }">${alert.message}</h2>
                </div>
                <p><strong>Date:</strong> ${new Date(alert.triggeredAt).toLocaleString('fr-FR')}</p>
                ${alert.data ? `<p><strong>Détails:</strong></p><pre>${JSON.stringify(alert.data, null, 2)}</pre>` : ''}
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/alerts/${alert._id}" class="btn">Voir l'alerte</a>
            </div>
            <div class="footer">
                <p>Cette alerte a été générée automatiquement par ReclamTrack.</p>
                <p>© ${new Date().getFullYear()} ReclamTrack - Système de gestion municipale</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
