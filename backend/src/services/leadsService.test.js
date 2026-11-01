import { expect, it, vi } from "vitest";
import * as leadsRepository from "../repositories/leadsRepository.js";
import { submitLead } from "./leadsService.js";
import { notifyNewLead } from "./telegramService.js";

vi.mock("../repositories/leadsRepository.js");
vi.mock("./telegramService.js");

const data = { name: "Марія", phone: "+380501234567", comment: null };

it("зберігає заявку без поля-приманки й надсилає сповіщення", async () => {
  const lead = { id: 1, ...data };
  vi.mocked(leadsRepository.create).mockResolvedValue(lead);

  await submitLead({ ...data, website: "" });

  expect(leadsRepository.create).toHaveBeenCalledWith(data);
  expect(notifyNewLead).toHaveBeenCalledWith(lead);
});

it("ігнорує заявку бота, який заповнив приманку", async () => {
  vi.clearAllMocks();

  await submitLead({ ...data, website: "spam.example" });

  expect(leadsRepository.create).not.toHaveBeenCalled();
  expect(notifyNewLead).not.toHaveBeenCalled();
});
