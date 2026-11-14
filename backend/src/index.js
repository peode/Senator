import app from "./app.js";

// Лише API. Фронтенд деплоїться окремо (Vercel) і проксює /api сюди — див. frontend/vercel.json
const port = process.env.PORT || 3001;

if (!process.env.SESSION_SECRET) {
  console.error("SESSION_SECRET не заданий: вхід в адмін-панель вимкнено");
}

app.listen(port, (error) => {
  // Express передає сюди й помилку запуску, наприклад зайнятий порт
  if (error) throw error;
  console.log(`API: http://localhost:${port}`);
});
