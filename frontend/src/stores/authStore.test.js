import { beforeEach, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { useAuthStore } from "./authStore";

vi.mock("@/lib/api");

const store = () => useAuthStore.getState();

beforeEach(() => {
  vi.mocked(api).mockReset();
  useAuthStore.setState({ loggedIn: null });
});

it("бере стан сесії із сервера", async () => {
  vi.mocked(api).mockResolvedValue({ authenticated: true });

  await store().checkSession();

  expect(store().loggedIn).toBe(true);
});

it("вважає сесію неактивною, якщо сервер недоступний", async () => {
  vi.mocked(api).mockRejectedValue(new Error("offline"));

  await store().checkSession();

  expect(store().loggedIn).toBe(false);
});

it("лишає користувача невведеним при неправильному паролі", async () => {
  vi.mocked(api).mockRejectedValue(new Error("Невірний пароль"));

  await expect(store().login("wrong")).rejects.toThrow("Невірний пароль");
  expect(store().loggedIn).toBeNull();
});

it("виходить навіть без зв'язку із сервером", async () => {
  useAuthStore.setState({ loggedIn: true });
  vi.mocked(api).mockRejectedValue(new Error("offline"));

  await store().logout();

  expect(store().loggedIn).toBe(false);
});
