import { SESSION_MAX_AGE_MS } from "../services/sessionService.js";

const COOKIE = "senator_admin";

export const readSessionCookie = (req) => {
  const pair = (req.headers.cookie ?? "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE}=`));
  return pair ? decodeURIComponent(pair.slice(COOKIE.length + 1)) : null;
};

export const setSessionCookie = (res, token) => {
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_MS,
    path: "/",
  });
};

export const clearSessionCookie = (res) => res.clearCookie(COOKIE, { path: "/" });
