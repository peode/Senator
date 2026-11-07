import { readSessionCookie } from "../lib/sessionCookie.js";
import { isValidSessionToken } from "../services/sessionService.js";

export const requireAdmin = (req, res, next) => {
  if (!isValidSessionToken(readSessionCookie(req))) {
    return res.status(401).json({ error: "Потрібна авторизація" });
  }
  next();
};
