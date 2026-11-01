import { expect, it, vi } from "vitest";
import * as settingsRepository from "../repositories/settingsRepository.js";
import { getSettings } from "./settingsService.js";

vi.mock("../repositories/settingsRepository.js");

it("прибирає службові поля", async () => {
  vi.mocked(settingsRepository.find).mockResolvedValue({ id: 1, updatedAt: new Date(), phone: "+380" });

  expect(await getSettings()).toEqual({ phone: "+380" });
});

it("повертає null, якщо налаштувань ще немає", async () => {
  vi.mocked(settingsRepository.find).mockResolvedValue(null);

  expect(await getSettings()).toBeNull();
});
