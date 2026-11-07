import { create } from "zustand";
import { api } from "@/lib/api";
import { defaultSocials } from "@/data/socials";

// Показуємо до відповіді сервера і якщо API недоступне: контакти мають бути видно завжди
const defaultSettings = {
  phone: "+38 (068) 003-00-33",
  address: "Чернівці, вул. Руська, 236Б",
  hours: "Пн - Пт: з 09:00 по 19:00\nСб: з 10:00 до 15:00",
  socials: defaultSocials,
};

export const useSettingsStore = create((set) => ({
  settings: defaultSettings,
  loaded: false,
  error: false,

  fetchSettings: async () => {
    try {
      set({ settings: await api("/settings"), loaded: true, error: false });
    } catch {
      set({ error: true });
    }
  },

  saveSettings: async (draft) => {
    set({ settings: await api("/settings", { method: "PUT", body: draft }) });
  },
}));

export const useSettings = () => {
  const settings = useSettingsStore((state) => state.settings);
  // JSONB не зберігає порядок ключів, а порядок іконок соцмереж має бути сталим
  return { ...settings, socials: { ...defaultSocials, ...settings.socials } };
};
