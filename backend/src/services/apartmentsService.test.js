import { beforeEach, describe, expect, it, vi } from "vitest";
import * as apartmentsRepository from "../repositories/apartmentsRepository.js";
import { listApartmentsForSale } from "./apartmentsService.js";

vi.mock("../repositories/apartmentsRepository.js");

const unit = (id, area, price = 1000) => ({
  id,
  floor: 3,
  available: true,
  apartmentId: "4-1",
  apartment: { id: "4-1", sectionId: 4, rooms: 2, area, section: { price } },
});

describe("listApartmentsForSale", () => {
  beforeEach(() => {
    vi.mocked(apartmentsRepository.findForSale).mockResolvedValue([unit(1, 50.4), unit(2, 80)]);
  });

  it("рахує повну вартість і прибирає зайві поля", async () => {
    const [first] = await listApartmentsForSale({});

    expect(first).toEqual({
      id: 1,
      apartmentId: "4-1",
      sectionId: 4,
      floor: 3,
      rooms: 2,
      area: 50.4,
      pricePerMeter: 1000,
      totalPrice: 50400,
    });
  });

  it("відсіює дорожчі за бюджет, а межу включає", async () => {
    const apartments = await listApartmentsForSale({ budgetTo: 50400 });

    expect(apartments.map(({ id }) => id)).toEqual([1]);
  });

  it("не передає бюджет у запит до бази", async () => {
    await listApartmentsForSale({ rooms: 2, areaFrom: 40, budgetTo: 1 });

    expect(apartmentsRepository.findForSale).toHaveBeenCalledWith({ rooms: 2, areaFrom: 40 });
  });
});
