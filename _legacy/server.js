require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const GOHIGHLEVEL_API_KEY = process.env.GOHIGHLEVEL_API_KEY;

// Middleware per leggere i dati del form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve i file statici (HTML, CSS, JS, immagini)
app.use(express.static(path.join(__dirname, 'public')));

// Funzione per salvare lead localmente come backup
function saveLeadLocally(leadData) {
  const timestamp = new Date().toISOString();
  const leadWithTimestamp = {
    ...leadData,
    timestamp,
    source: 'landing-page'
  };
  
  const leadsFile = path.join(__dirname, 'leads-backup.json');
  let leads = [];
  
  // Leggi leads esistenti
  if (fs.existsSync(leadsFile)) {
    try {
      const fileContent = fs.readFileSync(leadsFile, 'utf8');
      leads = JSON.parse(fileContent);
    } catch (err) {
      console.error('Errore lettura file leads:', err);
    }
  }
  
  // Aggiungi nuovo lead
  leads.push(leadWithTimestamp);
  
  // Salva file aggiornato
  try {
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    console.log('💾 Lead salvato in leads-backup.json');
    return true;
  } catch (err) {
    console.error('❌ Errore salvataggio lead:', err);
    return false;
  }
}


app.post('/submit-form', async (req, res) => {
  console.log('📥 Richiesta ricevuta:', req.body);
  const { name, email, phone, business, challenge } = req.body;

  // Validazione base
  if (!name || !email || !phone) {
    console.log('❌ Dati mancanti:', { name, email, phone });
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }

  // QUI: Chiamata a GoHighLevel API
  try {
    console.log('🔄 Invio a GoHighLevel...');
    
    // Prova prima con l'API v1 (più recente)
    const apiUrl = "https://rest.gohighlevel.com/v1/contacts/";
    console.log('🌐 URL API:', apiUrl);
    
    const payload = {
      email,
      phone,
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || '',
      name: name,
      tags: ["Landing SSA"],  // Tag automatico per identificare lead dalla landing
      source: "Landing Page SSA",
      dateAdded: new Date().toISOString(),  // Aggiungiamo timestamp esplicito
      customFields: [
        {
          key: "business_type",
          field_value: business || "Non specificato"
        },
        {
          key: "challenge",
          field_value: challenge || "Non specificato"
        }
      ]
    };
    console.log('📤 Payload con timestamp:', payload);
    console.log('🕐 Timestamp attuale:', new Date().toISOString());
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GOHIGHLEVEL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    console.log('📊 Risposta GoHighLevel status:', response.status);
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('✅ Lead inviato con successo a GoHighLevel:', responseData);
      console.log('📅 Timestamp invio GoHighLevel:', new Date().toISOString());
      console.log('🆔 ID contatto GoHighLevel:', responseData.contact?.id || 'Non disponibile');
      res.json({ success: true, message: 'Lead inviato con successo', ghlId: responseData.contact?.id });
    } else {
      const err = await response.text();
      console.error("❌ Errore GHL:", err);
      
      // FALLBACK: Salva lead localmente se API fallisce
      console.log('⚠️ MODALITÀ FALLBACK: Salvando lead localmente');
      const leadSaved = saveLeadLocally(payload);
      
      if (leadSaved) {
        console.log('✅ Lead salvato con successo in backup locale');
        res.json({ 
          success: true, 
          message: 'Lead ricevuto e salvato (verrà processato appena possibile)',
          fallback: true 
        });
      } else {
        res.status(500).json({ error: 'Errore nel salvataggio del lead' });
      }
    }

  } catch (err) {
    console.error('💥 Errore server:', err);
    
    // FALLBACK anche per errori di rete
    console.log('⚠️ FALLBACK per errore di rete: Salvando lead localmente');
    const leadData = { 
      name, 
      email, 
      phone, 
      business: business || "Non specificato",
      challenge: challenge || "Non specificato",
      firstName: name.split(' ')[0] || name 
    };
    const leadSaved = saveLeadLocally(leadData);
    
    if (leadSaved) {
      res.json({ 
        success: true, 
        message: 'Lead ricevuto e salvato (verrà processato appena possibile)',
        fallback: true 
      });
    } else {
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }
});

// Endpoint per testare la connessione GoHighLevel
app.get('/test-ghl', async (req, res) => {
  try {
    console.log('🧪 Test connessione GoHighLevel...');
    console.log('🕐 Timestamp test:', new Date().toISOString());
    
    const apiUrl = "https://rest.gohighlevel.com/v1/contacts/";
    
    const testPayload = {
      email: `test-${Date.now()}@ssaagency.it`,
      phone: "+393701234567",
      firstName: "Test",
      lastName: "Connection",
      name: "Test Connection",
      tags: ["Landing SSA", "Test"],
      source: "API Test",
      dateAdded: new Date().toISOString(),
      customFields: [
        {
          key: "business_type",
          field_value: "Test Business"
        },
        {
          key: "challenge",
          field_value: "Test Challenge"
        }
      ]
    };
    
    console.log('📤 Test payload:', testPayload);
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GOHIGHLEVEL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testPayload),
    });
    
    console.log('📊 Test response status:', response.status);
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('✅ Test GoHighLevel riuscito:', responseData);
      res.json({ 
        success: true, 
        message: 'Connessione GoHighLevel OK',
        timestamp: new Date().toISOString(),
        response: responseData 
      });
    } else {
      const err = await response.text();
      console.error("❌ Test GoHighLevel fallito:", err);
      res.status(500).json({ 
        success: false, 
        error: err,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('💥 Errore test GoHighLevel:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint per visualizzare i lead salvati localmente
app.get('/leads', (req, res) => {
  const leadsFile = path.join(__dirname, 'leads-backup.json');
  
  if (!fs.existsSync(leadsFile)) {
    return res.json({ leads: [], message: 'Nessun lead salvato' });
  }
  
  try {
    const fileContent = fs.readFileSync(leadsFile, 'utf8');
    const leads = JSON.parse(fileContent);
    res.json({ 
      leads, 
      count: leads.length,
      message: `${leads.length} lead(s) salvati localmente` 
    });
  } catch (err) {
    console.error('Errore lettura leads:', err);
    res.status(500).json({ error: 'Errore nel leggere i lead salvati' });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server attivo su http://0.0.0.0:${PORT}`));
