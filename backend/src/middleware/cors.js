import cors from "cors";

// CORS_ORIGIN — дозволені домени через кому. Порожньо — лише той самий домен:
// фронтенд ходить на API через проксі (Vite, Vercel), тож CORS-заголовки йому не потрібні
const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const corsMiddleware = cors({ origin: allowedOrigins, credentials: true });
