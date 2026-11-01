import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { useApartmentFiltersStore } from "./apartmentFiltersStore";
import { useApartmentsStore } from "./apartmentsStore";

vi.mock("@/lib/api");

const fetchApartments = (options) => useApartmentsStore.getState().fetchApartments(options);

const deferred = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

describe("fetchApartments", () => {
  beforeEach(async () => {
    vi.mocked(api).mockReset().mockResolvedValue([]);
    useApartmentFiltersStore.getState().resetFilters();
    // скидає запам'ятаний запит попереднього тесту
    await fetchApartments({ force: true });
    useApartmentsStore.setState({ apartments: [], loaded: false, error: false });
    vi.mocked(api).mockClear();
  });

  it("перетворює заповнені фільтри на query", async () => {
    useApartmentFiltersStore.getState().setFilters({ rooms: 2, budgetTo: "90000" });

    await fetchApartments();

    expect(api).toHaveBeenCalledWith("/apartments?rooms=2&budgetTo=90000");
  });

  it("не повторює однаковий запит без force", async () => {
    await fetchApartments();
    await fetchApartments({ force: true });

    expect(api).toHaveBeenCalledTimes(1);

    await fetchApartments();

    expect(api).toHaveBeenCalledTimes(1);
  });

  it("ігнорує відповідь на застарілий запит", async () => {
    const stale = deferred();
    vi.mocked(api).mockReturnValueOnce(stale.promise).mockResolvedValueOnce([{ id: 2 }]);

    useApartmentFiltersStore.getState().setFilters({ rooms: 1 });
    const first = fetchApartments();
    useApartmentFiltersStore.getState().setFilters({ rooms: 2 });
    await fetchApartments();
    stale.resolve([{ id: 1 }]);
    await first;

    expect(useApartmentsStore.getState().apartments).toEqual([{ id: 2 }]);
  });

  it("після помилки дозволяє повторити той самий запит", async () => {
    vi.mocked(api).mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce([{ id: 1 }]);
    useApartmentFiltersStore.getState().setFilters({ rooms: 3 });

    await fetchApartments();
    expect(useApartmentsStore.getState().error).toBe(true);

    await fetchApartments();
    expect(useApartmentsStore.getState()).toMatchObject({ apartments: [{ id: 1 }], loaded: true, error: false });
  });
});
