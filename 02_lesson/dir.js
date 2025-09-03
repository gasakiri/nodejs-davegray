import fs from "node:fs";

if (!fs.existsSync("./new")) {

    fs.mkdir("./new", (err) => {
        if (err) throw err;
        console.log("Directory crated");
    })
}

if (fs.existsSync("./new")) {

    fs.rmdir("./new", (err) => {
        if (err) throw err;
        console.log("Directory removed");
    })
}