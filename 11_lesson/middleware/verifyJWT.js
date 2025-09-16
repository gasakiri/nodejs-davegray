import dotenv from "dotenv";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fsPromises from "fs/promises";
import path from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.sendStatus(401);
    console.log(authHeader); // Bearer token
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded) => {
            if (err) return res.sendStatus(403); // invalid token
            req.user = decoded.username;
            next();
        }
    )
}

export default verifyJWT;