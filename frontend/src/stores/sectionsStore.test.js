import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { useApartmentsStore } from "./apartmentsStore";
import { useSectionsStore } from "./sectionsStore";

vi.mock("@/lib/api");

const store = () => useSectionsStore.getState();

const section = (id, units = []) => ({ id, price: 1000, apartments: [{ id: `${id}-1`, units }] });

beforeEach(() => {
  vi.mocked(api).mockReset();
  useSectionsStore.setState({ sections: [], loading: true, error: false });
});

describe("fetchSections", () => {
  it("не дублює запит, поки перший триває", async () => {
    vi.mocked(api).mockResolvedValue([section(1)]);

    await Promise.all([store().fetchSections(), store().fetchSections()]);

    expect(api).toHaveBeenCalledTimes(1);
    expect(store()).toMatchObject({ loading: false, error: false });
  });

  it("показує помилку, лише якщо показати нічого", async () => {
    vi.mocked(api).mockRejectedValue(new Error("offline"));

    await store().fetchSections();
    expect(store().error).toBe(true);

    useSectionsStore.setState({ sections: [section(1)], error: false });
    await store().fetchSections();
    expect(store().error).toBe(false);
  });
});

describe("зміни в адмінці", () => {
  beforeEach(() => {
    useApartmentsStore.setState({ fetchApartments: vi.fn() });
  });

  it("updateSection замінює лише змінену секцію й оновлює квартири", async () => {
    useSectionsStore.setState({ sections: [section(1), section(2)] });
    vi.mocked(api).mockResolvedValue({ ...section(2), price: 1500 });

    await store().updateSection(2, { price: 1500 });

    expect(store().sections.map(({ price }) => price)).toEqual([1000, 1500]);
    expect(useApartmentsStore.getState().fetchApartments).toHaveBeenCalledWith({ force: true });
  });

  it("setUnitAvailable змінює лише потрібну квартиру", async () => {
    const units = [
      { id: 1, floor: 1, available: true },
      { id: 2, floor: 2, available: true },
    ];
    useSectionsStore.setState({ sections: [section(1, units)] });
    vi.mocked(api).mockResolvedValue({ id: 2, floor: 2, available: false });

    await store().setUnitAvailable(2, false);

    expect(api).toHaveBeenCalledWith("/apartments/2", { method: "PATCH", body: { available: false } });
    expect(store().sections[0].apartments[0].units.map(({ available }) => available)).toEqual([true, false]);
    expect(useApartmentsStore.getState().fetchApartments).toHaveBeenCalledWith({ force: true });
  });
});
