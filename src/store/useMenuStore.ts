// Handles menu page category and search state.
// NOT persisted — resets on every page load intentionally.

import { create } from "zustand";

interface MenuStore {
  activeCategory: string;
  searchQuery: string;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

export const useMenuStore = create<MenuStore>()((set) => ({
  activeCategory: "all",
  searchQuery: "",

  setActiveCategory: (category: string) => set({ activeCategory: category }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  reset: () => set({ activeCategory: "all", searchQuery: "" }),
}));