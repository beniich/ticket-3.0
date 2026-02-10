import { NextResponse } from 'next/server';

// Mock data - en production, utiliser une base de données
const mockSettings = {
    brand: {
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBuvd1OBcVCaivXb3baQyIGEGqxVKXtQaZg_SdLLprIgN08fncFuH2UqfTngTWDn0f2qu7y__mARfuYasbj4VjfE2jBoGLbkQgDgWkQ7mBdTTqvGg1tWeeunCiB9s_jUvLbHHoVf8ZTUv5DckRDPHU7J2tMxgt_XYxWHBdipkb5d7ZqlqrMheWjzqTxuVnM_gHNaTSaaYuVLGlOrmtPiBm80-ggGq7vSk4_MusCxgGLso9LzzFaNko2jiiQ99aAnMAdH_DNQQfgqht",
        colors: {
            primary: "#2424EB",
            dark: "#111121",
            success: "#10B981"
        },
        typography: {
            heading: "Inter SemiBold",
            body: "Inter Regular"
        }
    },
    integrations: [
        {
            id: "sms",
            name: "SMS Gateway",
            provider: "Twilio / Infobip",
            enabled: true,
            apiKey: "sk_test_51Mz4p9L2pZ7...",
            status: "connected",
            icon: "sms"
        },
        {
            id: "mapping",
            name: "Mapping Service",
            provider: "Google Maps / Mapbox",
            enabled: true,
            apiKey: "GM_AIzaSyB3v9X2_kL0...",
            status: "connected",
            icon: "map"
        },
        {
            id: "iot",
            name: "IoT Sensor Network",
            provider: "Leak Detection System",
            enabled: true,
            clientId: "IOT-CORE-PRD-772",
            status: "connected",
            icon: "sensors"
        },
        {
            id: "smtp",
            name: "SMTP Relay",
            provider: "Email Notifications",
            enabled: true,
            apiKey: "SG.vX9L_o2nRQ6pW7y3...",
            status: "connected",
            icon: "mail"
        }
    ],
    notifications: [
        {
            id: "security",
            name: "Security Alerts",
            description: "Immediate push notifications for suspicious login attempts.",
            channels: ["EMAIL", "PUSH"]
        },
        {
            id: "weekly",
            name: "Weekly Report",
            description: "Summary of platform performance every Monday morning.",
            channels: ["EMAIL ONLY"]
        },
        {
            id: "billing",
            name: "Billing Updates",
            description: "Invoices and subscription status changes.",
            channels: ["ALL CHANNELS"]
        }
    ],
    preferences: {
        language: "English (US)",
        darkMode: true,
        compactView: false
    },
    maintenance: {
        status: "operational",
        cacheSize: "1.2 GB"
    },
    metadata: {
        version: "4.8.2-stable",
        lastUpdated: "2 hours ago",
        updatedBy: "arivera"
    }
};

export async function GET() {
    return NextResponse.json(mockSettings);
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        // En production, sauvegarder dans la base de données
        return NextResponse.json({
            success: true,
            message: "Settings updated successfully",
            data
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update settings" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const updates = await request.json();
        // En production, mettre à jour partiellement
        return NextResponse.json({
            success: true,
            message: "Settings partially updated",
            updates
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
