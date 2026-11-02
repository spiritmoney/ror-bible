const functions = require("firebase-functions");
const fetch = require("node-fetch");

const ESPEES_API_KEY =
  (functions.config().espees && functions.config().espees.api_key) ||
  process.env.ESPEES_API_KEY ||
  "";

const sendCors = (res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
};

const validateCreatePayload = (payload) => {
  if (!payload || typeof payload !== "object") return "Invalid request body";
  if (!payload.product_sku || !String(payload.product_sku).trim()) {
    return "product_sku is required";
  }
  if (!payload.narration || !String(payload.narration).trim()) {
    return "narration is required";
  }
  const parsedPrice = Number(payload.price);
  if (!parsedPrice || parsedPrice <= 0) {
    return "price must be greater than 0";
  }
  if (!payload.merchant_wallet || !String(payload.merchant_wallet).trim()) {
    return "merchant_wallet is required";
  }
  if (!payload.success_url || !String(payload.success_url).trim()) {
    return "success_url is required";
  }
  if (!payload.fail_url || !String(payload.fail_url).trim()) {
    return "fail_url is required";
  }
  return "";
};

// Whitelisted CDN hosts you’re allowed to proxy
const HOST_WHITELIST = [
  "cdn.rorbible.plus",
  "rorbible.plus"
];

// HTTP function
exports.audioProxy = functions.https.onRequest(async (req, res) => {
  // Allow CORS for browsers
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).send('');
  }

  const url = req.query.url;
  if (!url) return res.status(400).send("Missing 'url' query parameter");

  try {
    const parsed = new URL(url);
    if (!HOST_WHITELIST.includes(parsed.hostname)) {
      return res.status(403).send("Forbidden host");
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch audio");
    }

    // Stream audio back to the browser
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
    res.set('Cache-Control', 'public, max-age=3600');
    response.body.pipe(res);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Server error");
  }
});

exports.downloadProxy = functions.https.onRequest(async (req, res) => {
  const allowCors = () => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
  };

  allowCors();

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    return res.status(400).send({ message: "Missing 'url' query parameter" });
  }

  try {
    const parsed = new URL(url);
    if (!HOST_WHITELIST.includes(parsed.hostname)) {
      return res.status(403).send({ message: 'Forbidden host' });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).send({ message: 'Failed to fetch proxied resource' });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();

    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error('downloadProxy error:', error);
    return res.status(500).send({ message: 'Server error' });
  }
});

exports.espeesCreateProduct = functions.https.onRequest(async (req, res) => {
  sendCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).send({ message: "Method not allowed" });
  }

  if (!ESPEES_API_KEY) {
    return res.status(500).send({ message: "Missing ESPEES API key on server" });
  }

  const validationError = validateCreatePayload(req.body);
  if (validationError) {
    return res.status(400).send({ message: validationError });
  }

  const body = {
    product_sku: String(req.body.product_sku).trim(),
    narration: String(req.body.narration).trim(),
    price: Number(req.body.price),
    merchant_wallet: String(req.body.merchant_wallet).trim(),
    success_url: String(req.body.success_url).trim(),
    fail_url: String(req.body.fail_url).trim(),
    ...(req.body.user_data ? { user_data: req.body.user_data } : {}),
  };

  try {
    const upstream = await fetch("https://api.espees.org/v2/payment/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ESPEES_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).send(data);
    }

    const paymentRef = data && data.payment_ref;
    if (!paymentRef) {
      return res.status(502).send({
        message: "Espees did not return payment reference",
        raw: data,
      });
    }

    return res.send({
      ...data,
      payment_url: `https://payment.espees.org/pay/${paymentRef}`,
    });
  } catch (error) {
    console.error("espeesCreateProduct error:", error);
    return res.status(500).send({ message: "Failed to create Espees product" });
  }
});

exports.espeesConfirmPayment = functions.https.onRequest(async (req, res) => {
  sendCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).send({ message: "Method not allowed" });
  }

  if (!ESPEES_API_KEY) {
    return res.status(500).send({ message: "Missing ESPEES API key on server" });
  }

  const paymentRef = req.body && req.body.payment_ref;
  if (!paymentRef || !String(paymentRef).trim()) {
    return res.status(400).send({ message: "payment_ref is required" });
  }

  try {
    const upstream = await fetch("https://api.espees.org/v2/payment/confirm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ESPEES_API_KEY,
      },
      body: JSON.stringify({ payment_ref: String(paymentRef).trim() }),
    });

    const data = await upstream.json().catch(() => ({}));
    return res.status(upstream.status).send(data);
  } catch (error) {
    console.error("espeesConfirmPayment error:", error);
    return res.status(500).send({ message: "Failed to confirm payment" });
  }
});
