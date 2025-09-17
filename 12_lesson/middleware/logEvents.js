import { format } from "date-fns";
import { v4 as uuid } from "uuid";

import { appendFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);
    try {
        if (!existsSync(join(__dirname, "..", "logs"))) {
            await mkdir(join(__dirname, "..", "logs"));
        }
        // testing
        await appendFile(join(__dirname, "..", "logs", logName), logItem);
    } catch (err) {
        console.error(err);
    }
};

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
    console.log(`${req.method} ${req.path}}`);
    next();
};

export { logger, logEvents };
/* import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';

import { existsSync } from 'fs';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!existsSync(join(__dirname, 'logs'))) {
            await fsPromises.mkdir(join(__dirname, 'logs'));
        }

        await fsPromises.appendFile(join(__dirname, 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

export default logEvents;
 */