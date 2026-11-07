import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultSocials } from "@/data/socials";

const STORAGE_KEY = "senator:settings";

export const defaultSettings = {
  phone: "+38 (068) 003-00-33",
  address: "Чернівці, вул. Руська, 236Б",
  hours: "Пн - Пт: з 09:00 по 19:00\nСб: з 10:00 до 15:00",
  socials: defaultSocials,
};

// Формат запису той самий, що й раніше (просто об'єкт налаштувань), щоб не втратити збережене
const storage = {
  getItem: (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? { state: { settings: JSON.parse(raw) } } : null;
    } catch {
      return null;
    }
  },
  setItem: (key, { state }) => {
    try {
      localStorage.setItem(key, JSON.stringify(state.settings));
    } catch {
      // сховище переповнене або недоступне — зміни діятимуть до перезавантаження
    }
  },
  removeItem: (key) => localStorage.removeItem(key),
};

// Дані зберігаються лише в браузері, де їх змінили;
// для спільних даних між відвідувачами потрібен сервер (API).
export const useSettingsStore = create(
  persist(
    (set) => ({
      settings: defaultSettings,
      setSettings: (settings) => set({ settings }),
    }),
    { name: STORAGE_KEY, storage },
  ),
);

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) useSettingsStore.persist.rehydrate();
});

export const useSettings = () => {
  const settings = useSettingsStore((state) => state.settings);
  return { ...defaultSettings, ...settings, socials: { ...defaultSocials, ...settings.socials } };
};
