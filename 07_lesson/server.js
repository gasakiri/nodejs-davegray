import express from "express";
const app = express();
import path from "path";
import cors from "cors";
import { logger } from "./middleware/logEvents.js";
import errorHandler from "./middleware/errorHandler.js";
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 3500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
const whitelist = ["https://wwww.yoursite.com", "http://127.0.0.1:5500", "http://localhost:3500"];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

app.get(["/", "/index", "/index.html"], (req, res) => {
    /* res.sendFile("./views/index.html", { root: __dirname }); */
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get(["/old-page.html", "/old-page"], (req, res) => {
    res.redirect(301, "/new-page.html");
});

// Route handlers

app.get(/^\/hello|hi(\.html)?$/, (req, res, next) => {
    console.log("attemped to load hello.html");
    next();
}, (req, res) => {
    res.send("Hello World!");
});

// chaining route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}

app.get(/^\/chain(.html)?/, [one, two, three]);

/* app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
}) */

app.all(/^\/*/, (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    }
    else if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
    }
    else {
        res.type("txt").send("404 Not Found");
    }
})

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
