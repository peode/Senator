import { useEffect } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { api } from "@/lib/api";
import { useApartmentsStore } from "@/stores/apartmentsStore";
import { useSiteImagesStore } from "@/stores/siteImagesStore";

let pendingRequest = null;

export const useSectionsStore = create((set, get) => ({
  sections: [],
  loading: true,
  error: false,

  // Помилку не кидає: стан завантаження живе в самому сторі
  fetchSections: () => {
    if (pendingRequest) return pendingRequest;

    pendingRequest = api("/sections")
      .then((sections) => set({ sections, loading: false, error: false }))
      .catch(() => set({ loading: false, error: get().sections.length === 0 }))
      .finally(() => {
        pendingRequest = null;
      });
    return pendingRequest;
  },

  updateSection: async (id, patch) => {
    const updated = await api(`/sections/${id}`, { method: "PATCH", body: patch });
    set({ sections: get().sections.map((section) => (section.id === id ? updated : section)) });
    // статус і ціна впливають на каталог квартир
    await useApartmentsStore.getState().fetchApartments({ force: true });
  },

  savePlan: async (id, plan) => {
    const updated = await api(`/sections/${id}/plan`, { method: "PUT", body: plan });
    set({ sections: get().sections.map((section) => (section.id === id ? updated : section)) });
    // квартири могли змінитися: каталог має це побачити
    await useApartmentsStore.getState().fetchApartments({ force: true });
    return updated;
  },

  saveMap: async (map) => {
    set({ sections: await api("/sections/map", { method: "PUT", body: map }) });
    await useSiteImagesStore.getState().fetchImages();
  },

  setUnitAvailable: async (unitId, available) => {
    const updated = await api(`/apartments/${unitId}`, { method: "PATCH", body: { available } });
    set({
      sections: get().sections.map((section) => ({
        ...section,
        apartments: section.apartments.map((apartment) => ({
          ...apartment,
          units: apartment.units.map((unit) => (unit.id === unitId ? updated : unit)),
        })),
      })),
    });
    await useApartmentsStore.getState().fetchApartments({ force: true });
  },
}));

export const useSections = () => {
  const fetchSections = useSectionsStore((state) => state.fetchSections);
  const state = useSectionsStore(
    useShallow(({ sections, loading, error }) => ({ sections, loading, error })),
  );

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  return state;
};
