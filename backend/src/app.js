import express from "express";
import { ZodError } from "zod";
import newsRouter from "./routes/news.js";
import leadsRouter from "./routes/leads.js";
import adminRouter from "./routes/admin.js";

const app = express();

app.disable("x-powered-by");
// за reverse-proxy (Nginx, хостинг) потрібен справжній IP клієнта для rate limit
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use("/api/news", newsRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/admin", adminRouter);
app.use("/api", (req, res) => res.status(404).json({ error: "Не знайдено" }));

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: err.issues[0]?.message ?? "Невірні дані",
      fields: Object.fromEntries(err.issues.map((issue) => [issue.path.join("."), issue.message])),
    });
  }
  if (err.type === "entity.too.large") return res.status(413).json({ error: "Забагато даних" });
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Невірний JSON" });
  if (err.code === "P2025") return res.status(404).json({ error: "Запис не знайдено" });
  console.error(err);
  res.status(500).json({ error: "Помилка сервера" });
});

export default app;
