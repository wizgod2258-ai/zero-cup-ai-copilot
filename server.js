import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import crypto from "crypto";
import { Indexer, ZgFile } from "@0gfoundation/0g-storage-ts-sdk";
import { ethers } from "ethers";

dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

const evmRpc = "https://evmrpc-testnet.0g.ai";
const indRpc = "https://indexer-storage-testnet-turbo.0g.ai";

let vault = [];

/* =========================
   ENCRYPTION (DEMO SAFE)
========================= */

function encrypt(text) {
    const key = crypto
        .createHash("sha256")
        .update(process.env.PRIVATE_KEY || "demo-key")
        .digest();

    const iv = Buffer.alloc(16, 0);

    const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
    return cipher.update(text, "utf8", "hex") + cipher.final("hex");
}

function decrypt(text) {
    const key = crypto
        .createHash("sha256")
        .update(process.env.PRIVATE_KEY || "demo-key")
        .digest();

    const iv = Buffer.alloc(16, 0);

    const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);
    return decipher.update(text, "hex", "utf8") + decipher.final("utf8");
}

/* =========================
   AI SUMMARY (DEMO STYLE)
========================= */

function aiSummary(text) {
    return "🧠 " + text.split(" ").slice(0, 10).join(" ") + "...";
}

/* =========================
   SAVE (DEMO FLOW OPTIMIZED)
========================= */

async function saveTo0G(text) {

    const encrypted = encrypt(text);
    const summary = aiSummary(text);

    const payload = {
        encrypted,
        summary,
        preview: text.slice(0, 40),
        createdAt: Date.now()
    };

    fs.writeFileSync("./vault.json", JSON.stringify(payload, null, 2));

    const file = await ZgFile.fromFilePath("./vault.json");

    const [tree, err] = await file.merkleTree();
    if (err) throw new Error(err);

    const provider = new ethers.JsonRpcProvider(evmRpc);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const indexer = new Indexer(indRpc);

    const [tx, uploadErr] = await indexer.upload(file, evmRpc, signer);

    await file.close();

    if (uploadErr) throw new Error(uploadErr);

    const entry = {
        rootHash: tree.rootHash(),
        summary,
        encrypted,
        txHash: tx?.txHash || ""
    };

    vault.unshift(entry); // newest first

    return {
        rootHash: entry.rootHash,
        summary,
        txHash: entry.txHash
    };
}

/* =========================
   SAVE API
========================= */

app.post("/save", async (req, res) => {
    try {
        const { text } = req.body;

        const result = await saveTo0G(text);

        res.json({
            success: true,
            title: "Stored in 0G Vault",
            ...result
        });

    } catch (e) {
        res.json({
            success: false,
            error: "Vault storage failed"
        });
    }
});

/* =========================
   LOAD API (DEMO CLEAN OUTPUT)
========================= */

app.post("/load", async (req, res) => {
    try {
        const { rootHash } = req.body;

        const indexer = new Indexer(indRpc);
        const filePath = "./download.json";

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        const err = await indexer.download(rootHash, filePath, true);
        if (err) throw new Error(err);

        const raw = fs.readFileSync(filePath, "utf8");
        const data = JSON.parse(raw);

        res.json({
            success: true,
            original: decrypt(data.encrypted),
            summary: data.summary
        });

    } catch (e) {
        res.json({
            success: false,
            error: "Unable to decrypt vault"
        });
    }
});

/* =========================
   SEARCH (FAST DEMO MODE)
========================= */

app.post("/search", (req, res) => {
    const query = (req.body.query || "").toLowerCase();

    const results = vault
        .filter(v =>
            v.summary.toLowerCase().includes(query) ||
            v.encrypted.toLowerCase().includes(query)
        )
        .map(v => ({
            rootHash: v.rootHash,
            summary: v.summary
        }));

    res.json({
        success: true,
        count: results.length,
        results
    });
});

/* =========================
   CHAT (WOW DEMO RESPONSE)
========================= */

app.post("/chat", (req, res) => {
    const { question } = req.body;

    if (vault.length === 0) {
        return res.json({
            success: true,
            answer: "Your vault is empty. Add a note to start intelligence generation."
        });
    }

    const context = vault
        .slice(0, 5)
        .map(v => v.summary)
        .join("\n");

    res.json({
        success: true,
        answer:
`🧠 Vault Intelligence Response:

Based on your stored knowledge:

${context}

💡 Insight: Your vault is building a personal knowledge graph.`
    });
});

/* =========================
   HISTORY (DEMO ORDER)
========================= */

app.get("/history", (req, res) => {
    res.json(vault.slice(0, 20));
});

/* =========================
   STATS (LIVE DEMO KPI)
========================= */

app.get("/stats", (req, res) => {
    res.json({
        totalNotes: vault.length,
        status: "Vault Active",
        network: "0G Storage"
    });
});

/* =========================
   START SERVER
========================= */

app.listen(3000, () => {
    console.log("🚀 VaultOS DEMO READY → http://localhost:3000");
});
