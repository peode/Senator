import { describe, expect, it } from "vitest";
import { mapPointer, mapTooltipStyle, mapZoneClass } from "./mapClasses";

const size = { width: 100, height: 100 };

it("mapPointer рахує координати відносно елемента", () => {
  const element = { getBoundingClientRect: () => ({ left: 10, top: 20, ...size }) };

  expect(mapPointer({ clientX: 40, clientY: 70 }, element)).toEqual({ x: 30, y: 50, ...size });
});

describe("mapTooltipStyle", () => {
  it("відкриває підказку вправо й донизу у верхньому лівому куті", () => {
    expect(mapTooltipStyle({ x: 10, y: 10, ...size }).transform).toBe("translate(18px, 18px)");
  });

  it("відкриває підказку вліво й догори в нижньому правому куті", () => {
    expect(mapTooltipStyle({ x: 90, y: 90, ...size }).transform).toBe(
      "translate(calc(-100% - 18px), calc(-100% - 18px))",
    );
  });
});

describe("mapZoneClass", () => {
  it("вимикає вказівник у неактивної зони", () => {
    expect(mapZoneClass({ disabled: true })).toContain("pointer-events-none");
    expect(mapZoneClass({})).not.toContain("pointer-events-none");
  });

  it("показує звичайний курсор на зоні, яку не можна натиснути", () => {
    expect(mapZoneClass({ clickable: false })).toContain("cursor-default");
    expect(mapZoneClass({})).toContain("cursor-pointer");
  });

  it("підсвічує активну продану квартиру сірим, а не білим", () => {
    const classes = mapZoneClass({ active: true, sold: true }).split(" ");

    expect(classes).toContain("fill-slate-400/75");
    expect(classes).not.toContain("fill-white/50");
  });
});
