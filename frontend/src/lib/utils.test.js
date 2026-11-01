import { afterEach, expect, it, vi } from "vitest";
import { cn, scrollMotion } from "./utils";

afterEach(() => vi.unstubAllGlobals());

it("cn лишає останній із конфліктних класів Tailwind", () => {
  expect(cn("p-2", false, "p-4")).toBe("p-4");
});

it.each([
  [true, "auto"],
  [false, "smooth"],
])("scrollMotion враховує зменшення руху: %s", (matches, expected) => {
  vi.stubGlobal("window", { matchMedia: () => ({ matches }) });

  expect(scrollMotion()).toBe(expected);
});
