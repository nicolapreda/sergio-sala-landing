import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, business, challenge } = body;

        // Validation
        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: 'Tutti i campi obbligatori devono essere compilati' },
                { status: 400 }
            );
        }

        const API_KEY = process.env.GOHIGHLEVEL_API_KEY;

        if (!API_KEY) {
            console.error('GOHIGHLEVEL_API_KEY mancante');
            return NextResponse.json(
                { error: 'Configurazione server errata' },
                { status: 500 }
            );
        }

        const payload = {
            email,
            phone,
            firstName: name.split(' ')[0] || name,
            lastName: name.split(' ').slice(1).join(' ') || '',
            name: name,
            tags: ["Landing SSA"],
            source: "Landing Page SSA",
            dateAdded: new Date().toISOString(),
            customFields: [
                {
                    key: "business_type",
                    field_value: business || "Non specificato"
                },
                {
                    key: "challenge",
                    field_value: challenge || "Non specificato"
                }
            ]
        };

        console.log('Invio dati a GoHighLevel...', payload);

        const response = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Lead inviato con successo:', data);
            return NextResponse.json({ success: true, data });
        } else {
            const errorText = await response.text();
            console.error('❌ Errore GHL:', errorText);

            // Fallback response for the user even if GHL fails, 
            // ideally we should save to DB/File here but for Vercel/Next non-persistent envs 
            // we return error to let the user try again or log it properly.
            // For now, we return 500.
            return NextResponse.json(
                { error: 'Errore durante l\'invio al CRM' },
                { status: response.status }
            );
        }

    } catch (error) {
        console.error('💥 Errore Server:', error);
        return NextResponse.json(
            { error: 'Errore interno del server' },
            { status: 500 }
        );
    }
}
