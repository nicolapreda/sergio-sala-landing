import { NextResponse } from 'next/server';
import { insertVideoTestimonial } from '@/lib/db';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sergio2024';
const BUNNY_API_KEY = process.env.BUNNY_API_KEY!;
const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID!;

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('password') !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('video') as File | null;
        const title = formData.get('title') as string | null;
        const personName = formData.get('personName') as string | null;
        const description = formData.get('description') as string | null;

        if (!file || !title?.trim()) {
            return NextResponse.json({ error: 'File video e titolo sono obbligatori' }, { status: 400 });
        }

        // 1. Create video entry on Bunny Stream
        const createRes = await fetch(
            `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
            {
                method: 'POST',
                headers: {
                    AccessKey: BUNNY_API_KEY,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ title: title.trim() }),
            }
        );

        if (!createRes.ok) {
            const errText = await createRes.text();
            console.error('Bunny create error:', errText);
            throw new Error('Errore nella creazione del video su Bunny CDN');
        }

        const { guid: bunnyVideoId } = await createRes.json();

        // 2. Upload video binary to Bunny Stream
        const videoBuffer = await file.arrayBuffer();
        const uploadRes = await fetch(
            `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${bunnyVideoId}`,
            {
                method: 'PUT',
                headers: {
                    AccessKey: BUNNY_API_KEY,
                    'Content-Type': 'application/octet-stream',
                },
                body: videoBuffer,
            }
        );

        if (!uploadRes.ok) {
            const errText = await uploadRes.text();
            console.error('Bunny upload error:', errText);
            throw new Error('Errore nel caricamento del video su Bunny CDN');
        }

        // 3. Save metadata to local DB
        const video = insertVideoTestimonial({
            bunnyVideoId,
            title: title.trim(),
            personName: personName?.trim() || undefined,
            description: description?.trim() || undefined,
        });

        return NextResponse.json({ success: true, video });
    } catch (error) {
        console.error('Upload error:', error);
        const message = error instanceof Error ? error.message : 'Errore durante il caricamento';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
