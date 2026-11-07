import { useEffect } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { api } from "@/lib/api";
import { useApartmentFiltersStore } from "@/stores/apartmentFiltersStore";

const FILTER_DEBOUNCE_MS = 300;

const toQuery = ({ rooms, areaFrom, areaTo, budgetTo }) => {
  const params = Object.entries({ rooms, areaFrom, areaTo, budgetTo }).filter(
    ([, value]) => value !== null && value !== "",
  );
  return new URLSearchParams(params).toString();
};

// Останній запит: відповіді на попередні ігноруємо, однаковий не повторюємо
let lastQuery = null;

export const useApartmentsStore = create((set) => ({
  apartments: [],
  loaded: false,
  error: false,

  fetchApartments: async ({ force = false } = {}) => {
    const query = toQuery(useApartmentFiltersStore.getState());
    if (!force && query === lastQuery) return;
    lastQuery = query;

    try {
      const apartments = await api(`/apartments?${query}`);
      if (lastQuery === query) set({ apartments, loaded: true, error: false });
    } catch {
      if (lastQuery !== query) return;
      lastQuery = null;
      set({ error: true });
    }
  },
}));

// Квартири, що продаються й підходять під фільтри (фільтрує сервер)
export const useApartments = () => {
  const fetchApartments = useApartmentsStore((state) => state.fetchApartments);
  const query = useApartmentFiltersStore((state) => toQuery(state));
  const state = useApartmentsStore(
    useShallow(({ apartments, loaded, error }) => ({ apartments, loaded, error })),
  );

  useEffect(() => {
    const timer = setTimeout(fetchApartments, FILTER_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [fetchApartments, query]);

  return state;
};
