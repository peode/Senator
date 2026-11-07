import { useEffect } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { api } from "@/lib/api";

const CACHE_TTL_MS = 5 * 60 * 1000;

// Останній запит: новий запит скасовує результат попередніх, а однакові — об'єднуються
let lastRequest = null;

export const useNewsStore = create((set, get) => ({
  news: [],
  loading: true,
  error: false,
  fetchedAt: 0,

  // Помилку не кидає: стан завантаження живе в самому сторі
  fetchNews: ({ force = false } = {}) => {
    if (!force) {
      if (Date.now() - get().fetchedAt < CACHE_TTL_MS) return Promise.resolve();
      if (lastRequest) return lastRequest;
    }

    set({ loading: get().news.length === 0, error: false });

    const request = api("/news")
      .then((news) => {
        if (lastRequest === request) set({ news, loading: false, error: false, fetchedAt: Date.now() });
      })
      .catch(() => {
        // застарілий кеш краще за порожню сторінку
        if (lastRequest === request) set({ loading: false, error: get().news.length === 0 });
      })
      .finally(() => {
        if (lastRequest === request) lastRequest = null;
      });

    lastRequest = request;
    return request;
  },

  saveArticle: async ({ id, ...article }) => {
    await api(id ? `/news/${id}` : "/news", {
      method: id ? "PUT" : "POST",
      body: article,
    });
    await get().fetchNews({ force: true });
  },

  removeArticle: async (id) => {
    await api(`/news/${id}`, { method: "DELETE" });
    await get().fetchNews({ force: true });
  },
}));

export const useNews = () => {
  const fetchNews = useNewsStore((state) => state.fetchNews);
  const state = useNewsStore(
    useShallow(({ news, loading, error }) => ({ news, loading, error })),
  );

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return state;
};
