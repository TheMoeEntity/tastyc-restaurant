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

  // computed helpers (functions so they always reflect current state)
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Add from the menu page — MenuItem shape
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
      },

      // Add from the shop page — Product shape
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
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      increaseQty: (id: string) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }));
      },

      // if qty is 1, remove the item entirely
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
      },

      clearCart: () => set({ items: [] }),

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
      name: "tastyc-cart", // localStorage key
    }
  )
);