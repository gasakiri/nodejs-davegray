import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 3500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get(["/", "/index", "/index.html"], (req, res) => {
    /* res.sendFile("./views/index.html", { root: __dirname }); */
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get(["/old-page.html", "/old-page"], (req, res) => {
    res.redirect(301, "/new-page.html");
});

// Route handlers

/* app.get("*", (res, res) => {
    res.sendFile(path.join(__dirname, "views", "404.html"));
}); */
app.get(/^\/hello|hi(\.html)?$/, (req, res, next) => {
    console.log("attemped to load hello.html");
    next();
}, (req, res) => {
    res.send("Hello World!");
});

// chaining route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}

app.get(/^\/chain(.html)?/, [one, two, three]);

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
})

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


/* import { createServer } from 'http';
import { existsSync } from "node:fs";
import { extname, join, parse, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import EventEmitter from 'events';
import fsPromises from 'fs/promises';
import logEvents from './logEvents.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

class Emitter extends EventEmitter { };
// initialize object 
const myEmitter = new Emitter();
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.error(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

const server = createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    const extension = extname(req.url);

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? join(__dirname, 'views', req.url)
                    : join(__dirname, req.url);

    // makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = existsSync(filePath);

    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        switch (parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' });
                res.end();
                break;
            default:
                serveFile(join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); */