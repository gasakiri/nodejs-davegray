import { createRequire } from "module";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
};

const handleLogin = async (req, res) => {
    const { user, password } = req.body;
    if (!user || !password)
        return res.status(400).json({ "message": "Username and password are required" });
    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) 
        return res.sendStatus(401); // Unauthorized
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // create JWT
        res.json({ "success": `User ${user} is logged in!` });
    } 
    else {
        res.sendStatus(401);
    }
};

export default handleLogin;