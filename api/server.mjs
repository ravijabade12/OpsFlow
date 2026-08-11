/**
 * Host-friendly JSON Server entry.
 * Uses PORT from the environment (Render/Railway) and avoids --watch.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const jsonServer = require("json-server");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3001);
const dbPath = path.join(__dirname, "db.json");

const server = jsonServer.create();
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

server.listen(port, "0.0.0.0", () => {
  console.log(`OpsFlow API listening on http://0.0.0.0:${port}`);
});
