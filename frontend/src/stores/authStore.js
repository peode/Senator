import { create } from "zustand";
import { api } from "@/lib/api";

export const useAuthStore = create((set) => ({
  // null — ще перевіряємо сесію на сервері
  loggedIn: null,

  checkSession: async () => {
    try {
      const { authenticated } = await api("/session");
      set({ loggedIn: authenticated });
    } catch {
      set({ loggedIn: false });
    }
  },

  login: async (password) => {
    await api("/session", { method: "POST", body: { password } });
    set({ loggedIn: true });
  },

  logout: async () => {
    await api("/session", { method: "DELETE" }).catch(() => {});
    set({ loggedIn: false });
  },
}));
