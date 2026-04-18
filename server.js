const express = require("express");
const cors = require("cors");
const path = require("path");
const { Resend } = require("resend");

const app = express();

// IMPORTANT MIDDLEWARE (this fixes your form issue)
app.use(cors());
app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, "public")));

// env
const resend = new Resend(process.env.RESEND_API_KEY);

// homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// enquiry route
app.post("/send-enquiry", async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log("📩 Incoming enquiry:", req.body);

  if (!name || !email || !phone || !message) {
    return res.json({ success: false, error: "Missing fields" });
  }

  try {
    await resend.emails.send({
      from: "InSafeHands <onboarding@resend.dev>",
      to: process.env.EMAIL,
      subject: "New Cleaning Enquiry",
      html: `
        <h2>New Cleaning Enquiry</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b><br>${message}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.log("EMAIL ERROR:", err);
    res.json({ success: false, error: err.message });
  }
});

// railway port fix
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Running on", PORT);
});
