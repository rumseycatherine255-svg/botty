const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { Resend } = require("resend");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Try to detect public folder safely
const publicPath = path.join(__dirname, "public");

console.log("📁 Checking public folder...");
console.log("Exists:", fs.existsSync(publicPath));

if (fs.existsSync(publicPath)) {
  console.log("Files:", fs.readdirSync(publicPath));
} else {
  console.log("⚠️ Public folder missing!");
}

// Serve static ONLY if it exists
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Root route (SAFE fallback)
app.get("/", (req, res) => {
  const file = path.join(publicPath, "index.html");

  if (fs.existsSync(file)) {
    return res.sendFile(file);
  }

  // fallback so site NEVER crashes
  res.send(`
    <h1>InSafeHands Running</h1>
    <p>⚠️ index.html not found in /public</p>
  `);
});

// EMAIL SETUP
const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL = process.env.EMAIL;

// ENQUIRY ROUTE
app.post("/send-enquiry", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("📩 New enquiry:", req.body);

  if (!name || !email || !message) {
    return res.json({ success: false, error: "Missing fields" });
  }

  try {
    await resend.emails.send({
      from: "InSafeHands <onboarding@resend.dev>",
      to: EMAIL,
      subject: "New InSafeHands Enquiry",
      html: `
        <h2>New Enquiry</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <hr>
        <p>${message}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);
    res.json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 InSafeHands running on port", PORT);
});
