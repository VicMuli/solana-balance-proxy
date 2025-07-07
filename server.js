const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

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

  try {
    console.log("🔗 Fetching from:", fullUrl);

    const response = await fetch(fullUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Helius Error Response:", data);
      return res.status(500).json({ error: data });
    }

    console.log("✅ Helius Data:", data);
    res.json(data);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ error: "Fetch failed: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
