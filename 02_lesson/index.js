import { readFile, appendFile, writeFile, rename, unlink } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

const fileOps = async () => {
    try {
        const data = await readFile(join(currentDir, "files", "starter.txt"), "utf8");
        console.log(data);
        await unlink(join(currentDir, "files", "starter.txt"));
        await writeFile(join(currentDir, "files", "promises.txt"), data);
        await appendFile(join(currentDir, "files", "promises.txt"), "\n\nNice to meet you.");
        await rename(join(currentDir, "files", "promises.txt"), join(currentDir, "files", "promisesComplete.txt"));
        const newData = await readFile(join(currentDir, "files", "promisesComplete.txt"), "utf8");
        console.log(newData);
    } catch (err) {
        console.error(err);
    }
}

fileOps();

/* readFile(join(currentDir, "files", "starter.txt"), "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
});

console.log("Hello...");

writeFile(join(currentDir, "files", "reply.txt"), "Nice to meet you.", (err) => {
    if (err) throw err;
    console.log("Write complete");

    appendFile(join(currentDir, "files", "reply.txt"), "Testing text.", (err) => {
        if (err) throw err;
        console.log("Append complete");

        rename(join(currentDir, "files", "reply.txt"), join(currentDir, "files", "new.txt"), (err) => {
            if (err) throw err;
            console.log("Rename complete");
        });
    });
});

readFile(join(currentDir, "files", "reply.txt"), "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
});

appendFile(join(currentDir, "files", "test.txt"), "Testing text.", (err) => {
    if (err) throw err;
    console.log("Append complete");
});

process.on("uncaughtException", err => {
    console.error(`There was an uncaught error ${err}`);
    process.exit();
}) */