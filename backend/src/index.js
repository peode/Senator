import app from "./app.js";

// Лише API. Фронтенд деплоїться окремо (Vercel) і проксює /api сюди — див. frontend/vercel.json
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API: http://localhost:${port}`));
