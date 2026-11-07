import { create } from "zustand";

const defaults = { rooms: null, areaFrom: "", areaTo: "" };

export const useApartmentFiltersStore = create((set) => ({
  ...defaults,
  setFilters: (patch) => set(patch),
  resetFilters: () => set(defaults),
}));

export const hasActiveFilters = ({ rooms, areaFrom, areaTo }) =>
  rooms !== null || areaFrom !== "" || areaTo !== "";

export const matchesFilters = (apartment, { rooms, areaFrom, areaTo }) =>
  (rooms === null || apartment.rooms === rooms) &&
  (areaFrom === "" || apartment.area >= Number(areaFrom)) &&
  (areaTo === "" || apartment.area <= Number(areaTo));
