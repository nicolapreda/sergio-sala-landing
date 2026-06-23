'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    businessType: string;
    challenge: string;
    dateAdded: string;
    ghlId?: string;
}

interface VideoTestimonial {
    id: number;
    bunnyVideoId: string;
    title: string;
    personName: string | null;
    description: string | null;
    isVisible: boolean;
    thumbnailUrl: string;
    embedUrl: string;
    createdAt: string;
}

const BUSINESS_LABELS: Record<string, string> = {
    'centro-benessere': '🧖 Centro Benessere',
    'studio-medico': '🏥 Studio Medico',
    'ristorante': '🍽️ Ristorante',
    'palestra': '💪 Palestra',
    'e-commerce': '🛒 E-commerce',
    'consulente': '💼 Consulente',
    'altro': '📦 Altro',
    'Non specificato': '—',
};

function formatDate(dateStr: string) {
    if (!dateStr) return 'N/D';
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getInitial(name: string) {
    return (name || '?').charAt(0).toUpperCase();
}

export default function AdminPage() {
    const [inputPassword, setInputPassword] = useState('');
    const [password, setPassword] = useState('');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [search, setSearch] = useState('');
    const [filterBusiness, setFilterBusiness] = useState('');
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [activeTab, setActiveTab] = useState<'leads' | 'videos'>('leads');

    // Video state
    const [videos, setVideos] = useState<VideoTestimonial[]>([]);
    const [videosLoading, setVideosLoading] = useState(false);
    const [videoTitle, setVideoTitle] = useState('');
    const [videoPersonName, setVideoPersonName] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchLeads = useCallback(async (pwd: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/leads?password=${encodeURIComponent(pwd)}`);
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 401) {
                    sessionStorage.removeItem('admin_pwd');
                    setError('Password errata. Riprova.');
                    setAuthenticated(false);
                } else {
                    setError(data.error || 'Errore nel caricamento dei lead.');
                }
            } else {
                sessionStorage.setItem('admin_pwd', pwd);
                setLeads(data.leads || []);
                setTotal(data.total || 0);
                setAuthenticated(true);
                setLastRefresh(new Date());
            }
        } catch {
            setError('Errore di rete. Riprova.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchVideos = useCallback(async (pwd: string) => {
        setVideosLoading(true);
        try {
            const res = await fetch(`/api/videos?password=${encodeURIComponent(pwd)}`);
            const data = await res.json();
            if (res.ok) {
                setVideos(data.videos || []);
            }
        } catch {
            console.error('Errore caricamento video');
        } finally {
            setVideosLoading(false);
        }
    }, []);

    useEffect(() => {
        const saved = sessionStorage.getItem('admin_pwd');
        if (saved) {
            setPassword(saved);
            fetchLeads(saved);
            fetchVideos(saved);
        }
    }, [fetchLeads, fetchVideos]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassword(inputPassword);
        await fetchLeads(inputPassword);
        fetchVideos(inputPassword);
    };

    const handleRefresh = () => {
        if (password) {
            fetchLeads(password);
            fetchVideos(password);
        }
    };

    const handleVideoUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoFile || !videoTitle.trim()) return;

        setUploadLoading(true);
        setUploadError('');
        setUploadSuccess(false);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('title', videoTitle.trim());
        formData.append('personName', videoPersonName.trim());
        formData.append('description', videoDescription.trim());

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (evt) => {
            if (evt.lengthComputable) {
                setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                setUploadSuccess(true);
                setVideoTitle('');
                setVideoPersonName('');
                setVideoDescription('');
                setVideoFile(null);
                setUploadProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = '';
                fetchVideos(password);
            } else {
                try {
                    const err = JSON.parse(xhr.responseText);
                    setUploadError(err.error || 'Errore durante il caricamento');
                } catch {
                    setUploadError('Errore durante il caricamento');
                }
            }
            setUploadLoading(false);
        });

        xhr.addEventListener('error', () => {
            setUploadError('Errore di rete. Riprova.');
            setUploadLoading(false);
        });

        xhr.open('POST', `/api/upload-video?password=${encodeURIComponent(password)}`);
        xhr.send(formData);
    };

    const handleDeleteVideo = async (id: number) => {
        try {
            const res = await fetch(`/api/videos/${id}?password=${encodeURIComponent(password)}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setVideos((prev) => prev.filter((v) => v.id !== id));
                setDeleteConfirm(null);
            }
        } catch {
            console.error('Errore eliminazione video');
        }
    };

    const handleToggleVisibility = async (id: number, isVisible: boolean) => {
        try {
            await fetch(`/api/videos/${id}?password=${encodeURIComponent(password)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isVisible: !isVisible }),
            });
            setVideos((prev) =>
                prev.map((v) => (v.id === id ? { ...v, isVisible: !isVisible } : v))
            );
        } catch {
            console.error('Errore aggiornamento visibilità');
        }
    };

    const filteredLeads = leads.filter((lead) => {
        const matchSearch =
            search === '' ||
            lead.name?.toLowerCase().includes(search.toLowerCase()) ||
            lead.email?.toLowerCase().includes(search.toLowerCase()) ||
            lead.phone?.includes(search);
        const matchBusiness =
            filterBusiness === '' || lead.businessType === filterBusiness;
        return matchSearch && matchBusiness;
    });

    const uniqueBusinessTypes = [...new Set(leads.map((l) => l.businessType).filter(Boolean))];

    const recentLeads = leads.filter(l => {
        const d = new Date(l.dateAdded);
        return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length;

    // ── LOGIN PAGE ──────────────────────────────────────────────────────────────
    if (!authenticated) {
        return (
            <main className="min-h-screen text-white overflow-x-hidden font-sans flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-10">
                        <Image src="/logo.png" alt="SSA Agency" width={140} height={44} className="h-11 w-auto object-contain" />
                    </div>

                    <div className="rounded-[2rem] bg-brand-gray/50 border border-white/5 backdrop-blur-sm p-10 relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-red/10 blur-[80px] rounded-full -z-10" />

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 text-brand-gold text-sm font-bold uppercase tracking-wider mb-4">
                                🔐 Accesso Riservato
                            </div>
                            <h1 className="text-3xl font-black text-white">Admin Panel</h1>
                            <p className="text-gray-400 mt-2 text-sm">SSA Agency — Lead Dashboard</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                    Password
                                </label>
                                <input
                                    id="admin-password"
                                    type="password"
                                    value={inputPassword}
                                    onChange={(e) => setInputPassword(e.target.value)}
                                    placeholder="Inserisci la password..."
                                    required
                                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm outline-none focus:border-brand-red/50 focus:bg-white/8 transition-all"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-red/10 border border-brand-red/20 text-red-400 text-sm">
                                    ⚠️ {error}
                                </div>
                            )}

                            <button
                                id="admin-login-btn"
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-brand-red hover:bg-red-700 text-white font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 transform hover:-translate-y-0.5"
                            >
                                {loading ? '⏳ Caricamento...' : 'Entra nel pannello →'}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-gray-600 text-xs mt-6 font-mono">*Accesso riservato al team SSA Agency.</p>
                </div>
            </main>
        );
    }

    // ── DASHBOARD ───────────────────────────────────────────────────────────────
    return (
        <main className="min-h-screen text-white overflow-x-hidden font-sans">

            {/* NAVBAR */}
            <div className="fixed top-6 left-0 w-full z-50 flex justify-center px-4">
                <nav className="bg-brand-gray/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl max-w-5xl w-full justify-between">
                    <div className="flex items-center gap-3">
                        <Image src="/logo.png" alt="SSA Agency" width={100} height={32} className="h-8 w-auto object-contain" />
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/15 border border-brand-red/20 text-brand-gold text-xs font-bold uppercase tracking-wider">
                            📋 Admin
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {lastRefresh && (
                            <span className="hidden sm:block text-gray-500 text-xs font-mono">
                                Aggiornato: {lastRefresh.toLocaleTimeString('it-IT')}
                            </span>
                        )}
                        <button
                            id="refresh-leads-btn"
                            onClick={handleRefresh}
                            disabled={loading || videosLoading}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {loading || videosLoading ? '⏳' : '🔄'} Aggiorna
                        </button>
                    </div>
                </nav>
            </div>

            <div className="pt-32 pb-16 px-3 sm:px-4 space-y-4 max-w-[1400px] mx-auto">

                {/* STATS */}
                <section>
                    <div className="w-full rounded-[2rem] sm:rounded-[3rem] bg-brand-gray/50 border border-white/5 backdrop-blur-sm p-5 sm:p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/8 blur-[100px] rounded-full -z-10" />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-wider mb-3">
                                    📊 Panoramica
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white">Dashboard</h2>
                                <p className="text-gray-400 text-sm mt-1">SSA Agency — Pannello di controllo</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard icon="👥" label="Lead Totali" value={total} accent="gold" />
                            <StatCard icon="📅" label="Ultimi 7 giorni" value={recentLeads} accent="red" />
                            <StatCard icon="🎬" label="Video Testimonianze" value={videos.length} accent="white" />
                            <StatCard icon="👁️" label="Video Visibili" value={videos.filter(v => v.isVisible).length} accent="gold" />
                        </div>
                    </div>
                </section>

                {/* TAB NAVIGATION */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${activeTab === 'leads'
                            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        📋 Lead ({total})
                    </button>
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${activeTab === 'videos'
                            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        🎬 Testimonianze Video ({videos.length})
                    </button>
                </div>

                {/* ── LEADS TAB ─────────────────────────────────────────────────── */}
                {activeTab === 'leads' && (
                    <section>
                        <div className="w-full rounded-[2rem] sm:rounded-[3rem] bg-brand-dark border border-white/5 p-5 sm:p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-red/5 blur-[80px] rounded-full -z-10" />

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                                <div className="relative flex-1">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
                                    <input
                                        id="search-leads"
                                        type="text"
                                        placeholder="Cerca per nome, email, telefono..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/8 text-white placeholder-gray-500 text-sm outline-none focus:border-brand-red/40 transition-all"
                                    />
                                </div>
                                <select
                                    id="filter-business"
                                    value={filterBusiness}
                                    onChange={(e) => setFilterBusiness(e.target.value)}
                                    className="px-4 py-3 rounded-2xl bg-white/5 border border-white/8 text-white text-sm outline-none focus:border-brand-red/40 transition-all cursor-pointer min-w-[200px]"
                                >
                                    <option value="" className="bg-brand-gray">Tutti i settori</option>
                                    {uniqueBusinessTypes.map((bt) => (
                                        <option key={bt} value={bt} className="bg-brand-gray">
                                            {BUSINESS_LABELS[bt] || bt}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-brand-red/10 border border-brand-red/20 text-red-400 text-sm mb-6">
                                    ⚠️ {error}
                                </div>
                            )}

                            {loading && (
                                <div className="text-center py-20 text-gray-400">
                                    <div className="text-4xl mb-4 animate-bounce">⏳</div>
                                    <p className="font-medium">Caricamento lead in corso...</p>
                                </div>
                            )}

                            {!loading && filteredLeads.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="text-6xl mb-4">📭</div>
                                    <p className="text-gray-400 text-lg font-medium">
                                        {search || filterBusiness ? 'Nessun lead corrisponde ai filtri.' : 'Nessun lead ricevuto ancora.'}
                                    </p>
                                    {(search || filterBusiness) && (
                                        <button
                                            onClick={() => { setSearch(''); setFilterBusiness(''); }}
                                            className="mt-4 text-brand-gold text-sm underline underline-offset-2 hover:opacity-80 transition-opacity"
                                        >
                                            Rimuovi filtri
                                        </button>
                                    )}
                                </div>
                            )}

                            {!loading && filteredLeads.length > 0 && (
                                <>
                                    {/* Desktop */}
                                    <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/5">
                                        <table className="w-full text-sm border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/8 bg-white/3">
                                                    {['#', 'Nome', 'Email', 'Telefono', 'Di cosa si occupa', 'Data'].map((h) => (
                                                        <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap">
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredLeads.map((lead, index) => (
                                                    <tr
                                                        key={lead.id}
                                                        className="border-b border-white/5 hover:bg-white/3 transition-colors group"
                                                    >
                                                        <td className="px-5 py-4 text-gray-600 font-mono text-xs font-bold">{index + 1}</td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 text-white"
                                                                    style={{
                                                                        background: `hsl(${(lead.name?.charCodeAt(0) || 0) * 7 % 360}, 60%, 35%)`
                                                                    }}
                                                                >
                                                                    {getInitial(lead.name)}
                                                                </div>
                                                                <span className="font-bold text-white">{lead.name || 'N/D'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <a href={`mailto:${lead.email}`} className="text-brand-gold hover:text-yellow-300 transition-colors font-medium">
                                                                {lead.email || 'N/D'}
                                                            </a>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <a href={`tel:${lead.phone}`} className="text-gray-300 hover:text-white transition-colors font-mono text-xs">
                                                                {lead.phone || 'N/D'}
                                                            </a>
                                                        </td>
                                                        <td className="px-5 py-4 text-gray-400 max-w-[280px]">
                                                            <span className="block truncate text-xs" title={lead.challenge}>
                                                                {lead.challenge && lead.challenge !== 'Non specificato' ? lead.challenge : '—'}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs font-mono">
                                                            {formatDate(lead.dateAdded)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="px-5 py-3 border-t border-white/5 bg-white/2 flex justify-between items-center">
                                            <span className="text-xs text-gray-600">
                                                {filteredLeads.length} di {total} lead
                                            </span>
                                            <span className="text-xs text-gray-600 font-mono">SSA Agency — DB locale</span>
                                        </div>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="md:hidden space-y-3">
                                        {filteredLeads.map((lead, index) => (
                                            <div
                                                key={lead.id}
                                                className="rounded-2xl bg-white/3 border border-white/8 p-5 hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white flex-shrink-0"
                                                        style={{ background: `hsl(${(lead.name?.charCodeAt(0) || 0) * 7 % 360}, 60%, 35%)` }}
                                                    >
                                                        {getInitial(lead.name)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-white truncate">{lead.name || 'N/D'}</p>
                                                        <p className="text-xs text-gray-500 font-mono">{formatDate(lead.dateAdded)}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-600 font-mono">#{index + 1}</span>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 w-16 flex-shrink-0 text-xs">Email</span>
                                                        <a href={`mailto:${lead.email}`} className="text-brand-gold truncate text-xs hover:opacity-80">
                                                            {lead.email || 'N/D'}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 w-16 flex-shrink-0 text-xs">Tel</span>
                                                        <a href={`tel:${lead.phone}`} className="text-gray-300 font-mono text-xs">
                                                            {lead.phone || 'N/D'}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-gray-500 w-24 flex-shrink-0 text-xs mt-0.5">Di cosa si occupa</span>
                                                        <span className="text-gray-300 text-xs">
                                                            {lead.challenge && lead.challenge !== 'Non specificato' ? lead.challenge : '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <p className="text-center text-xs text-gray-600 pt-2">
                                            {filteredLeads.length} di {total} lead
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                )}

                {/* ── VIDEOS TAB ────────────────────────────────────────────────── */}
                {activeTab === 'videos' && (
                    <div className="space-y-4">

                        {/* UPLOAD FORM */}
                        <section>
                            <div className="w-full rounded-[2rem] sm:rounded-[3rem] bg-brand-dark border border-white/5 p-5 sm:p-8 md:p-10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-brand-red/5 blur-[80px] rounded-full -z-10" />

                                <div className="mb-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-wider mb-3">
                                        📤 Carica Nuovo Video
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        Il video verrà caricato su Bunny CDN e reso disponibile nella sezione testimonianze della landing page.
                                    </p>
                                </div>

                                <form onSubmit={handleVideoUpload} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                                Titolo / Descrizione breve *
                                            </label>
                                            <input
                                                type="text"
                                                value={videoTitle}
                                                onChange={(e) => setVideoTitle(e.target.value)}
                                                placeholder="es. Testimonianza di Marco - Palestra"
                                                required
                                                disabled={uploadLoading}
                                                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm outline-none focus:border-brand-red/50 transition-all disabled:opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                                Nome della persona
                                            </label>
                                            <input
                                                type="text"
                                                value={videoPersonName}
                                                onChange={(e) => setVideoPersonName(e.target.value)}
                                                placeholder="es. Marco R."
                                                disabled={uploadLoading}
                                                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm outline-none focus:border-brand-red/50 transition-all disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                            File Video *
                                        </label>
                                        <div
                                            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${uploadLoading ? 'border-white/10 opacity-50' : 'border-white/15 hover:border-brand-gold/40 cursor-pointer'}`}
                                            onClick={() => !uploadLoading && fileInputRef.current?.click()}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="video/*"
                                                className="hidden"
                                                disabled={uploadLoading}
                                                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                            />
                                            {videoFile ? (
                                                <div className="space-y-1">
                                                    <div className="text-3xl">🎬</div>
                                                    <p className="text-white font-bold text-sm">{videoFile.name}</p>
                                                    <p className="text-gray-500 text-xs">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="text-4xl">📁</div>
                                                    <p className="text-gray-400 text-sm">Clicca per selezionare un video</p>
                                                    <p className="text-gray-600 text-xs">MP4, MOV, AVI — max consigliato 500 MB</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {uploadLoading && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-gray-400">
                                                <span>
                                                    {uploadProgress < 100
                                                        ? `Caricamento su server... ${uploadProgress}%`
                                                        : '⏳ Elaborazione su Bunny CDN in corso...'}
                                                </span>
                                                <span>{uploadProgress}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div
                                                    className="bg-brand-gold h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {uploadError && (
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-red/10 border border-brand-red/20 text-red-400 text-sm">
                                            ⚠️ {uploadError}
                                        </div>
                                    )}

                                    {uploadSuccess && (
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                                            ✅ Video caricato con successo! Potrebbe richiedere qualche minuto per la thumbnail.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={uploadLoading || !videoFile || !videoTitle.trim()}
                                        className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-brand-red hover:bg-red-700 text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-brand-red/20"
                                    >
                                        {uploadLoading ? '⏳ Caricamento in corso...' : '🚀 Carica Video'}
                                    </button>
                                </form>
                            </div>
                        </section>

                        {/* VIDEO LIST */}
                        <section>
                            <div className="w-full rounded-[2rem] sm:rounded-[3rem] bg-brand-dark border border-white/5 p-5 sm:p-8 md:p-10 relative overflow-hidden">
                                <div className="mb-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-wider mb-3">
                                        🎬 Video Caricati
                                    </div>
                                </div>

                                {videosLoading && (
                                    <div className="text-center py-16 text-gray-400">
                                        <div className="text-4xl mb-4 animate-bounce">⏳</div>
                                        <p className="font-medium">Caricamento video...</p>
                                    </div>
                                )}

                                {!videosLoading && videos.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="text-6xl mb-4">🎬</div>
                                        <p className="text-gray-400 text-lg font-medium">Nessun video caricato ancora.</p>
                                        <p className="text-gray-600 text-sm mt-2">Usa il form sopra per caricare il primo video testimonianza.</p>
                                    </div>
                                )}

                                {!videosLoading && videos.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {videos.map((video) => (
                                            <div
                                                key={video.id}
                                                className={`rounded-2xl border overflow-hidden transition-all ${video.isVisible
                                                    ? 'border-white/10 bg-white/3'
                                                    : 'border-white/5 bg-white/1 opacity-60'
                                                    }`}
                                            >
                                                {/* Thumbnail */}
                                                <div className="relative aspect-video bg-black">
                                                    <Image
                                                        src={video.thumbnailUrl}
                                                        alt={video.title}
                                                        fill
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                        unoptimized
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                                                            <span className="text-xl">▶</span>
                                                        </div>
                                                    </div>
                                                    {!video.isVisible && (
                                                        <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 text-gray-400 text-xs font-bold">
                                                            NASCOSTO
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="p-4 space-y-3">
                                                    <div>
                                                        <p className="font-bold text-white text-sm leading-tight">{video.title}</p>
                                                        {video.personName && (
                                                            <p className="text-brand-gold text-xs mt-0.5">{video.personName}</p>
                                                        )}
                                                        <p className="text-gray-600 text-xs mt-1 font-mono">{formatDate(video.createdAt)}</p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleToggleVisibility(video.id, video.isVisible)}
                                                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border ${video.isVisible
                                                                ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                                                                : 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                                }`}
                                                        >
                                                            {video.isVisible ? '👁️ Nascondi' : '✅ Mostra'}
                                                        </button>

                                                        {deleteConfirm === video.id ? (
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={() => handleDeleteVideo(video.id)}
                                                                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-red text-white hover:bg-red-700 transition-all"
                                                                >
                                                                    Conferma
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(null)}
                                                                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
                                                                >
                                                                    Annulla
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setDeleteConfirm(video.id)}
                                                                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-brand-red/30 bg-brand-red/10 text-red-400 hover:bg-brand-red/20 transition-all"
                                                            >
                                                                🗑️
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}

            </div>

            {/* FOOTER */}
            <footer className="py-8 bg-black border-t border-white/5 text-center text-gray-600 text-xs">
                <p>© {new Date().getFullYear()} SSA Agency — Admin Panel</p>
            </footer>
        </main>
    );
}

function StatCard({
    icon, label, value, accent, isText
}: {
    icon: string;
    label: string;
    value: string | number;
    accent: 'red' | 'gold' | 'white';
    isText?: boolean;
}) {
    const accentColors = {
        red: 'border-brand-red/20 bg-brand-red/10 text-brand-red',
        gold: 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold',
        white: 'border-white/10 bg-white/5 text-white',
    };

    return (
        <div className={`rounded-2xl border p-5 ${accentColors[accent]} transition-all hover:scale-[1.02]`}>
            <div className="text-2xl mb-3">{icon}</div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{label}</p>
            <p className={`font-black leading-tight ${isText ? 'text-sm' : 'text-2xl'} text-white`}>
                {value}
            </p>
        </div>
    );
}
