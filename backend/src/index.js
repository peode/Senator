import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import app from "./app.js";

// Запуск на власному сервері / локально. На Vercel сайт віддає сама платформа, а API — api/index.js у корені репозиторію
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../frontend/dist");

app.use(express.static(dist));
app.get("/{*splat}", (req, res) => res.sendFile(path.join(dist, "index.html")));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server: http://localhost:${port}`));
