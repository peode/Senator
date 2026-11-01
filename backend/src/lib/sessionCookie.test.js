import { describe, expect, it, vi } from "vitest";
import { SESSION_MAX_AGE_MS } from "../services/sessionService.js";
import { clearSessionCookie, readSessionCookie, setSessionCookie } from "./sessionCookie.js";

describe("readSessionCookie", () => {
  it("знаходить cookie серед інших і декодує значення", () => {
    const req = { headers: { cookie: "theme=dark; senator_admin=a%2Eb; lang=uk" } };

    expect(readSessionCookie(req)).toBe("a.b");
  });

  it.each([{}, { cookie: "theme=dark" }, { cookie: "senator_admin_old=abc" }])(
    "повертає null без потрібної cookie: %j",
    (headers) => {
      expect(readSessionCookie({ headers })).toBeNull();
    },
  );
});

describe("setSessionCookie", () => {
  it("ставить httpOnly cookie, а secure — лише в продакшені", () => {
    const res = { cookie: vi.fn() };

    setSessionCookie(res, "token");
    vi.stubEnv("NODE_ENV", "production");
    setSessionCookie(res, "token");
    vi.unstubAllEnvs();

    const options = { httpOnly: true, sameSite: "strict", maxAge: SESSION_MAX_AGE_MS, path: "/" };
    expect(res.cookie).toHaveBeenNthCalledWith(1, "senator_admin", "token", { ...options, secure: false });
    expect(res.cookie).toHaveBeenNthCalledWith(2, "senator_admin", "token", { ...options, secure: true });
  });
});

it("clearSessionCookie очищує cookie на всьому сайті", () => {
  const res = { clearCookie: vi.fn() };

  clearSessionCookie(res);

  expect(res.clearCookie).toHaveBeenCalledWith("senator_admin", { path: "/" });
});
