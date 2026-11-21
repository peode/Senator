import { useEffect } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { api } from "@/lib/api";

const CACHE_TTL_MS = 5 * 60 * 1000;

export const useAdvantagesStore = create((set, get) => ({
  advantages: [],
  loading: true,
  error: false,
  fetchedAt: 0,

  // Помилку не кидає: стан завантаження живе в самому сторі
  fetchAdvantages: async ({ force = false } = {}) => {
    if (!force && Date.now() - get().fetchedAt < CACHE_TTL_MS) return;

    set({ loading: get().advantages.length === 0, error: false });

    try {
      const advantages = await api("/advantages");
      set({ advantages, loading: false, fetchedAt: Date.now() });
    } catch {
      set({ loading: false, error: get().advantages.length === 0 });
    }
  },

  saveAdvantage: async ({ id, ...advantage }) => {
    await api(id ? `/advantages/${id}` : "/advantages", {
      method: id ? "PUT" : "POST",
      body: advantage,
    });
    await get().fetchAdvantages({ force: true });
  },

  removeAdvantage: async (id) => {
    await api(`/advantages/${id}`, { method: "DELETE" });
    await get().fetchAdvantages({ force: true });
  },

  reorderAdvantages: async (ids) => {
    await api("/advantages/order", { method: "PUT", body: { ids } });
    await get().fetchAdvantages({ force: true });
  },
}));

export const useAdvantages = (placement) => {
  const fetchAdvantages = useAdvantagesStore((state) => state.fetchAdvantages);
  const { advantages, loading, error } = useAdvantagesStore(
    useShallow(({ advantages, loading, error }) => ({ advantages, loading, error })),
  );

  useEffect(() => {
    fetchAdvantages();
  }, [fetchAdvantages]);

  return {
    advantages: advantages.filter((item) => item.placement === placement),
    loading,
    error,
  };
};
