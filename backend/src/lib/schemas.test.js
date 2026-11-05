import { describe, expect, it } from "vitest";
import {
  advantageSchema,
  apartmentFiltersSchema,
  complexMapSchema,
  idSchema,
  leadSchema,
  sectionPlanSchema,
  sectionSchema,
  settingsSchema,
  siteImageKeySchema,
  siteImageSchema,
  siteTextsSchema,
} from "./schemas.js";

const socials = { facebook: "", instagram: "", youtube: "" };
const settings = { phone: "+380501234567", address: "Руська, 236Б", hours: "9–18", socials };
const triangle = [[0, 0], [10, 0], [10, 10]];

describe("leadSchema", () => {
  const lead = { name: " Марія ", phone: "+38 (050) 123-45-67" };

  it("обрізає пробіли й перетворює порожній коментар на null", () => {
    expect(leadSchema.parse({ ...lead, comment: "   " })).toEqual({
      name: "Марія",
      phone: "+38 (050) 123-45-67",
      comment: null,
    });
  });

  it.each(["12345", "+38050123456789012", "телефон", "050-abc-45-67"])("відхиляє номер %s", (phone) => {
    expect(leadSchema.safeParse({ ...lead, phone }).success).toBe(false);
  });

  it("відхиляє порожнє ім'я", () => {
    expect(leadSchema.safeParse({ ...lead, name: "   " }).success).toBe(false);
  });
});

describe("sectionSchema", () => {
  it("вимагає ціну для секції у продажу", () => {
    const result = sectionSchema.safeParse({ status: "SELLING", price: null, floors: 9 });

    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toEqual(["price"]);
  });

  it("дозволяє секцію без ціни, якщо вона не продається", () => {
    expect(sectionSchema.safeParse({ status: "PLANNED", price: null, floors: 9 }).success).toBe(true);
  });

  it.each([0, 51, 1.5])("відхиляє %s поверхів", (floors) => {
    expect(sectionSchema.safeParse({ status: "SOLD", price: null, floors }).success).toBe(false);
  });
});

describe("advantageSchema", () => {
  const fields = { title: "Паркінг", text: "Підземний" };

  it("вимагає іконку на головній і фото на сторінці переваг", () => {
    expect(advantageSchema.safeParse({ ...fields, placement: "HOME", icon: "car" }).success).toBe(true);
    expect(advantageSchema.safeParse({ ...fields, placement: "HOME", image: "x" }).success).toBe(false);
    expect(advantageSchema.safeParse({ ...fields, placement: "PAGE", image: "x" }).success).toBe(true);
    expect(advantageSchema.safeParse({ ...fields, placement: "PAGE", icon: "car" }).success).toBe(false);
  });
});

describe("зображення плану", () => {
  const image = "data:image/jpeg;base64,AAAA";

  it("приймає лише JPEG у форматі data URL", () => {
    expect(siteImageSchema.safeParse({ image, width: 10, height: 10 }).success).toBe(true);
    expect(
      siteImageSchema.safeParse({ image: "data:image/png;base64,AAAA", width: 10, height: 10 }).success,
    ).toBe(false);
    expect(siteImageSchema.safeParse({ image: "https://a.b/c.jpg", width: 10, height: 10 }).success).toBe(false);
  });

  it("обмежує розміри", () => {
    expect(siteImageSchema.safeParse({ image, width: 0, height: 10 }).success).toBe(false);
    expect(siteImageSchema.safeParse({ image, width: 10_001, height: 10 }).success).toBe(false);
  });
});

describe("контури на планах", () => {
  const apartment = { id: "1-1", rooms: 2, area: 54.5, points: triangle };

  it("приймає план без нового зображення", () => {
    expect(sectionPlanSchema.safeParse({ apartments: [apartment] }).success).toBe(true);
  });

  it("вимагає щонайменше три точки", () => {
    const points = triangle.slice(0, 2);

    expect(sectionPlanSchema.safeParse({ apartments: [{ ...apartment, points }] }).success).toBe(false);
    expect(complexMapSchema.safeParse({ zones: [{ id: 1, points }] }).success).toBe(false);
  });

  it("відхиляє точку за межами плану", () => {
    const points = [...triangle, [10_001, 0]];

    expect(sectionPlanSchema.safeParse({ apartments: [{ ...apartment, points }] }).success).toBe(false);
  });

  it("вимагає мобільні контури для всіх квартир, якщо додається вертикальний план", () => {
    const image = "data:image/jpeg;base64,AAAA";
    const mobilePlan = { image, width: 400, height: 900 };

    expect(sectionPlanSchema.safeParse({ mobilePlan, apartments: [apartment] }).success).toBe(false);
    expect(
      sectionPlanSchema.safeParse({
        mobilePlan,
        apartments: [{ ...apartment, mobilePoints: triangle }],
      }).success,
    ).toBe(true);
  });
});

describe("siteImageKeySchema", () => {
  it("не приймає карту ЖК: вона зберігається разом із контурами", () => {
    expect(siteImageKeySchema.safeParse("hero").success).toBe(true);
    expect(siteImageKeySchema.safeParse("complexMap").success).toBe(false);
  });
});

describe("siteTextsSchema", () => {
  it("приймає null як скидання до стандартного тексту", () => {
    expect(siteTextsSchema.safeParse({ texts: { "hero.title": null } }).success).toBe(true);
  });

  it("відхиляє ключ із забороненими символами", () => {
    expect(siteTextsSchema.safeParse({ texts: { "hero title": "Текст" } }).success).toBe(false);
  });

  it("обмежує кількість текстів", () => {
    const texts = Object.fromEntries(Array.from({ length: 501 }, (_, index) => [`key${index}`, "Текст"]));

    expect(siteTextsSchema.safeParse({ texts }).success).toBe(false);
  });
});

describe("apartmentFiltersSchema", () => {
  it("перетворює рядки із query на числа", () => {
    expect(apartmentFiltersSchema.parse({ rooms: "2", areaFrom: "40.5", budgetTo: "90000" })).toEqual({
      rooms: 2,
      areaFrom: 40.5,
      budgetTo: 90000,
    });
  });

  it.each([{ rooms: "-1" }, { rooms: "1.5" }, { areaTo: "abc" }, { budgetTo: "-5" }])("відхиляє %j", (query) => {
    expect(apartmentFiltersSchema.safeParse(query).success).toBe(false);
  });
});

describe("settingsSchema", () => {
  it("приймає порожнє посилання й http(s)", () => {
    const result = settingsSchema.safeParse({
      ...settings,
      socials: { ...socials, facebook: "https://facebook.com/senator" },
    });

    expect(result.success).toBe(true);
  });

  it("відхиляє javascript: у посиланні, бо воно потрапляє в href", () => {
    const result = settingsSchema.safeParse({
      ...settings,
      socials: { ...socials, facebook: "javascript:alert(1)" },
    });

    expect(result.success).toBe(false);
  });
});

describe("idSchema", () => {
  it("перетворює параметр адреси на число", () => {
    expect(idSchema.parse("42")).toBe(42);
  });

  it.each(["0", "-1", "1.5", "abc", "2147483648"])("відхиляє %s", (id) => {
    expect(idSchema.safeParse(id).success).toBe(false);
  });
});
