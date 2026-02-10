import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Create client only if creds exist to avoid crash if not configured
let client: any;
try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
    }
} catch (e) {
    console.warn('Twilio client initialization failed, SMS alerts will not work.');
}

export const sendSMSAlert = async (to: string, message: string) => {
    if (!client) {
        console.warn('Twilio not configured, skipping SMS');
        return;
    }
    try {
        const result = await client.messages.create({
            body: `[ReclamTrack] ${message}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });
        console.log('SMS alert sent:', result.sid);
        return result;
    } catch (error) {
        console.error('Failed to send SMS alert:', error);
        // throw error; // Don't throw to avoid crashing flow if SMS fails
    }
};

export const getSmsTemplate = (alert: any) => {
    const severityEmoji: any = {
        critical: '🚨',
        high: '⚠️',
        medium: '🔔',
        low: 'ℹ️'
    };

    return `${severityEmoji[alert.severity] || '🔔'} ${alert.title}\n\n${alert.message.substring(0, 120)}...\nVoir: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/alerts`;
};
