import { NextResponse } from 'next/server';
import { getVisibleVideoTestimonials, getAllVideoTestimonials } from '@/lib/db';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sergio2024';
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME || 'vz-644ea2f1-c54.b-cdn.net';
const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID || '689541';

function mapVideo(row: ReturnType<typeof getVisibleVideoTestimonials>[number]) {
    return {
        id: row.id,
        bunnyVideoId: row.bunny_video_id,
        title: row.title,
        personName: row.person_name,
        description: row.description,
        isVisible: row.is_visible === 1,
        thumbnailUrl: `https://${BUNNY_CDN_HOSTNAME}/${row.bunny_video_id}/thumbnail.jpg`,
        embedUrl: `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${row.bunny_video_id}?autoplay=false&loop=false&muted=false&responsive=true&preload=false`,
        createdAt: row.created_at,
    };
}

// Public: returns only visible videos (for landing page)
// With ?password=...: returns all videos (for admin)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    try {
        if (password === ADMIN_PASSWORD) {
            const rows = getAllVideoTestimonials();
            return NextResponse.json({ videos: rows.map(mapVideo) });
        }

        const rows = getVisibleVideoTestimonials();
        return NextResponse.json({ videos: rows.map(mapVideo) });
    } catch (error) {
        console.error('Error fetching videos:', error);
        return NextResponse.json({ error: 'Errore nel recupero dei video' }, { status: 500 });
    }
}
