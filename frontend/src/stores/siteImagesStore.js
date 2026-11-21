import { create } from "zustand";
import { api } from "@/lib/api";
import { defaultComplexMap, siteImageSlots } from "@/data/siteImages";

// Якщо сервер довго мовчить, показуємо стандартні картинки, а не порожні місця
const WAIT_LIMIT_MS = 3000;

export const useSiteImagesStore = create((set, get) => ({
  images: {},
  // до відповіді сервера картинок немає: інакше замінена картинка блимала б стандартною
  loaded: false,

  fetchImages: async () => {
    const timer = setTimeout(() => set({ loaded: true }), WAIT_LIMIT_MS);
    try {
      const images = await api("/images");
      set({ images: Object.fromEntries(images.map((image) => [image.key, image])), loaded: true });
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
