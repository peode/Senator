import { expect, it, vi } from "vitest";
import * as newsRepository from "../repositories/newsRepository.js";
import { createArticle, getArticle } from "./newsService.js";

vi.mock("../repositories/newsRepository.js");

const row = {
  id: 1,
  title: "Новина",
  date: new Date("2026-10-15T00:00:00.000Z"),
  createdAt: new Date(),
  updatedAt: new Date(),
};

it("віддає дату без часу й без службових полів", async () => {
  vi.mocked(newsRepository.findById).mockResolvedValue(row);

  expect(await getArticle(1)).toEqual({ id: 1, title: "Новина", date: "2026-10-15" });
});

it("повертає null для неіснуючої новини", async () => {
  vi.mocked(newsRepository.findById).mockResolvedValue(null);

  expect(await getArticle(1)).toBeNull();
});

it("зберігає дату як північ за UTC", async () => {
  vi.mocked(newsRepository.create).mockResolvedValue(row);

  await createArticle({ title: "Новина", date: "2026-10-15" });

  expect(newsRepository.create).toHaveBeenCalledWith({
    title: "Новина",
    date: new Date("2026-10-15T00:00:00.000Z"),
  });
});
