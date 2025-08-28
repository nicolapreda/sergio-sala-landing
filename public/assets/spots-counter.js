/**
 * Sistema Spots Counter Generico per Landing SSA
 * Gestisce la visualizzazione dinamica dei posti disponibili
 * basata su logica di scarsità progressiva per tutti i mesi
 */

/**
 * Calendario fisso degli spots per ogni giorno del mese
 * Schema preciso: 1-10=20, 11-15=15, 16-20=7, 21-23=5, 24-28=3, 29-30=1
 */
function getFixedSpotsForDay(day) {
    if (day >= 1 && day <= 10) {
        return 20; // 1-10: 20 posti
    } else if (day >= 11 && day <= 15) {
        return 15; // 11-15: 15 posti
    } else if (day >= 16 && day <= 20) {
        return 7;  // 16-20: 7 posti
    } else if (day >= 21 && day <= 23) {
        return 5;  // 21-23: 5 posti
    } else if (day >= 24 && day <= 28) {
        return 3;  // 24-28: 3 posti
    } else if (day >= 29 && day <= 31) {
        return 1;  // 29-30-31: ultimo posto
    }
    return 1; // fallback
}

/**
 * Calcola il numero di spots basato sul giorno del mese
 * Usa lo schema fisso fornito
 * @param {Date} currentDate - Data corrente
 * @returns {number} - Numero di spots disponibili
 */
function calculateMonthlySpots(currentDate = new Date()) {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // 1-based
    const year = currentDate.getFullYear();
    
    // Ottieni il numero di giorni nel mese corrente
    const daysInMonth = new Date(year, month, 0).getDate();
    
    console.log(`[SPOTS] Data: ${day}/${month}/${year} - Giorni nel mese: ${daysInMonth}`);
    
    // Usa lo schema fisso
    let spots = getFixedSpotsForDay(day);
    
    // Aggiungi variazione basata sul giorno della settimana (opzionale)
    const dayOfWeek = currentDate.getDay(); // 0 = domenica, 6 = sabato
    
    // Weekend: leggera riduzione solo per i giorni con tanti spots
    if ((dayOfWeek === 0 || dayOfWeek === 6) && spots > 10) {
        spots = Math.floor(spots * 0.8); // Riduzione del 20% solo per 15-20 spots
    }
    
    // Assicurati che ci sia sempre almeno 1 spot
    spots = Math.max(1, spots);
    
    console.log(`[SPOTS] Giorno ${day}/${month} - Schema fisso: ${spots} spots disponibili`);
    
    return spots;
}

/**
 * Sistema di cache per mantenere consistenza durante la giornata
 * Gli spots cambiano solo a mezzanotte
 */
let dailySpotsCache = null;
let cacheDate = null;

function getSpotsDisplay() {
    const today = new Date();
    const todayString = today.toDateString();
    
    // Se abbiamo già calcolato per oggi, usa la cache
    if (cacheDate === todayString && dailySpotsCache !== null) {
        console.log(`[SPOTS] Cache hit: ${dailySpotsCache} spots per ${todayString}`);
        return dailySpotsCache;
    }
    
    // Calcola usando lo schema fisso
    dailySpotsCache = calculateMonthlySpots(today);
    cacheDate = todayString;
    
    console.log(`[SPOTS] Nuovi spots calcolati: ${dailySpotsCache} per ${todayString}`);
    return dailySpotsCache;
}

/**
 * Aggiorna tutti gli elementi con spots dinamici
 */
