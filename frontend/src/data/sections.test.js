import { expect, it } from "vitest";
import { formatPrice, leadComment, roomsLabel } from "./sections";

it("formatPrice округлює й розділяє тисячі", () => {
  expect(formatPrice(70560.4).replace(/\s/g, " ")).toBe("70 560");
});

it("roomsLabel підписує кількість кімнат", () => {
  expect(roomsLabel({ rooms: 2 })).toBe("2-кімнатна");
});

it("leadComment описує обрану квартиру", () => {
  expect(leadComment("4", 3, { rooms: 2, area: 54.5 })).toBe(
    "Секція №4, поверх 3, 2-кімнатна квартира, 54.5 м²",
  );
});
