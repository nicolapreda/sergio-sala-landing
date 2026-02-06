"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, XCircle, Play, ShieldCheck, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";
import BookingForm from "@/components/BookingForm";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  return (
    <main className="min-h-screen text-white overflow-x-hidden font-sans selection:bg-brand-red selection:text-white">
      
      {/* FLOATING PILL NAVBAR */}
      <div className="fixed top-6 left-0 w-full z-50 flex justify-center px-4">
        <nav className="bg-brand-gray/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl max-w-4xl w-full justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image 
                src="/logo.png" 
                alt="SSA Agency Logo" 
                width={100} 
                height={32} 
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <a href="#metodo" className="hover:text-white transition-colors">Metodo 🧪</a>
            <a href="#risultati" className="hover:text-white transition-colors">Risultati 🚀</a>
            <a href="#chi-siamo" className="hover:text-white transition-colors">Chi Siamo 👋</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ 🤔</a>
          </div>

          <a 
            href="#booking"
            className="bg-white text-brand-dark px-5 py-2 rounded-full text-sm font-bold hover:bg-brand-gold hover:text-black transition-all transform hover:scale-105"
          >
            Inizia Ora ✨
          </a>
        </nav>
      </div>

      {/* HERO SECTION */}
      <section className="pt-32 pb-10 px-4">
        <div className="w-full max-w-[1400px] mx-auto rounded-[3rem] relative overflow-hidden bg-brand-dark/30 border border-white/5 backdrop-blur-sm p-8 md:p-16">
           {/* Background Effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-red/10 blur-[120px] rounded-full -z-10 animate-pulse" />
          
          <div className="container mx-auto max-w-5xl text-center space-y-8">
            <motion.div 
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="space-y-8 flex flex-col items-center"
            >            
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black leading-tight md:leading-[0.9] tracking-tighter break-words max-w-full">
                TROVA NUOVI CLIENTI <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold italic pr-2 drop-shadow-lg">SENZA FARE BALLETTI</span> 💃🚫
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed mx-auto font-medium">
                Il sistema per aumentare il fatturato. <br/>
                <span className="text-white">Smetti di cercare like, inizia a trovare clienti.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto">
                <a 
                  href="#booking"
                  className="group bg-brand-red hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 transform hover:-translate-y-1"
                >
                  Voglio più clienti 🚀
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="#faq"
                  className="group bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  Come Funziona? 🧐
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-8 text-sm text-gray-400 font-medium">
                <div className="flex items-center gap-2 px-4 py-2 bg-brand-red/10 rounded-xl border border-brand-red/20 backdrop-blur-sm shadow-[0_0_15px_rgba(139,0,0,0.2)]">
                  <ShieldCheck className="w-5 h-5 text-brand-gold" />
                  Zero Balletti 💃🚫
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-brand-red/10 rounded-xl border border-brand-red/20 backdrop-blur-sm shadow-[0_0_15px_rgba(139,0,0,0.2)]">
                  <Target className="w-5 h-5 text-brand-gold" />
                  Solo Ads Mirate 🎯
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-brand-red/10 rounded-xl border border-brand-red/20 backdrop-blur-sm shadow-[0_0_15px_rgba(139,0,0,0.2)]">
                  <Trophy className="w-5 h-5 text-brand-gold" />
                  Risultati Veri 💰
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="px-4 pb-4">
        <div className="w-full max-w-[1400px] mx-auto rounded-[3rem] bg-brand-gray/50 border border-white/5 backdrop-blur-sm p-8 md:p-24">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black leading-tight text-white">
                <span className="text-red-500">❌ STOP</span> AI VIDEO NOIOSI <br />
                CHE NON GUARDA NESSUNO.
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl">🤡</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">Sottotitoli colorati e Hook virali?</h3>
                    <p className="text-gray-400">Mettono solo in ridicolo la tua attività invece di trasmettere professionalità e valore.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl">🤖</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">Trend Copia-Incolla dai Competitor?</h3>
                    <p className="text-gray-400">Non puoi vincere copiando chi sta già perdendo. Ti serve un angolo unico.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl">📉</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">Zero Risultati?</h3>
                    <p className="text-gray-400">Tanta fatica per 3 like (di cui uno è tua mamma). Il marketing deve VENDERE.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-brand-red/20 blur-[80px] rounded-full -z-10" />
               <div className="border border-white/10 rounded-3xl overflow-hidden glass-card p-8 text-center space-y-6">
                  <div className="text-6xl animate-bounce">🤡</div>
                  <h3 className="text-2xl font-bold">Il Web è pieno di Clown.</h3>
                  <p className="text-gray-300 transform -rotate-1">
                    Non hai bisogno di ballare o indicare scritte nel vuoto. 
                    Devi solo comunicare valore in modo <span className="text-brand-gold font-bold italic">STRATEGICO</span>.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION / METHOD */}
      {/* CLIENTS / METHOD */}
      {/* CLIENTS / METHOD */}
      <section id="metodo" className="px-4 pb-4">
        <div className="w-full max-w-[1400px] mx-auto rounded-[3rem] bg-brand-dark border border-white/5 overflow-hidden p-8 md:p-24 relative">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column: Visuals (Collage simulation) */}
              <div className="relative">
                 <div className="absolute inset-0 bg-brand-red/20 blur-[80px] rounded-full -z-10" />
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4 pt-8">
                       <div className="h-64 rounded-2xl border-2 border-brand-gold/20 overflow-hidden relative group hover:border-brand-gold/50 transition-colors">
                          <Image 
                            src="/ssaagency-clienti-1.jpg" 
                            alt="Precisione" 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                          <span className="absolute bottom-4 left-4 text-white z-20 font-bold">Precisione 📐</span>
                       </div>
                       <div className="h-40 rounded-2xl border-2 border-brand-gold/20 overflow-hidden relative group hover:border-brand-gold/50 transition-colors">
                           <Image 
                            src="/ssaagency-clienti-2.jpg" 
                            alt="All'opera" 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                           <span className="absolute bottom-4 left-4 text-white z-20 font-bold">All'opera 🛠️</span>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="h-40 rounded-2xl border-2 border-brand-gold/20 overflow-hidden relative group hover:border-brand-gold/50 transition-colors">
                           <Image 
                            src="/ssaagency-clienti-3.jpg" 
                            alt="Food" 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                           <span className="absolute bottom-4 left-4 text-white z-20 font-bold">Food 🍝</span>
                       </div>
                       <div className="h-64 rounded-2xl border-2 border-brand-gold/20 overflow-hidden relative group hover:border-brand-gold/50 transition-colors">
                           <Image 
                            src="/ssaagency-clienti-4.jpg" 
                            alt="Lifestyle" 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                           <span className="absolute bottom-4 left-4 text-white z-20 font-bold">Lifestyle 🥂</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Copy */}
              <div className="space-y-8">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 text-brand-gold text-sm font-bold uppercase tracking-wider">
                   <CheckCircle2 className="w-4 h-4" />
                   Contenuti di qualità
                 </div>
                 
                 <h2 className="text-5xl md:text-6xl font-black leading-tight">
                   I NOSTRI <br /> <span className="text-brand-red">CLIENTI</span>
                 </h2>

                 <div className="space-y-6 text-lg text-gray-300">
                    <div className="flex items-start gap-3">
                       <div className="w-2 h-2 mt-2.5 rounded-full bg-brand-gold shadow-[0_0_10px_orange]" />
                       <p>Contenuti pensati per <span className="text-white font-bold">catturare l'attenzione</span></p>
                    </div>
                    <div className="flex items-start gap-3">
                       <div className="w-2 h-2 mt-2.5 rounded-full bg-brand-gold shadow-[0_0_10px_orange]" />
                       <p>Per raccontare il tuo <span className="text-white font-bold">brand</span> nel modo giusto</p>
                    </div>
                    <div className="flex items-start gap-3">
                       <div className="w-2 h-2 mt-2.5 rounded-full bg-brand-gold shadow-[0_0_10px_orange]" />
                       <p>Esperienza. Brand. Dettagli.</p>
                    </div>
                 </div>

                 <div className="pt-4">
                    <a 
                      href="#booking"
                      className="inline-flex items-center gap-2 bg-transparent border border-brand-gold text-brand-gold px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-gold hover:text-black transition-all group"
                    >
                      Scopri il metodo SSA
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="mt-4 text-sm text-gray-500 font-mono">*Accesso riservato alle aziende.</p>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* RESULT / TESTIMONIALS */}
      <section id="risultati" className="px-4 pb-4">
        <div className="w-full max-w-[1400px] mx-auto rounded-[3rem] bg-brand-dark border border-white/5 relative overflow-hidden p-8 md:p-24">
           {/* Background Glow */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/10 blur-[100px] rounded-full -z-10" />

           <div className="container mx-auto px-6 max-w-4xl text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-12 relative inline-block">
                Le nostre recensioni 🗨️
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-50" />
              </h2>
              
              <div className="space-y-6 flex flex-col items-center">
                {/* Review 1 */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="w-full max-w-2xl bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-brand-gold/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.05)] relative text-left"
                >
                  <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                     <div className="bg-brand-red/20 p-1.5 rounded-lg">
                        <Image src="/logo.png" alt="SSA" width={24} height={24} className="w-6 h-6 object-contain" />
                     </div>
                     <h3 className="font-bold text-lg text-white">Risultati <span className="text-brand-red">SIN DA SUBITO</span></h3>
                  </div>
                  <div className="flex gap-4">
                     <div className="mt-1">
                        <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-500/10" />
                     </div>
                     <div className="space-y-2">
                        <p className="text-gray-200 leading-relaxed">
                          Oggi ho chiamato 4 nuove richieste appena sono arrivate, tutti i interessati. <br />
                          Per ora abbiamo chiuso <span className="font-bold text-white">6 clienti</span> dalla scorsa settimana 💪
                        </p>
                        <p className="text-xs text-gray-500 text-right w-full">12:43 ✓✓</p>
                     </div>
                  </div>
                </motion.div>

                 {/* Review 2 */}
                 <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="w-full max-w-2xl bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-brand-gold/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.05)] relative text-left"
                >
                  <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                     <div className="bg-brand-red/20 p-1.5 rounded-lg">
                        <Image src="/logo.png" alt="SSA" width={24} height={24} className="w-6 h-6 object-contain" />
                     </div>
                     <h3 className="font-bold text-lg text-white">Non devo metterci la faccia</h3>
                  </div>
                  <div className="flex gap-4">
                     <div className="mt-1">
                        <div className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center">😎</div>
                     </div>
                     <div className="space-y-2 w-full">
                        <p className="text-gray-200 leading-relaxed italic">
                          "Molto contento... soprattutto per non dover metterci la faccia ogni volta 😁"
                        </p>
                         <p className="text-xs text-gray-500 text-right w-full">12:44 ✓✓</p>
                     </div>
                  </div>
                </motion.div>

                 {/* Review 3 */}
                 <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="w-full max-w-2xl bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-brand-gold/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.05)] relative text-left"
                >
                  <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                     <div className="bg-brand-red/20 p-1.5 rounded-lg">
                        <Image src="/logo.png" alt="SSA" width={24} height={24} className="w-6 h-6 object-contain" />
                     </div>
                     <h3 className="font-bold text-lg text-white">Ottimo <span className="text-brand-red">TASSO DI CHIUSURA</span></h3>
                  </div>
                  <div className="flex gap-4">
                     <div className="mt-1">
                        <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-500/10" />
                     </div>
                     <div className="space-y-2 w-full">
                        <p className="text-gray-200 leading-relaxed">
                          "Per ora abbiamo chiuso <span className="font-bold text-white">6 clienti</span> dalla scorsa settimana. 😊"
                        </p>
                         <p className="text-xs text-gray-500 text-right w-full">12:44 ✓✓</p>
                     </div>
                  </div>
                </motion.div>
              </div>

              <div className="mt-16 relative z-10">
                 <div className="absolute inset-0 bg-brand-red blur-[40px] opacity-20" />
                 <a 
                  href="#booking" 
                  className="relative inline-flex items-center gap-3 bg-gradient-to-r from-brand-dark to-black border border-brand-red/50 px-10 py-5 rounded-full text-xl font-bold text-white shadow-[0_0_20px_rgba(139,0,0,0.4)] hover:shadow-[0_0_40px_rgba(139,0,0,0.6)] hover:scale-105 transition-all duration-300 group"
                >
                  <span>Richiedi il metodo SSA</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform text-brand-red" />
                </a>
              </div>
           </div>
        </div>
      </section>

      {/* CHI SIAMO SECTION */}
      <section id="chi-siamo" className="px-4 pb-4">
        <div className="w-full max-w-[1400px] mx-auto rounded-[3rem] bg-brand-dark/50 border border-white/5 relative p-8 md:p-24">
           <div className="container mx-auto px-6 max-w-4xl text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-12">CHI SIAMO 👋</h2>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                 Non siamo la solita agenzia di marketing. Siamo il tuo partner strategico. 
                 <br/><br/>
                 Il nostro obiettivo è uno solo: <span className="text-brand-red font-bold">aumentare il tuo fatturato</span> e fidelizzare i tuoi clienti.
                 Niente vanity metrics, solo risultati concreti.
              </p>
           </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      {/* FAQ SECTION */}
      <section id="faq" className="px-4 pb-4">
        <div className="w-full max-w-[1400px] mx-auto rounded-[3rem] bg-brand-dark/20 border border-white/5 relative overflow-hidden p-8 md:p-24">
           <div className="container mx-auto px-6 max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-black mb-12 text-center text-white">FAQ 🤔</h2>
              
              <div className="space-y-4">
                 {/* Q1 */}
                 <details className="group bg-brand-gray/30 border border-white/5 rounded-2xl open:bg-brand-gray/50 open:border-brand-red/20 transition-all duration-300">
                    <summary className="flex items-center justify-between cursor-pointer p-6 list-none font-bold text-lg text-white">
                       <span>Quanto costa?</span>
                       <span className="transform group-open:rotate-180 transition-transform text-brand-gold">▼</span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-400">
                       Dipende dagli obiettivi e dalla situazione di partenza. Non vendiamo pacchetti copia-incolla. Richiedi un'analisi gratuita per avere un preventivo su misura.
                    </div>
                 </details>

                 {/* Q2 */}
                 <details className="group bg-brand-gray/30 border border-white/5 rounded-2xl open:bg-brand-gray/50 open:border-brand-red/20 transition-all duration-300">
                    <summary className="flex items-center justify-between cursor-pointer p-6 list-none font-bold text-lg text-white">
                       <span>⚡️ Quando vedo risultati?</span>
                       <span className="transform group-open:rotate-180 transition-transform text-brand-gold">▼</span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-400">
                       <span className="font-bold text-white">Le strategie funzionano immediatamente.</span> Molti clienti vedono miglioramenti nei primi 7-15 giorni. Risultati completi entro 30-60 giorni.
                    </div>
                 </details>
              </div>
           </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      {/* BOOKING SECTION */}
      <section id="booking" className="px-4 pb-24">
        <div className="w-full max-w-[1400px] mx-auto rounded-[3rem] relative overflow-hidden p-8 md:p-24 border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark to-brand-red/10 -z-10" />
          
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-6">SEI PRONTO A <br /> <span className="text-brand-gold">DOMINARE?</span></h2>
              <p className="text-gray-300 text-lg">
                Compila il modulo qui sotto.<br/>
                Se vediamo che possiamo aiutarti, ti contatteremo per una strategia su misura.
              </p>
            </div>

            <BookingForm />
            
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-black border-t border-white/5 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} SSA Agency. Tutti i diritti riservati.</p>
        <p className="mt-2">P.IVA 12345678900</p>
      </footer>
    </main>
  );
}
