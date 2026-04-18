const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

// MUST be reachable test route
app.get("/", (req, res) => {
  res.send("🔥 InSafeHands is LIVE");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

// IMPORTANT BINDING
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on", PORT);
});
