import { create } from "zustand";

const defaults = { rooms: null, areaFrom: "", areaTo: "", budgetTo: "" };

export const useApartmentFiltersStore = create((set) => ({
  ...defaults,
  setFilters: (patch) => set(patch),
  resetFilters: () => set(defaults),
}));

export const hasActiveFilters = ({ rooms, areaFrom, areaTo, budgetTo }) =>
  rooms !== null || areaFrom !== "" || areaTo !== "" || budgetTo !== "";
