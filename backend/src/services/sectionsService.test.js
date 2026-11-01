import { describe, expect, it, vi } from "vitest";
import * as sectionsRepository from "../repositories/sectionsRepository.js";
import { listSections, updateSectionPlan } from "./sectionsService.js";

vi.mock("../repositories/sectionsRepository.js");

const updatedAt = new Date(1000);
const section = { id: 4, status: "SELLING", updatedAt, planWidth: 800, planHeight: 600, apartments: [] };

describe("listSections", () => {
  it("віддає адресу плану з версією замість службових полів", async () => {
    vi.mocked(sectionsRepository.findAll).mockResolvedValue([section]);

    const [result] = await listSections();

    expect(result.plan).toEqual({ src: "/api/sections/4/plan?v=1000", width: 800, height: 600 });
    expect(result).not.toHaveProperty("updatedAt");
    expect(result).not.toHaveProperty("planWidth");
  });

  it("не будує план для секції без зображення", async () => {
    vi.mocked(sectionsRepository.findAll).mockResolvedValue([{ ...section, planWidth: null, planHeight: null }]);

    const [result] = await listSections();

    expect(result.plan).toBeNull();
  });

  it("сортує квартири за номером, а не як рядки", async () => {
    const apartment = (id) => ({ id, sectionId: 4, units: [{ id: 1, apartmentId: id, floor: 1 }] });
    vi.mocked(sectionsRepository.findAll).mockResolvedValue([
      { ...section, apartments: [apartment("4-10"), apartment("4-2")] },
    ]);

    const [{ apartments }] = await listSections();

    expect(apartments.map(({ id }) => id)).toEqual(["4-2", "4-10"]);
    expect(apartments[0]).toEqual({ id: "4-2", units: [{ id: 1, floor: 1 }] });
  });
});

describe("updateSectionPlan", () => {
  it("декодує нове зображення плану", async () => {
    vi.mocked(sectionsRepository.updatePlan).mockResolvedValue(section);
    const image = `data:image/jpeg;base64,${Buffer.from("план").toString("base64")}`;

    await updateSectionPlan(4, { plan: { image, width: 800, height: 600 }, apartments: [] });

    const [, { plan }] = sectionsRepository.updatePlan.mock.calls[0];
    expect(plan.image.toString()).toBe("план");
  });

  it("лишає старе зображення, якщо нового немає", async () => {
    vi.mocked(sectionsRepository.updatePlan).mockClear().mockResolvedValue(section);

    await updateSectionPlan(4, { apartments: [] });

    expect(sectionsRepository.updatePlan).toHaveBeenCalledWith(4, { plan: undefined, apartments: [] });
  });
});
