import { create } from "zustand";
import { api } from "@/lib/api";
import { siteTextDefaults } from "@/data/sitePages";

// Якщо сервер довго мовчить, показуємо стандартні тексти, а не порожню сторінку
const WAIT_LIMIT_MS = 3000;

export const useSiteTextsStore = create((set) => ({
  texts: {},
  // до відповіді сервера текстів немає: інакше змінений текст блимав би стандартним
  loaded: false,

  fetchTexts: async () => {
    const timer = setTimeout(() => set({ loaded: true }), WAIT_LIMIT_MS);
    try {
      set({ texts: await api("/texts"), loaded: true });
    } catch {
      set({ loaded: true });
    } finally {
      clearTimeout(timer);
    }
  },

  saveTexts: async (texts) => {
    set({ texts: await api("/texts", { method: "PUT", body: { texts } }) });
  },
}));

// Повертає функцію: ключ тексту -> текст
export const useSiteText = () => {
  const texts = useSiteTextsStore((state) => state.texts);
  const loaded = useSiteTextsStore((state) => state.loaded);

  return (key) => (loaded ? (texts[key] ?? siteTextDefaults[key]) : "");
};
