/**
 * Mongo DB
*/

import dotenv from "dotenv/config";
import { fileURLToPath } from "url";
import { logger } from "./middleware/logEvents.js";
import authRouter from "./routes/auth.js";
import connectDB from "./config/dbConn.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import credentials from "./middleware/credentials.js";
import employeesRouter from "./routes/api/employees.js";
import errorHandler from "./middleware/errorHandler.js";
import express from "express";
import logoutRouter from "./routes/logout.js";
import mongoose from "mongoose";
import path from "path";
import refreshRouter from "./routes/refresh.js";
import registerRouter from "./routes/register.js";
import rootRouter from "./routes/root.js";
import verifyJWT from "./middleware/verifyJWT.js";

// Connect to MongoDB
connectDB();

const app = express();

const PORT = process.env.PORT || 3500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// custom middleware logger
app.use(logger);

app.use(credentials);
// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//middleware for cookes
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/public")));

// routes
app.use("/", rootRouter);
app.use("/register", registerRouter);
app.use("/auth", authRouter);
app.use("/refresh", refreshRouter);
app.use("/logout", logoutRouter);

app.use(verifyJWT);
app.use("/employees", employeesRouter);

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

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
        console.log(`Server running at http://localhost:${PORT}`)
    );
});