/**
 * Script per automatizzare il conteggio dei posti disponibili
 * basato sulla data corrente e la scalata per il mese di settembre
 */

function getAvailableSpots() {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = now.getFullYear();
    
    // Il conteggio inizia solo a settembre 2025
    if (currentYear < 2025 || (currentYear === 2025 && currentMonth < 9)) {
        // Prima di settembre 2025, rimaniamo sempre a 20 posti
        return 20;
    }
    
    // Se siamo dopo settembre 2025, usiamo la logica del giorno del mese corrente
    if (currentYear > 2025 || (currentYear === 2025 && currentMonth > 9)) {
        return calculateSpotsByDay(currentDay);
    }
    
    // Siamo a settembre 2025 - usiamo la logica della scalata
    return calculateSpotsByDay(currentDay);
}

function calculateSpotsByDay(day) {
    if (day >= 1 && day <= 10) {
        return 20;
    } else if (day >= 11 && day <= 15) {
        return 15;
    } else if (day >= 16 && day <= 20) {
        return 7;
    } else if (day >= 21 && day <= 23) {
        return 5;
    } else if (day >= 24 && day <= 28) {
        return 3;
    } else if (day >= 29 && day <= 30) {
        return 1; // "ultimo posto"
    } else {
        // Per il 31 o altri giorni, torniamo a 20 (nuovo ciclo)
        return 20;
    }
}

function updateSpotsDisplay() {
    const spots = getAvailableSpots();
    
    // Aggiorna tutti gli elementi con ID "spotsLeft"
    const spotsElements = document.querySelectorAll('#spotsLeft');
    spotsElements.forEach(element => {
        element.textContent = spots;
    });
    
    // Aggiorna tutti gli elementi con ID "spotsLeftForm"
    const spotsFormElements = document.querySelectorAll('#spotsLeftForm');
    spotsFormElements.forEach(element => {
        element.textContent = spots;
    });
    
    // Aggiorna il testo del banner in base al numero di posti
    updateBannerText(spots);
}

function updateBannerText(spots) {
    // Trova elementi che contengono testo da aggiornare
    const bannerTexts = document.querySelectorAll('[data-spots-text]');
    
    bannerTexts.forEach(element => {
        const originalText = element.getAttribute('data-spots-text');
        if (originalText) {
            let newText = originalText;
            
            // Sostituisci placeholder con il numero effettivo
            newText = newText.replace('{spots}', spots);
            
            // Aggiusta il testo in base al numero di posti
            if (spots === 1) {
                newText = newText.replace('posti', 'posto').replace('primi', 'ultimo');
            }
            
            element.textContent = newText;
        }
    });
    
    // Aggiorna urgenza del banner
    updateUrgencyLevel(spots);
}

function updateUrgencyLevel(spots) {
    const urgencyElements = document.querySelectorAll('[data-urgency]');
    
    urgencyElements.forEach(element => {
        // Rimuovi classi di urgenza esistenti
        element.classList.remove('animate-pulse', 'animate-bounce');
        
        if (spots <= 3) {
            element.classList.add('animate-bounce');
        } else if (spots <= 7) {
            element.classList.add('animate-pulse');
        }
    });
}

// Funzione per debugging - mostra informazioni sulla data
function debugSpotsInfo() {
    const now = new Date();
    const spots = getAvailableSpots();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    console.log('🔧 Debug Spots Counter:');
    console.log(`📅 Data corrente: ${now.toLocaleDateString('it-IT')}`);
    console.log(`📊 Giorno del mese: ${now.getDate()}`);
    console.log(`📍 Anno: ${currentYear}, Mese: ${currentMonth}`);
    console.log(`🎯 Posti disponibili: ${spots}`);
    
    if (currentYear < 2025 || (currentYear === 2025 && currentMonth < 9)) {
        console.log(`⏰ STATO: Prima dell'apertura (settembre 2025) - posti fissi a 20`);
    } else if (currentYear === 2025 && currentMonth === 9) {
        console.log(`🚀 STATO: Settembre 2025 - conteggio scalato attivo`);
    } else {
        console.log(`📈 STATO: Dopo settembre 2025 - conteggio basato su giorno del mese`);
    }
}

// Inizializza quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
    updateSpotsDisplay();
    
    // Debug info in console (rimuovi in produzione se non necessario)
    debugSpotsInfo();
    
    // Aggiorna ogni ora per catturare il cambio di giorno
    setInterval(updateSpotsDisplay, 60 * 60 * 1000);
});

// Esporta funzioni per uso globale
window.SpotsCounter = {
    getAvailableSpots,
    updateSpotsDisplay,
    debugSpotsInfo
};
