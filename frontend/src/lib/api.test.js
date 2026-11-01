import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, api } from "./api";

const fetchMock = vi.fn();

const respond = (status, body) =>
  fetchMock.mockResolvedValue(new Response(body === undefined ? null : JSON.stringify(body), { status }));

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => vi.unstubAllGlobals());

describe("api", () => {
  it("робить GET без тіла й заголовків", async () => {
    respond(200, { ok: true });

    expect(await api("/news")).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith("/api/news", { method: "GET", headers: undefined, body: undefined });
  });

  it("надсилає тіло як JSON", async () => {
    respond(201, {});

    await api("/leads", { method: "POST", body: { name: "Марія" } });

    expect(fetchMock).toHaveBeenCalledWith("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"name":"Марія"}',
    });
  });

  it("повертає порожній об'єкт на відповідь без тіла", async () => {
    respond(204);

    expect(await api("/leads/1", { method: "DELETE" })).toEqual({});
  });

  it("передає текст помилки й поля із сервера", async () => {
    respond(400, { error: "Невірні дані", fields: { phone: "Некоректний" } });

    const error = await api("/leads").catch((caught) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: "Невірні дані", status: 400, fields: { phone: "Некоректний" } });
  });

  it("має запасний текст, якщо сервер його не надіслав", async () => {
    fetchMock.mockResolvedValue(new Response("<html>", { status: 502 }));

    await expect(api("/news")).rejects.toMatchObject({ message: "Щось пішло не так", status: 502 });
  });

  it("повідомляє про відсутність зв'язку", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(api("/news")).rejects.toMatchObject({ message: "Немає зв'язку із сервером", status: 0 });
  });
});
