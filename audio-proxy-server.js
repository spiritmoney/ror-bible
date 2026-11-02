const express = require('express');
const fetch = require('node-fetch'); // Install this too
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/audio-proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(response.status).send('Failed to fetch');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'audio/mpeg');
    response.body.pipe(res);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).send('Server error');
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Audio proxy running on port ${PORT}`));
