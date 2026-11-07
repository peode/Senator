import { useEffect } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { api } from "@/lib/api";
import { useApartmentsStore } from "@/stores/apartmentsStore";

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
