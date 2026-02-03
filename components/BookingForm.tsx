"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Errore nell'invio del modulo. Riprova più tardi.");
      }

      setSuccess(true);
    } catch (err) {
      setError("Si è verificato un errore. Per favore riprova.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-8 bg-brand-gray/50 backdrop-blur-md rounded-3xl border border-green-500/20 max-w-lg mx-auto">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h3 className="text-2xl font-bold text-white mb-2">Grande! Richiesta Inviata.</h3>
        <p className="text-gray-400">
          Ti contatteremo entro 24h per spaccare tutto. Tieni d'occhio il telefono! 📱
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto bg-brand-gray/30 p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
      <div className="text-center mb-8">
           <h3 className="text-2xl font-bold text-white mb-2">Analisi Gratuita 📊</h3>
           <p className="text-gray-400 text-sm">Scopri come riempire il tuo locale.</p>
      </div>

      <div className="space-y-4">
          <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1 ml-1">Come ti chiami? 😎</label>
              <input
              required
              name="name"
              id="name"
              type="text"
              placeholder="Mario Rossi"
              className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all"
              />
          </div>
  
          <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1 ml-1">Email aziendale 📧</label>
              <input
              required
              name="email"
              id="email"
              type="email"
              placeholder="mario@azienda.com"
              className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all"
              />
          </div>
  
          <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1 ml-1">Cellulare (WhatsApp) 📱</label>
              <input
              required
              name="phone"
              id="phone"
              type="tel"
              placeholder="+39 333 1234567"
              className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all"
              />
          </div>

          <div>
              <label htmlFor="business" className="block text-sm font-medium text-gray-400 mb-1 ml-1">Di cosa ti occupi? 💼</label>
              <textarea
              required
              name="business"
              id="business"
              rows={3}
              placeholder="Vendo case a Milano, ho un e-commerce di scarpe..."
              className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all resize-none"
              />
          </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-brand-red to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-brand-red/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-4"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> Invio...
          </>
        ) : (
          "RICHIEDI ANALISI GRATUITA 🚀"
        )}
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-4">
          I tuoi dati sono al sicuro. Odiamo lo spam quanto te. 🔒
      </p>
    </form>
  );
}
