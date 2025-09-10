import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get(["/", "/index", "/index.html"], (req, res) => {
    /* res.sendFile("./views/index.html", { root: __dirname }); */
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/new-page.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get(["/old-page.html", "/old-page"], (req, res) => {
    res.redirect(301, "/new-page.html");
});

export default router;