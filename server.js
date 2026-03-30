const express = require("express");
const noblox = require("noblox.js");
const app = express();
app.use(express.json());

const GROUP_ID = 36035309;
const COOKIE = process.env.COOKIE;
const API_KEY = process.env.API_KEY;

async function init() {
    try {
        await noblox.setCookie(COOKIE);
        console.log("Bot logged in successfully!");
    } catch (e) {
        console.error("Failed to log in:", e.message);
    }
}
init();

function checkKey(req, res) {
    if (req.headers["x-api-key"] !== API_KEY) {
        res.status(403).send({ success: false, error: "Forbidden" });
        return false;
    }
    return true;
}

app.get("/", (req, res) => {
    res.send("Ranking bot is running!");
});

app.post("/promote", async (req, res) => {
    if (!checkKey(req, res)) return;
    try {
        const { userId } = req.body;
        await noblox.promote(GROUP_ID, userId);
        res.send({ success: true });
    } catch (e) {
        res.status(500).send({ success: false, error: e.message });
    }
});

app.post("/demote", async (req, res) => {
    if (!checkKey(req, res)) return;
    try {
        const { userId } = req.body;
        await noblox.demote(GROUP_ID, userId);
        res.send({ success: true });
    } catch (e) {
        res.status(500).send({ success: false, error: e.message });
    }
});

app.post("/setrank", async (req, res) => {
    if (!checkKey(req, res)) return;
    try {
        const { userId, rank } = req.body;
        await noblox.setRank(GROUP_ID, userId, rank);
        res.send({ success: true });
    } catch (e) {
        res.status(500).send({ success: false, error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Bot running on port " + PORT));
