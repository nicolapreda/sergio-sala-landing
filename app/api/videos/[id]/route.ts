import { NextResponse } from 'next/server';
import {
    getVideoTestimonialById,
    deleteVideoTestimonial,
    updateVideoTestimonialVisibility,
} from '@/lib/db';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sergio2024';
const BUNNY_API_KEY = process.env.BUNNY_API_KEY!;
const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID!;

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: RouteContext) {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('password') !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
        return NextResponse.json({ error: 'ID non valido' }, { status: 400 });
    }

    try {
        const video = getVideoTestimonialById(id);
        if (!video) {
            return NextResponse.json({ error: 'Video non trovato' }, { status: 404 });
        }

        // Delete from Bunny Stream (best-effort, don't block on failure)
        try {
            await fetch(
                `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${video.bunny_video_id}`,
                {
                    method: 'DELETE',
                    headers: { AccessKey: BUNNY_API_KEY },
                }
            );
        } catch (e) {
            console.warn('Could not delete from Bunny CDN:', e);
        }

        deleteVideoTestimonial(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: "Errore durante l'eliminazione" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: RouteContext) {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('password') !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
        return NextResponse.json({ error: 'ID non valido' }, { status: 400 });
    }

    try {
        const { isVisible } = await request.json();
        updateVideoTestimonialVisibility(id, Boolean(isVisible));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Visibility update error:', error);
        return NextResponse.json({ error: "Errore nell'aggiornamento" }, { status: 500 });
    }
}
