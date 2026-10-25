import { useSyncExternalStore } from "react";

// Просте сховище в localStorage. Дані зберігаються лише в браузері, де їх змінили;
// для спільних даних між відвідувачами потрібен сервер (API).
export const createStore = (key, defaults) => {
  const listeners = new Set();

  const read = () => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaults;
    } catch {
      return defaults;
    }
  };

  let snapshot = read();

  const emit = () => listeners.forEach((listener) => listener());

  window.addEventListener("storage", (event) => {
    if (event.key === key) {
      snapshot = read();
      emit();
    }
  });

  const set = (value) => {
    snapshot = value;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // сховище переповнене або недоступне — зміни діятимуть до перезавантаження
    }
    emit();
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const useStore = () => useSyncExternalStore(subscribe, () => snapshot);

  return { useStore, get: () => snapshot, set, reset: () => set(defaults) };
};
