const express = require("express");
const cors = require("cors");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());

app.get("/get-balance", async (req, res) => {
  const { wallet, timestamp } = req.query;
  if (!wallet || !API_KEY) {
    return res.status(400).json({ error: "Missing wallet or API_KEY" });
  }

  const baseUrl = `https://mainnet.helius.xyz/v0/addresses/${wallet}/balances?api-key=${API_KEY}`;
  const fullUrl = timestamp ? `${baseUrl}&timestamp=${timestamp}` : baseUrl;

  https.get(fullUrl, (response) => {
    let data = "";
    response.on("data", chunk => data += chunk);
    response.on("end", () => {
      try {
        const json = JSON.parse(data);
        res.json(json);
      } catch (e) {
        res.status(500).json({ error: "Failed to parse response" });
      }
    });
  }).on("error", (err) => {
    res.status(500).json({ error: "HTTPS request failed" });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
