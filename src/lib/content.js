import { useEffect, useState } from "react";
import { createStore } from "@/lib/store";
import { api } from "@/lib/api";
import { defaultSocials } from "@/data/socials";

export const defaultSettings = {
  phone: "+38 (068) 003-00-33",
  address: "Чернівці, вул. Руська, 236Б",
  hours: "Пн - Пт: з 09:00 по 19:00\nСб: з 10:00 до 15:00",
  socials: defaultSocials,
};

export const settingsStore = createStore("senator:settings", defaultSettings);

// Новини живуть у базі даних: беремо їх із сервера при кожному відкритті сторінки
export const useNews = () => {
  const [state, setState] = useState({ news: [], loading: true, error: false });

  useEffect(() => {
    let active = true;
    api("/news")
      .then((news) => active && setState({ news, loading: false, error: false }))
      .catch(() => active && setState({ news: [], loading: false, error: true }));
    return () => {
      active = false;
    };
  }, []);

  return state;
};

export const useSettings = () => {
  const settings = settingsStore.useStore();
  return { ...defaultSettings, ...settings, socials: { ...defaultSocials, ...settings.socials } };
};

export const phoneHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const formatDate = (iso) => {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
};
