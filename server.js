const express = require("express");
const cors = require("cors");
const path = require("path");
const { Resend } = require("resend");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL = process.env.EMAIL;

app.post("/send-enquiry", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.json({ success: false, error: "Missing fields" });
  }

  try {
    await resend.emails.send({
      from: "InSafeHands <onboarding@resend.dev>",
      to: EMAIL,
      subject: "New Enquiry",
      html: `<h2>New Enquiry</h2>
             <p><b>Name:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p>${message}</p>`
    });

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("Running"));
