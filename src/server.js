const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY =
  "7b8kc8Uq3B9c7PGf1yaKv7sTtF1NiF8a1o65wOZQ";

const ALLOWED_PROXY_HOSTS = new Set([
  "cdn.rorbible.plus",
  "rorbible.plus",
  "api.rorbible.plus",
]);

app.get("/proxy", async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl || typeof targetUrl !== "string") {
      return res.status(400).json({ message: "Missing url query parameter" });
    }

    let parsed;
    try {
      parsed = new URL(targetUrl);
    } catch (error) {
      return res.status(400).json({ message: "Invalid url query parameter" });
    }

    if (!ALLOWED_PROXY_HOSTS.has(parsed.hostname)) {
      return res.status(403).json({ message: "Forbidden proxy host" });
    }

    const response = await axios.get(targetUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
      headers: {
        Accept: "*/*",
      },
    });

    const contentType =
      response.headers["content-type"] || "application/octet-stream";

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(response.status || 200).send(Buffer.from(response.data));
  } catch (error) {
    console.error("Proxy fetch failed:", error?.response?.status || error.message);
    const status = error?.response?.status || 500;
    const message = error?.response?.data || { message: "Failed to proxy download" };
    res.status(status).json(message);
  }
});

app.post("/create-product", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.espees.org/v2/payment/product",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err?.response?.data || err);

    res.status(500).json(
      err?.response?.data || {
        message: "Failed to create product",
      }
    );
  }
});

app.post("/confirm-payment", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.espees.org/v2/payment/confirm/",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err?.response?.data || err);

    res.status(500).json(
      err?.response?.data || {
        message: "Failed to verify payment",
      }
    );
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});