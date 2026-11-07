import { create } from "zustand";

// comment — текст для автопідстановки в поле «Коментар» (напр. обрана квартира)
export const useLeadModalStore = create((set) => ({
  isOpen: false,
  comment: "",
  open: (comment = "") => set({ isOpen: true, comment }),
  close: () => set({ isOpen: false, comment: "" }),
}));
