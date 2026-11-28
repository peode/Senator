import { create } from "zustand";
import { api } from "@/lib/api";
import { defaultComplexMap, siteImageSlots } from "@/data/siteImages";

// Перший екран не чекає на сервер довше за цей час: далі показуємо стандартні картинки
const WAIT_LIMIT_MS = 800;
const CACHE_KEY = "senator:site-images";

// Сховище може бути заблоковане браузером: тоді просто працюємо без кешу
const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY));
  } catch {
    return null;
  }
};

const writeCache = (images) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(images));
  } catch {
    // без кешу наступний візит лише трохи довше чекатиме на картинки
  }
};

const cachedImages = readCache();

export const useSiteImagesStore = create((set, get) => ({
  images: cachedImages ?? {},
  // до відповіді сервера картинок немає: інакше замінена картинка блимала б стандартною.
  // Хто вже був на сайті, одразу бачить збережені адреси
  loaded: cachedImages !== null,

  fetchImages: async () => {
    const timer = setTimeout(() => set({ loaded: true }), WAIT_LIMIT_MS);
    try {
      const images = Object.fromEntries((await api("/images")).map((image) => [image.key, image]));
      writeCache(images);
      set({ images, loaded: true });
    } catch {
      set({ loaded: true });
    } finally {
      clearTimeout(timer);
    }
  },

  saveImage: async (key, image) => {
    await api(`/images/${key}`, { method: "PUT", body: image });
    await get().fetchImages();
  },

  resetImage: async (key) => {
    await api(`/images/${key}`, { method: "DELETE" });
    await get().fetchImages();
  },
}));

// Повертає функцію: ключ місця на сайті -> адреса картинки
export const useSiteImage = () => {
  const images = useSiteImagesStore((state) => state.images);
  const loaded = useSiteImagesStore((state) => state.loaded);

  return (key) => (loaded ? (images[key]?.src ?? siteImageSlots[key].src) : undefined);
};

export const useComplexMap = () => {
  const map = useSiteImagesStore((state) => state.images.complexMap);
  const loaded = useSiteImagesStore((state) => state.loaded);

  return loaded ? (map ?? defaultComplexMap) : null;
};
