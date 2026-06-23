import { NextResponse } from 'next/server';
import { getAllLeads, getLeadsCount } from '@/lib/db';
import { createLogger } from '@/lib/logger';

const log = createLogger('leads');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sergio2024';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';

    if (password !== ADMIN_PASSWORD) {
        log.warn('🚫 Accesso negato — ip:', ip);
        return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    try {
        const leads = getAllLeads();
        const total = getLeadsCount();

        log.info(`🔓 Accesso admin — ip: ${ip} — lead totali: ${total}`);

        const mapped = leads.map((row) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            businessType: row.business_type || 'N/D',
            challenge: row.challenge || 'N/D',
            dateAdded: row.created_at,
            ghlId: row.ghl_id,
        }));

        return NextResponse.json({ leads: mapped, total });
    } catch (error) {
        log.error('❌ Errore lettura DB:', error);
        return NextResponse.json({ error: 'Errore nel recupero dei lead' }, { status: 500 });
    }
}
