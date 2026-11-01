import { beforeEach, expect, it } from "vitest";
import { activeFiltersCount, hasActiveFilters, useApartmentFiltersStore } from "./apartmentFiltersStore";

const defaults = { rooms: null, areaFrom: "", areaTo: "", budgetTo: "" };

beforeEach(() => useApartmentFiltersStore.getState().resetFilters());

it("рахує лише заповнені фільтри", () => {
  expect(activeFiltersCount(defaults)).toBe(0);
  expect(activeFiltersCount({ ...defaults, rooms: 2, budgetTo: "90000" })).toBe(2);
});

it("вважає нуль кімнат активним фільтром", () => {
  expect(hasActiveFilters({ ...defaults, rooms: 0 })).toBe(true);
});

it("скидає фільтри до початкових", () => {
  const { setFilters, resetFilters } = useApartmentFiltersStore.getState();

  setFilters({ rooms: 3, areaFrom: "40" });
  expect(hasActiveFilters(useApartmentFiltersStore.getState())).toBe(true);

  resetFilters();
  expect(hasActiveFilters(useApartmentFiltersStore.getState())).toBe(false);
});