function updateAllSpotsDisplay() {
    console.log('[SPOTS] Aggiornamento elementi spots...');
    
    const currentSpots = getSpotsDisplay();
    
    // Aggiorna tutti gli elementi data-spots-text
    const spotsElements = document.querySelectorAll('[data-spots-text]');
    spotsElements.forEach(element => {
        const template = element.getAttribute('data-spots-text');
        element.textContent = template.replace('{spots}', currentSpots);
    });
    
    // Aggiorna elementi con classe spots-count (backward compatibility)
    const spotsCountElements = document.querySelectorAll('.spots-count');
    spotsCountElements.forEach(element => {
        element.textContent = currentSpots;
    });
    
    // Aggiorna la barra di progresso basata sui spots (max 20 spots)
    const progressBar = document.querySelector('.bg-red-500');
    if (progressBar) {
        const maxSpots = 20; // Massimo del nostro schema fisso
        const progressPercentage = Math.max(5, Math.min(95, ((maxSpots - currentSpots) / maxSpots) * 100));
        progressBar.style.width = progressPercentage + '%';
        console.log(`[SPOTS] Barra progresso aggiornata: ${progressPercentage}%`);
    }
    
    // Aggiorna colori e animazioni basati sui spots
    spotsElements.forEach(element => {
        // Reset classi precedenti
        element.classList.remove('text-red-500', 'text-yellow-500', 'text-green-500');
        if (element.parentElement) {
            element.parentElement.classList.remove('animate-pulse');
        }
        
        // Applica colori basati sui spots (adattato al nuovo schema)
        if (currentSpots <= 3) {
            element.classList.add('text-red-500');
            if (element.parentElement) {
                element.parentElement.classList.add('animate-pulse');
            }
            // Usa bianco con shadow per alta visibilità su sfondo rosso
            element.style.color = '#ffffff';
            element.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
            element.style.fontWeight = 'bold';
        } else if (currentSpots <= 7) {
            element.style.color = '#f59e0b'; // Arancione per urgenza media (4-7 spots)
            element.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
            element.style.fontWeight = 'bold';
        } else {
            element.style.color = '#10b981'; // Verde per disponibilità normale (8+ spots)
            element.style.textShadow = 'none';
            element.style.fontWeight = 'normal';
        }
    });
    
    spotsCountElements.forEach(element => {
        // Reset classi precedenti
        element.classList.remove('text-red-500', 'text-yellow-500', 'text-green-500');
        if (element.parentElement) {
            element.parentElement.classList.remove('animate-pulse');
        }
        
        // Applica colori basati sui spots (adattato al nuovo schema)
        if (currentSpots <= 3) {
            element.classList.add('text-red-500');
            if (element.parentElement) {
                element.parentElement.classList.add('animate-pulse');
            }
            // Usa bianco con shadow per alta visibilità su sfondo rosso
            element.style.color = '#ffffff';
            element.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
            element.style.fontWeight = 'bold';
        } else if (currentSpots <= 7) {
            element.style.color = '#f59e0b'; // Arancione per urgenza media (4-7 spots)
            element.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
            element.style.fontWeight = 'bold';
        } else {
            element.style.color = '#10b981'; // Verde per disponibilità normale (8+ spots)
            element.style.textShadow = 'none';
            element.style.fontWeight = 'normal';
        }
    });
    
    console.log(`[SPOTS] Aggiornati ${spotsElements.length + spotsCountElements.length} elementi con ${currentSpots} spots`);
}

// Auto-inizializzazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('[SPOTS] Inizializzazione sistema spots counter generico...');
    updateAllSpotsDisplay();
});

// Controlla ogni ora se è cambiato il giorno
setInterval(() => {
    const today = new Date();
    const todayString = today.toDateString();
    
    // Se è cambiato il giorno, aggiorna tutto
    if (cacheDate !== todayString) {
        console.log('[SPOTS] Nuovo giorno rilevato, aggiornamento spots...');
        updateAllSpotsDisplay();
    }
}, 60 * 60 * 1000); // Ogni ora

// Funzioni di debug per sviluppo
function debugSpots(testDate) {
    if (testDate) {
        const date = new Date(testDate);
        console.log(`[DEBUG] Test per data ${testDate}:`, calculateMonthlySpots(date), 'spots');
    } else {
        console.log('[DEBUG] Spots attuali:', getSpotsDisplay());
    }
}

function testCurrentMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    console.log(`[DEBUG] Test schema fisso per ${today.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}:`);
    console.log('[DEBUG] Schema: 1-10=20, 11-15=15, 16-20=7, 21-23=5, 24-28=3, 29-30=1');
    
    for (let day = 1; day <= daysInMonth; day++) {
        const testDate = new Date(year, month, day);
        const spots = getFixedSpotsForDay(day);
        const dayName = testDate.toLocaleDateString('it-IT', { weekday: 'short' });
        console.log(`${day}/${month + 1} (${dayName}): ${spots} spots`);
    }
}

function clearSpotsCache() {
    dailySpotsCache = null;
    cacheDate = null;
    console.log('[DEBUG] Cache spots azzerata');
    updateAllSpotsDisplay();
}

// Esponi le funzioni globalmente per debug
window.debugSpots = debugSpots;
window.testCurrentMonth = testCurrentMonth;
window.clearSpotsCache = clearSpotsCache;
window.updateAllSpotsDisplay = updateAllSpotsDisplay;
