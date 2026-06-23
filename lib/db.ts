import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Store DB in /data directory (mounted as Docker volume) or fallback to project root
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'leads.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
    if (_db) return _db;

    _db = new Database(DB_PATH);

    // Enable WAL mode for better concurrent read performance
    _db.pragma('journal_mode = WAL');

    // Create leads table if it doesn't exist
    _db.exec(`
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            business_type TEXT,
            challenge TEXT,
            source TEXT DEFAULT 'landing-page',
            ghl_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create video_testimonials table if it doesn't exist
    _db.exec(`
        CREATE TABLE IF NOT EXISTS video_testimonials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bunny_video_id TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            person_name TEXT,
            description TEXT,
            is_visible INTEGER DEFAULT 1,
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    return _db;
}

export interface LeadRow {
    id: number;
    name: string;
    email: string;
    phone: string;
    business_type: string | null;
    challenge: string | null;
    source: string;
    ghl_id: string | null;
    created_at: string;
}

export function insertLead(lead: {
    name: string;
    email: string;
    phone: string;
    businessType?: string;
    challenge?: string;
    ghlId?: string;
}): LeadRow {
    const db = getDb();
    const stmt = db.prepare(`
        INSERT INTO leads (name, email, phone, business_type, challenge, ghl_id)
        VALUES (@name, @email, @phone, @businessType, @challenge, @ghlId)
        RETURNING *
    `);
    return stmt.get({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        businessType: lead.businessType || null,
        challenge: lead.challenge || null,
        ghlId: lead.ghlId || null,
    }) as LeadRow;
}

export function getAllLeads(): LeadRow[] {
    const db = getDb();
    return db.prepare(`SELECT * FROM leads ORDER BY created_at DESC`).all() as LeadRow[];
}

export function getLeadsCount(): number {
    const db = getDb();
    const row = db.prepare(`SELECT COUNT(*) as count FROM leads`).get() as { count: number };
    return row.count;
}

export interface VideoTestimonialRow {
    id: number;
    bunny_video_id: string;
    title: string;
    person_name: string | null;
    description: string | null;
    is_visible: number;
    sort_order: number;
    created_at: string;
}

export function insertVideoTestimonial(data: {
    bunnyVideoId: string;
    title: string;
    personName?: string;
    description?: string;
}): VideoTestimonialRow {
    const db = getDb();
    return db.prepare(`
        INSERT INTO video_testimonials (bunny_video_id, title, person_name, description)
        VALUES (@bunnyVideoId, @title, @personName, @description)
        RETURNING *
    `).get({
        bunnyVideoId: data.bunnyVideoId,
        title: data.title,
        personName: data.personName || null,
        description: data.description || null,
    }) as VideoTestimonialRow;
}

export function getAllVideoTestimonials(): VideoTestimonialRow[] {
    return getDb()
        .prepare(`SELECT * FROM video_testimonials ORDER BY sort_order ASC, created_at DESC`)
        .all() as VideoTestimonialRow[];
}

export function getVisibleVideoTestimonials(): VideoTestimonialRow[] {
    return getDb()
        .prepare(`SELECT * FROM video_testimonials WHERE is_visible = 1 ORDER BY sort_order ASC, created_at DESC`)
        .all() as VideoTestimonialRow[];
}

export function getVideoTestimonialById(id: number): VideoTestimonialRow | undefined {
    return getDb()
        .prepare(`SELECT * FROM video_testimonials WHERE id = ?`)
        .get(id) as VideoTestimonialRow | undefined;
}

export function deleteVideoTestimonial(id: number): void {
    getDb().prepare(`DELETE FROM video_testimonials WHERE id = ?`).run(id);
}

export function updateVideoTestimonialVisibility(id: number, isVisible: boolean): void {
    getDb()
        .prepare(`UPDATE video_testimonials SET is_visible = ? WHERE id = ?`)
        .run(isVisible ? 1 : 0, id);
}
