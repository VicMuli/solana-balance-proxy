const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/get-balance", async (req, res) => {
  const { wallet } = req.query;

  if (!wallet) {
    return res.status(400).json({ error: "Missing wallet address" });
  }

  const url = `https://public-api.solscan.io/account/${wallet}`;

  try {
    console.log("🔗 Fetching from:", url);
    const response = await fetch(url, {
      headers: { accept: "application/json" }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "Solscan error: " + text });
    }

    const data = await response.json();

    if (!("lamports" in data)) {
      return res.status(500).json({ error: "Invalid response format from Solscan" });
    }

    const balanceSOL = data.lamports / 1e9;

    res.json({ sol: balanceSOL, raw: data });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Fetch failed: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
