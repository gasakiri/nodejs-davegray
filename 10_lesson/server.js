import express from "express";
const app = express();
import path from "path";
import cors from "cors";
import { logger } from "./middleware/logEvents.js";
import errorHandler from "./middleware/errorHandler.js";
import rootRouter from "./routes/root.js";
import employeesRouter from "./routes/api/employees.js";
import registerRouter from "./routes/register.js";
import authRouter from "./routes/auth.js";
import { fileURLToPath } from "url";
import corsOptions from "./config/corsOptions.js";

const PORT = process.env.PORT || 3500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

// routes
app.use("/", rootRouter);
app.use("/employees", employeesRouter);
app.use("/register", registerRouter);
app.use("/auth", authRouter);

app.all(/^\/*/, (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
);
