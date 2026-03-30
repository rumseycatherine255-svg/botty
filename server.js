const express = require("express");
const noblox = require("noblox.js");
const app = express();
app.use(express.json());

const GROUP_ID = 36035309;
const COOKIE = process.env._|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhADIhsKBGR1aWQSEzUxNDc5NjA1MjM4NDIzMjYxOTIoBA.bQy3AFI-XSUBlpomUKE208r46tDV_SDdI71HoDgJsUcv3Cdv1Dxgba_5x3lFgB_w_55gJko1tJ9kzTdPHKhZ5iw0-RNUs1bzCmxmAB2M9IOm8P8Q01QOxqBzaRBN8o61NsJ9HBeGp7wiioSnP-3g8bNJMOE4HWFfq_XTw9OEknHLn33lG2GkgmreqdtcUE8Un1PFUDcFL_l2YI4zjimygVLb2yyeYRdTvjmoOb3vQg1pnuGIhpeYDLs18DIMOQswlL3wibhpB8mmRPVicBEr_Ab9G1a2_Z2bTUjeK3bLwe_x3VsRhrXireowG8zETJfRnMzBdqn-N4g4wbmsjuUOKRdiC03Q4wvD0IWy6Mb8hxTm4ZsC95Tx7fr9SzRNUWj23_7Dcr2AVLRhv-xsgp1rPZka9ew2BtptQD0G67cgEv9U9ifHCWRP3Rnl9EST7_gE9r43cvSAUUw2XLmkZeY78mfbl0H6inC7NIjLuIyqC4vvB5VUlWOCxgnWa483SKBZDEU1lu1NUtjU_81CQxq9GDyM5qHEz0AxNQv-qtIPXuSnYdhhMHODSjFnyY5xOa6BVLiAkgPZPSzflwE3v1jzmH8IvLE8AKqF3VvP8terheQveNPZ0Mhf8n57qdS4uT6yTpNLPWevuav1bO5J8QV14enICoIn3s5Cdck8gPnx0DHws8M_eEYfaBHhzBR3beWrRELW58lniaZw9QK4Rc72O38tZ0_nJxSfgOoryhfl6pO6cUUSrF5K79e-ZVwb2HOeYSKdW5L7RoqDSo63Wj1JU1h1-lfwanHoe0cA9q7B7u_mup1IRiRPRbfWE85qEco3FTc-iUXZvVT0p9yWQV8l3zCMfdNN07SUeNnrwIHZ30cx_J0oFOd0nI3jMSCvsjf4LnFfdlZdBV6TxcQbsfU7glCm-dfqPnPirfg8eUjMWsV3x3ZN2d7Hetj6d0IoYDDWXFZ9sg;
const API_KEY = process.env.C7MnYz3C3FE0d2n6x4;

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
