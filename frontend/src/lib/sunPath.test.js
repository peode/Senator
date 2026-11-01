import { expect, it } from "vitest";
import { daylight, formatHour, sunDirection } from "./sunPath";

const june = new Date(2026, 5, 21);
const december = new Date(2026, 11, 21);

it("влітку опівдні сонце вище, ніж узимку", () => {
  const { sunrise, sunset } = daylight(june);
  const winter = daylight(december);
  const noon = (date, { sunrise, sunset }) => sunDirection((sunrise + sunset) / 2, date).up;

  expect(noon(june, { sunrise, sunset })).toBeGreaterThan(noon(december, winter));
});

it("влітку день довший за зимовий", () => {
  const length = ({ sunrise, sunset }) => sunset - sunrise;

  expect(length(daylight(june))).toBeGreaterThan(length(daylight(december)));
});

it("сонце сходить на сході й сідає на заході", () => {
  const { sunrise, sunset } = daylight(june);

  expect(sunDirection(sunrise, june).east).toBeGreaterThan(0);
  expect(sunDirection(sunset, june).east).toBeLessThan(0);
  expect(Math.abs(sunDirection(sunrise, june).up)).toBeLessThan(0.01);
});

it("опівдні сонце на півдні", () => {
  const { sunrise, sunset } = daylight(december);

  expect(sunDirection((sunrise + sunset) / 2, december).north).toBeLessThan(0);
});

it("formatHour показує години й хвилини", () => {
  expect(formatHour(7.5)).toBe("07:30");
  expect(formatHour(16.25)).toBe("16:15");
});
