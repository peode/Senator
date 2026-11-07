import { loginSchema } from "../lib/schemas.js";
import { clearSessionCookie, readSessionCookie, setSessionCookie } from "../lib/sessionCookie.js";
import { checkPassword, createSessionToken, isValidSessionToken } from "../services/sessionService.js";

export const current = (req, res) => {
  res.json({ authenticated: isValidSessionToken(readSessionCookie(req)) });
};

export const login = (req, res) => {
  const { password } = loginSchema.parse(req.body);
  if (!checkPassword(password)) return res.status(401).json({ error: "Невірний пароль" });
  setSessionCookie(res, createSessionToken());
  res.status(201).json({ authenticated: true });
};

export const logout = (req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
};
