import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import app from "./app.js";
import * as apartmentsRepository from "./repositories/apartmentsRepository.js";

vi.mock("./lib/db.js", () => ({ prisma: {} }));
vi.mock("./repositories/apartmentsRepository.js");

const prismaNotFound = Object.assign(new Error("not found"), { code: "P2025" });

let server;
let baseUrl;

const request = (path, options) => fetch(`${baseUrl}/api${path}`, options);

const postJson = (path, body) =>
  request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const login = async () => {
  const response = await postJson("/session", { password: "test-password" });
  return response.headers.get("set-cookie").split(";")[0];
};

const patchUnit = (cookie, body = { available: false }) =>
  request("/apartments/1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(cookie && { cookie }) },
    body: JSON.stringify(body),
  });

beforeAll(async () => {
  vi.stubEnv("ADMIN_PASSWORD", "test-password");
  vi.stubEnv("SESSION_SECRET", "test-secret");
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  vi.unstubAllEnvs();
  await new Promise((resolve) => server.close(resolve));
});

beforeEach(() => {
  vi.mocked(apartmentsRepository.findForSale).mockReset().mockResolvedValue([]);
  vi.mocked(apartmentsRepository.updateUnit).mockReset();
});

describe("обробка помилок", () => {
  it("відповідає 404 на невідомий шлях", async () => {
    const response = await request("/unknown");

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Не знайдено" });
  });

  it("перетворює помилку валідації на 400 з полями", async () => {
    const response = await request("/apartments?rooms=-1");

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Невірне значення фільтра",
      fields: { rooms: "Невірне значення фільтра" },
    });
  });

  it("відповідає 400 на зіпсований JSON", async () => {
    const response = await postJson("/session", "{");

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Невірний JSON" });
  });

  it("відповідає 413 на завелике тіло запиту", async () => {
    const response = await postJson("/session", { password: "x".repeat(2000) });

    expect(response.status).toBe(413);
  });

  it("перетворює P2025 від Prisma на 404", async () => {
    vi.mocked(apartmentsRepository.updateUnit).mockRejectedValue(prismaNotFound);

    const response = await patchUnit(await login());

    expect(response.status).toBe(404);
  });

  it("не показує деталі невідомої помилки", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(apartmentsRepository.findForSale).mockRejectedValue(new Error("секрет"));

    const response = await request("/apartments");

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Помилка сервера" });
    consoleError.mockRestore();
  });
});

describe("сесія адміністратора", () => {
  it("не пускає до адмінських дій без входу", async () => {
    const response = await patchUnit();

    expect(response.status).toBe(401);
    expect(apartmentsRepository.updateUnit).not.toHaveBeenCalled();
  });

  it("не пускає з підробленою cookie", async () => {
    const response = await patchUnit(`senator_admin=${Date.now() + 60_000}.fake`);

    expect(response.status).toBe(401);
  });

  it("відхиляє неправильний пароль", async () => {
    const response = await postJson("/session", { password: "wrong" });

    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("пропускає після входу", async () => {
    vi.mocked(apartmentsRepository.updateUnit).mockResolvedValue({ id: 1, floor: 2, available: false });

    const response = await patchUnit(await login());

    expect(response.status).toBe(200);
    expect(apartmentsRepository.updateUnit).toHaveBeenCalledWith(1, { available: false });
  });

  it("показує стан сесії", async () => {
    const cookie = await login();

    const anonymous = await request("/session");
    const admin = await request("/session", { headers: { cookie } });

    expect(await anonymous.json()).toEqual({ authenticated: false });
    expect(await admin.json()).toEqual({ authenticated: true });
  });
});
