// Handles everything cart-related.
// Shared between menu page and shop page — one cart for the whole app.
// Persisted to localStorage via zustand persist middleware.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, MenuItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];

  // actions
  addMenuItem: (item: MenuItem) => void;
  addProduct: (product: Product) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;

  // computed helpers
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addMenuItem: (item: MenuItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          const cartItem: CartItem = {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: 1,
            category: item.category,
            image: item.image ?? "/assets/homeImg1.jpg",
            spicy: item.spicy,
            popular: item.popular,
            veg: item.veg,
          };
          return { items: [...state.items, cartItem] };
        });
        // Dispatch event after state update
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("cartUpdated"));
          window.dispatchEvent(new Event("storage"));
        }
      },

      addProduct: (product: Product) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          const cartItem: CartItem = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: 1,
            category: product.category,
            image: product.image,
            spicy: product.spicy,
            popular: product.popular,
            veg: product.veg,
          };
          return { items: [...state.items, cartItem] };
        });
        // Dispatch event after state update
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("cartUpdated"));
          window.dispatchEvent(new Event("storage"));
        }
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("cartUpdated"));
        }
      },

      increaseQty: (id: string) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("cartUpdated"));
        }
      },

      decreaseQty: (id: string) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;
          if (item.quantity === 1) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          };
        });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("cartUpdated"));
        }
      },

      clearCart: () => {
        set({ items: [] });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("cartUpdated"));
        }
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "tastyc-cart",
    }
  )
);