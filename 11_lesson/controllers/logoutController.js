import { createRequire } from "module";
import jwt from "jsonwebtoken";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { ref } from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
};

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.sendStatus(204); // No content

    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie(
            "jwt",
            { httpOnly: true, sameSite: "None", secure: true });

        return res.sendStatus(403);
    }

    // Delete refreshToken in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: "" };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); // secure: true - only serves on https
    res.sendStatus(204);
};

export default handleLogout;