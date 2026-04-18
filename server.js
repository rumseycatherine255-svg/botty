const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { Resend } = require("resend");

const app = express();

app.use(cors());
app.use(express.json());

// DO NOT use express.static (removes Railway conflicts)

// ENV
const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL = process.env.EMAIL;

// Health check (IMPORTANT)
app.get("/health", (req, res) => {
  res.send("OK");
});

// ROOT ROUTE (FORCE FILE LOAD)
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public", "index.html");

  console.log("Trying file:", filePath);
  console.log("Exists:", fs.existsSync(filePath));

  if (!fs.existsSync(filePath)) {
    return res.status(500).send("index.html missing in public folder");
  }

  res.setHeader("Content-Type", "text/html");
  res.sendFile(filePath);
});

// ENQUIRY ROUTE
app.post("/send-enquiry", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("📩 enquiry:", req.body);

  if (!name || !email || !message) {
    return res.json({ success: false, error: "Missing fields" });
  }

  try {
    await resend.emails.send({
      from: "InSafeHands <onboarding@resend.dev>",
      to: EMAIL,
      subject: "New Enquiry",
      html: `
        <h2>New Enquiry</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p>${message}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// IMPORTANT: bind to Railway properly
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Running on port", PORT);
});
