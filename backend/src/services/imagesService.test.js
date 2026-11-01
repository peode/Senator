import { expect, it, vi } from "vitest";
import * as imagesRepository from "../repositories/imagesRepository.js";
import { getImage, listImages } from "./imagesService.js";

vi.mock("../repositories/imagesRepository.js");

it("додає версію до адреси зображення", async () => {
  vi.mocked(imagesRepository.findAll).mockResolvedValue([
    { key: "hero", width: 800, height: 600, updatedAt: new Date(1000) },
  ]);

  expect(await listImages()).toEqual([{ key: "hero", src: "/api/images/hero?v=1000", width: 800, height: 600 }]);
});

it("повертає null для неіснуючого зображення", async () => {
  vi.mocked(imagesRepository.findImage).mockResolvedValue(null);

  expect(await getImage("hero")).toBeNull();
});
