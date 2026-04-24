const express = require("express");
const path = require("path");
const { Resend } = require("resend");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* EMAIL SETUP */
const resend = new Resend(process.env.RESEND_API_KEY);

/* DISCORD WEBHOOK */
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

async function sendDiscord(payload) {
  if (!DISCORD_WEBHOOK) return;
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("DISCORD WEBHOOK FAILED:", err);
  }
}

/* STORAGE */
let chats = {};
let quotes = [];

/* ---------------- QUOTE ---------------- */
app.post("/send-quote", async (req, res) => {
  const { name, email, phone, address, message } = req.body;
  if (!name || !email || !phone || !address || !message) {
    return res.json({ success: false, error: "Missing fields" });
  }

  // Send to Discord
  await sendDiscord({
    embeds: [{
      title: "📋 New Quote Request",
      color: 0x22d3ee,
      fields: [
        { name: "Name",    value: name,    inline: true },
        { name: "Phone",   value: phone,   inline: true },
        { name: "Email",   value: email,   inline: false },
        { name: "Address", value: address, inline: false },
        { name: "Message", value: message, inline: false }
      ],
      timestamp: new Date().toISOString()
    }]
  });

  // Send email
  try {
    const response = await resend.emails.send({
      from: "InSafeHands <onboarding@resend.dev>",
      to: process.env.EMAIL || "YOUR_EMAIL@gmail.com",
      subject: "⚡ NEW QUOTE REQUEST",
      html: `
        <h2>New Quote Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Address:</b> ${address}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });
    console.log("EMAIL SENT:", response);
    quotes.push({ name, email, phone, address, message });
    res.json({ success: true });
  } catch (err) {
    console.error("EMAIL FAILED:", err);
    res.json({ success: false, error: err.message });
  }
});

/* ---------------- CHAT ---------------- */
app.post("/send-message", async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.json({ success: false, error: "Missing data" });
  }

  // Send to Discord
  await sendDiscord({
    embeds: [{
      title: "💬 New Live Chat Message",
      color: 0x1e3a8a,
      fields: [
        { name: "From",    value: name,    inline: true },
        { name: "Message", value: message, inline: false }
      ],
      timestamp: new Date().toISOString()
    }]
  });

  if (!chats[name]) chats[name] = [];
  chats[name].push({ sender: "user", message, time: Date.now() });
  res.json({ success: true });
});

/* ---------------- DATA ---------------- */
app.get("/data", (req, res) => {
  res.json({ chats, quotes });
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("🚀 Running on port", PORT);
});
