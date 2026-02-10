import { NextResponse } from 'next/server';

// Données mock - en production, utiliser une base de données
const mockTicket = {
    id: "REC-001",
    title: "Water Leakage in Main Lobby",
    status: "In Progress",
    priority: "High",
    date: "Oct 24, 2023",
    time: "09:00 AM",
    source: "Web Portal",
    timeline: [
        {
            id: "1",
            type: "created",
            title: "Complaint Created",
            description: "System generated via customer portal",
            timestamp: "Oct 24, 09:00 AM",
            icon: "check",
            color: "emerald"
        },
        {
            id: "2",
            type: "assigned",
            title: "Assigned to Technical Team",
            description: "Handled by John Smith (Supervisor)",
            timestamp: "Oct 24, 10:30 AM",
            icon: "person",
            color: "indigo"
        },
        {
            id: "3",
            type: "progress",
            title: "Intervention In Progress",
            description: "Technician dispatched to onsite location",
            timestamp: "JUST NOW",
            icon: "engineering",
            color: "primary",
            statusUpdate: "Main valve located, preparing for pipe replacement. Tools assembled and site secured."
        }
    ],
    details: {
        description: "Customer reports a significant water leak originating from the ceiling of the main entrance lobby. The leak has caused a slippery surface near the elevator banks. The building management has placed warning signs, but the volume of water is increasing.",
        criticalConcern: "Immediate intervention is required to prevent electrical damage to the nearby control panel located behind the front desk.",
        targetArea: "Lobby G-Floor, East Wing",
        riskFactor: "Electrical Short Circuit Risk"
    },
    notes: [
        {
            id: "note1",
            author: "John Smith",
            initials: "JS",
            role: "Supervisor",
            timestamp: "2 hours ago",
            content: "Notified the electrical maintenance team to be on standby just in case the leak spreads to the riser room."
        }
    ],
    client: {
        company: "Acme Property Corp",
        contact: "Robert Wilson",
        phone: "+1 (555) 123-4567",
        email: "robert@acmeproperty.com",
        address: "4521 Business Plaza, Suite 402,\nNew York, NY 10001",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIc9sV5wHJ1_r5ZJVJNjKIuTgrpTifVAOQmdaMqnHGMti5kThqV81XerlNh1C5qJfvk_TJPs29DW0VXlDqmxTvyik7vCDGIkLDNCrg7lB6boRdQqfUDKdjGwpx9vVjixzzFCfVVrqFzZxiZjw6UlDaNhuFcHwXWLQ_a2Jn8RlB3jRaopW5Elhi9jhsGbEY2eOuj0I6iQxfROWn01UD8u-tgc6QaQIZJHEjBkpPZs8ARBPn6sbonlC4oMuue_TcLY3I6KRigxMLVNEZ"
    },
    site: {
        level: "LEVEL G",
        coordinates: "40.7128° N, 74.0060° W",
        eta: "15 mins from Base"
    },
    evidence: [
        {
            id: "photo1",
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDa1c-g9veYZ9qYNPUcHwXWF26F_kE79WEUx4RIhoRHnB5ZpnoyPm04veeKsgRAar-MZCbaT1Ro-r_Y-lBtcOdX879n_xUZBRhEZa1uwuBlSDfQswTSpYraJDRasP87ix5L91QgV9jlIPsY7s9aIYqCCLLSHSUMUHMMfFnuY0YE2JdImqGWE5AHy54DDh8BRhJB0XR9NqSR9ru2s7qPs_FlfiDsNRmVeU7a48t_KICRwcoNJN6vD3X_Y-XM_HpQ05LJjXMPBzwWLdaW",
            alt: "Ceiling leak photo"
        },
        {
            id: "photo2",
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuADXtFNRxQiRnjIhKPwbwTgxWHhuMnZ5CzhCZ82RtYC2CJOZkO_CY6nwSIaIFmxnlZ7sI8UVmyIVXoriLhkPrAjzroDC73ZPuw-6wwqV0X2pBwPt_EZGY-5Yri8ag7nyJ5xuwQ1rtLmai9OrHux33-tRFxFPbriETf8CGknZNN1YIFcXn5DD4b4KO8qyWcQ_BIOffMo7x4m7pTlvmG5AOSX6QoB7dj1vBXqxGbADVAxJsYF8n0IzcucKOLzLNKICm-eLKXPpnac-gYP",
            alt: "Lobby flooding photo"
        }
    ]
};

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    // Simuler une recherche par ID
    if (id === "REC-001") {
        return NextResponse.json(mockTicket);
    }

    return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
    );
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();

        // En production, ajouter la note à la base de données
        return NextResponse.json({
            success: true,
            message: "Note added successfully",
            note: {
                id: `note${Date.now()}`,
                ...data
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to add note" },
            { status: 500 }
        );
    }
}
