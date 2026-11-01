import { expect, it } from "vitest";
import { dateParts, formatDate, phoneHref } from "./content";

it("phoneHref лишає в номері лише цифри й плюс", () => {
  expect(phoneHref("+38 (050) 123-45-67")).toBe("tel:+380501234567");
});

it("formatDate переставляє дату в український порядок", () => {
  expect(formatDate("2026-10-05")).toBe("05.10.2026");
});

it("dateParts дає місяць у родовому відмінку", () => {
  expect(dateParts("2026-10-15")).toEqual({ day: "15", month: "жовтня", year: "2026" });
});
