import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const payload = await request.json();

        // Mock response - en production, intégrer avec l'IA
        const mockResponse = {
            success: true,
            decision: {
                shouldSend: true,
                priority: payload.priority || 'medium',
                filtered: false
            },
            personalized: true,
            message: 'Notification créée avec succès'
        };

        return NextResponse.json(mockResponse);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create smart notification' },
            { status: 500 }
        );
    }
}
