import { format } from "date-fns";
import { v4 as uuid } from "uuid";

import { appendFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const logEvents = async (message) => {
    const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);
    try {
        if (!existsSync(join(__dirname, "logs"))) {
            await mkdir(join(__dirname, "logs"));
        }
        // testing
        await appendFile(join(__dirname, "logs", "eventLog.txt"), logItem);
    } catch (err) {
        console.error(err);
    }
};

export default logEvents;