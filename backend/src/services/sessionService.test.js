import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SESSION_MAX_AGE_MS,
  checkPassword,
  createSessionToken,
  isValidSessionToken,
} from "./sessionService.js";

beforeEach(() => {
  vi.stubEnv("ADMIN_PASSWORD", "test-password");
  vi.stubEnv("SESSION_SECRET", "test-secret");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe("checkPassword", () => {
  it("приймає лише правильний пароль", () => {
    expect(checkPassword("test-password")).toBe(true);
    expect(checkPassword("wrong")).toBe(false);
  });

  it("вимикає вхід без SESSION_SECRET або ADMIN_PASSWORD", () => {
    vi.stubEnv("SESSION_SECRET", "");
    expect(checkPassword("test-password")).toBe(false);

    vi.stubEnv("SESSION_SECRET", "test-secret");
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(checkPassword("")).toBe(false);
  });
});

describe("isValidSessionToken", () => {
  it("приймає щойно створений токен", () => {
    expect(isValidSessionToken(createSessionToken())).toBe(true);
  });

  it("відхиляє прострочений токен", () => {
    vi.useFakeTimers();
    const token = createSessionToken();

    vi.advanceTimersByTime(SESSION_MAX_AGE_MS + 1);

    expect(isValidSessionToken(token)).toBe(false);
  });

  it("відхиляє токен із подовженим терміном", () => {
    const [expires, signature] = createSessionToken().split(".");

    expect(isValidSessionToken(`${Number(expires) + 1000}.${signature}`)).toBe(false);
  });

  it("відхиляє токен, підписаний іншим секретом", () => {
    const token = createSessionToken();

    vi.stubEnv("SESSION_SECRET", "other-secret");

    expect(isValidSessionToken(token)).toBe(false);
  });

  it.each([null, "", "abc", "123.", ".abc"])("відхиляє %j", (token) => {
    expect(isValidSessionToken(token)).toBe(false);
  });
});
