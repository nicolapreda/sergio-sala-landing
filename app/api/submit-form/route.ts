import { NextResponse } from 'next/server';
import { insertLead } from '@/lib/db';
import { createLogger } from '@/lib/logger';

const log = createLogger('submit-form');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, business } = body;
        // 'business' is the free-text field "Di cosa ti occupi?" from the form

        // Validation
        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: 'Tutti i campi obbligatori devono essere compilati' },
                { status: 400 }
            );
        }

        // ✅ Save lead to local SQLite DB first — always
        try {
            const saved = insertLead({
                name,
                email,
                phone,
                businessType: 'Non specificato',
                challenge: business || 'Non specificato', // free-text "Di cosa ti occupi?"
            });
            log.info('✅ Lead salvato — id:', saved.id);
        } catch (dbError) {
            log.error('❌ Errore salvataggio DB:', dbError);
            // If DB fails, return a real error to the user
            return NextResponse.json(
                { error: 'Errore interno del server' },
                { status: 500 }
            );
        }

        // Try to send to GoHighLevel — best effort, never blocks success response
        const API_KEY = process.env.GOHIGHLEVEL_API_KEY;
        if (API_KEY) {
            try {
                const payload = {
                    email,
                    phone,
                    firstName: name.split(' ')[0] || name,
                    lastName: name.split(' ').slice(1).join(' ') || '',
                    name,
                    tags: ['Landing SSA'],
                    source: 'Landing Page SSA',
                    dateAdded: new Date().toISOString(),
                    customFields: [
                        { key: 'business_type', field_value: 'Non specificato' },
                        { key: 'challenge', field_value: business || 'Non specificato' },
                    ],
                };

                const response = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const data = await response.json();
                    log.info('✅ GHL — contatto creato:', data?.contact?.id);
                } else {
                    const errorText = await response.text();
                    log.warn('⚠️ GHL — risposta non ok:', response.status, errorText.slice(0, 200));
                }
            } catch (ghlError) {
                log.warn('⚠️ GHL — non raggiungibile:', (ghlError as Error).message);
            }
        }

        // Always return success after DB save
        return NextResponse.json({ success: true });

    } catch (error) {
        log.error('💥 Errore inatteso:', error);
        return NextResponse.json(
            { error: 'Errore interno del server' },
            { status: 500 }
        );
    }
}
