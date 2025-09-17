import { createRequire } from "module";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import fsPromises from "node:fs/promises";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
};

const handleNewUser = async (req, res) => {
    const { user, password } = req.body;
    if (!user || !password)
        return res.status(400).json({ "message": "Username and password are required" });
    // Check for duplicate usernames in the db
    const duplicate = usersDB.users.find(person => person.username === user);
    if (duplicate)
        return res.sendStatus(409); // Conflict
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);
        // store the new user
        const newUser = {
            "username": user,
            "roles": { "User": 2001 },
            "password": hashedPwd
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({ "success": `New user ${user} created` });
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
};

export default handleNewUser;