const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        project: "AI Study Vault"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
