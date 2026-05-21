// src/store/useShopStore.ts
// Handles wishlist, promo codes, deals, view mode, and shop filters.
// Persisted to localStorage via zustand persist middleware.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AppliedPromo,
  Deal,
  Product,
  SortOption,
  ViewMode,
  WishlistItem,
} from "@/types";
import { defaultDeals } from "@/lib/utils/shopUtils";

interface ShopStore {
  // wishlist
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // promo
  activePromo: AppliedPromo | null;
  applyPromo: (
    code: string,
    subtotal: number
  ) => { valid: boolean; message: string };
  clearPromo: () => void;

  // deals
  deals: Deal[];
  getActiveDeals: () => Deal[];

  // ui filters
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useShopStore = create<ShopStore>()(
  persist(
    (set, get) => ({
      // wishlist — initialize with empty array, hydration handled by persist middleware

      wishlist: [],

      addToWishlist: (product: Product) => {
        set((state) => {
          const alreadyIn = state.wishlist.some(
            (item) => item.productId === product.id
          );
          if (alreadyIn) return state;
          const newItem: WishlistItem = {
            id: Date.now().toString(),
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            addedAt: new Date().toISOString(),
          };
          return { wishlist: [newItem, ...state.wishlist] };
        });
      },

      removeFromWishlist: (productId: string) => {
        set((state) => ({
          wishlist: state.wishlist.filter(
            (item) => item.productId !== productId
          ),
        }));
      },

      isInWishlist: (productId: string) => {
        return get().wishlist.some((item) => item.productId === productId);
      },

      //  promo 

      activePromo: null,

      applyPromo: (code: string, subtotal: number) => {
        const deals = get().getActiveDeals();
        const deal = deals.find(
          (d) => d.code.toUpperCase() === code.toUpperCase()
        );

        if (!deal) {
          return { valid: false, message: "Invalid promo code. Try: FIRST10, WEEKEND20, AFRICAN15, or TASTYC10" };
        }

        if (deal.minOrder && subtotal < deal.minOrder) {
          return {
            valid: false,
            message: `Minimum order of $${deal.minOrder} required. Current subtotal: $${subtotal.toFixed(2)}`,
          };
        }

        const promo: AppliedPromo = {
          code: deal.code,
          discount: deal.discount,
          minOrder: deal.minOrder,
          appliedAt: new Date().toISOString(),
        };

        set({ activePromo: promo });
        return {
          valid: true,
          message: `${deal.discount}% discount applied!`,
        };
      },

      clearPromo: () => set({ activePromo: null }),

      //  deals 

      deals: defaultDeals,

      getActiveDeals: () => {
        const now = new Date();
        return get().deals.filter((deal) => new Date(deal.validUntil) > now);
      },

      // UI filters 

      viewMode: "grid",
      setViewMode: (mode) => set({ viewMode: mode }),

      priceRange: [0, 50],
      setPriceRange: (range) => set({ priceRange: range }),

      sortBy: "default",
      setSortBy: (sort) => set({ sortBy: sort }),

      activeCategory: "All",
      setActiveCategory: (category) => set({ activeCategory: category }),

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      resetFilters: () =>
        set({
          priceRange: [0, 50],
          sortBy: "default",
          activeCategory: "All",
          searchQuery: "",
        }),
    }),
    {
      name: "tastyc-shop",
      skipHydration: false,
      // only persist wishlist, promo and deals — not UI filters
      partialize: (state) => ({
        wishlist: state.wishlist,
        activePromo: state.activePromo,
        deals: state.deals,
      }),
    }
  )
);
