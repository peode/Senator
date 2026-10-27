import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "senator_admin";
const MAX_AGE_MS = 1000 * 60 * 60 * 12;

const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

const sign = (payload) => createHmac("sha256", secret()).update(payload).digest("hex");

const safeEqual = (a, b) => {
  const hash = (value) => createHash("sha256").update(String(value)).digest();
  return timingSafeEqual(hash(a), hash(b));
};

export const checkPassword = (password) =>
  Boolean(process.env.ADMIN_PASSWORD) && safeEqual(password, process.env.ADMIN_PASSWORD);

const readCookie = (req, name) => {
  const pair = (req.headers.cookie ?? "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
};

const isValidToken = (token) => {
  if (!token || !secret()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
};

export const setSession = (res) => {
  const expires = String(Date.now() + MAX_AGE_MS);
  res.cookie(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_MS,
    path: "/",
  });
};

export const clearSession = (res) => res.clearCookie(COOKIE, { path: "/" });

export const isAuthenticated = (req) => isValidToken(readCookie(req, COOKIE));

export const requireAdmin = (req, res, next) => {
  if (!isAuthenticated(req)) return res.status(401).json({ error: "Потрібна авторизація" });
  next();
};
