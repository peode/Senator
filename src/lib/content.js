import { createStore } from "@/lib/store";
import { defaultNews } from "@/data/news";
import { defaultSocials } from "@/data/socials";

export const defaultSettings = {
  phone: "+38 (068) 003-00-33",
  address: "Чернівці, вул. Руська, 236Б",
  hours: "Пн - Пт: з 09:00 по 19:00\nСб: з 10:00 до 15:00",
  socials: defaultSocials,
};

export const newsStore = createStore("senator:news", defaultNews);
export const settingsStore = createStore("senator:settings", defaultSettings);

export const useNews = () => newsStore.useStore();

export const useSettings = () => {
  const settings = settingsStore.useStore();
  return { ...defaultSettings, ...settings, socials: { ...defaultSocials, ...settings.socials } };
};

export const phoneHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const formatDate = (iso) => {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
};
