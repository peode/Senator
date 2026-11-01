import { expect, it, vi } from "vitest";
import * as textsRepository from "../repositories/textsRepository.js";
import { saveTexts } from "./textsService.js";

vi.mock("../repositories/textsRepository.js");

it("зберігає заповнені тексти, а порожні скидає до стандартних", async () => {
  vi.mocked(textsRepository.findAll).mockResolvedValue([{ key: "hero.title", value: "Заголовок" }]);

  const texts = await saveTexts({ "hero.title": "Заголовок", "hero.text": "", "about.text": null });

  expect(textsRepository.save).toHaveBeenCalledWith([["hero.title", "Заголовок"]], ["hero.text", "about.text"]);
  expect(texts).toEqual({ "hero.title": "Заголовок" });
});
