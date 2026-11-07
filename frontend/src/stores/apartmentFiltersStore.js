import { create } from "zustand";

const defaults = { rooms: null, areaFrom: "", areaTo: "", budgetTo: "" };

export const useApartmentFiltersStore = create((set) => ({
  ...defaults,
  setFilters: (patch) => set(patch),
  resetFilters: () => set(defaults),
}));

export const activeFiltersCount = ({ rooms, areaFrom, areaTo, budgetTo }) =>
  [rooms !== null, areaFrom !== "", areaTo !== "", budgetTo !== ""].filter(Boolean).length;

export const hasActiveFilters = (filters) => activeFiltersCount(filters) > 0;
