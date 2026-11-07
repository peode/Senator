import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 12;

const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

const sign = (payload) => createHmac("sha256", secret()).update(payload).digest("hex");

const safeEqual = (a, b) => {
  const hash = (value) => createHash("sha256").update(String(value)).digest();
  return timingSafeEqual(hash(a), hash(b));
};

export const checkPassword = (password) =>
  Boolean(process.env.ADMIN_PASSWORD) && safeEqual(password, process.env.ADMIN_PASSWORD);

export const createSessionToken = () => {
  const expires = String(Date.now() + SESSION_MAX_AGE_MS);
  return `${expires}.${sign(expires)}`;
};

export const isValidSessionToken = (token) => {
  if (!token || !secret()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
};
