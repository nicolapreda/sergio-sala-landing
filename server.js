
const express = require('express');
const path = require('path');
const app = express();

// Middleware per leggere i dati del form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve i file statici (HTML, CSS, JS, immagini)
app.use(express.static(path.join(__dirname, 'public')));

/*
app.post('/submit-form', async (req, res) => {
  const { name, email, phone } = req.body;

  // QUI: Chiamata a GoHighLevel API
  try {
    const response = await fetch("https://api.gohighlevel.com/v1/contacts/", {
      method: "POST",
      headers: {
        "Authorization": "Bearer LA_TUA_API_KEY_GHL",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        phone,
        name,
      }),
    });

    if (response.ok) {
      res.send("ok");
    } else {
      const err = await response.text();
      console.error("Errore GHL:", err);
      res.status(500).send("Errore API");
    }

  } catch (err) {
    console.error(err);
    res.status(500).send("Errore server");
  }
});
*/

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server attivo su http://0.0.0.0:${PORT}`));
