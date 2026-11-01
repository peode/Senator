import { expect, it } from "vitest";
import { toImageData } from "./imageData.js";

it("toImageData відкидає префікс data URL і зберігає розміри", () => {
  const image = `data:image/jpeg;base64,${Buffer.from("фото").toString("base64")}`;

  const result = toImageData({ image, width: 100, height: 50 });

  expect(result.image.toString()).toBe("фото");
  expect(result).toMatchObject({ width: 100, height: 50 });
});
