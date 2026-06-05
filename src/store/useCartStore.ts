import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";
import type { MenuItem } from "@/types/menu.types";
import apiFetch from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";

// ── API cart item shape ───────────────────────────────────────
interface ApiCartItem {
  menuItemId: string;
  variantId?: string;
  quantity: number;
  notes?: string;
  name: string;
  variantName?: string;
  unitPrice: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  syncing: boolean;
  addMenuItem: (
    item: MenuItem,
    variantId?: string,
    variantName?: string,
  ) => void;
  addProduct: (product: Product) => void;
  removeItem: (id: string, menuItemId?: string, variantId?: string) => void;
  increaseQty: (id: string, menuItemId?: string, variantId?: string) => void;
  decreaseQty: (id: string, menuItemId?: string, variantId?: string) => void;
  clearCart: () => void;
  syncFromApi: () => Promise<void>;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

// ── Convert API cart item → local CartItem ────────────────────
function apiItemToCartItem(item: ApiCartItem): CartItem {
  const cartId = item.variantId
    ? `${item.menuItemId}-${item.variantId}`
    : item.menuItemId;

  return {
    id: cartId,
    menuItemId: item.menuItemId,
    name: item.variantName ? `${item.name} (${item.variantName})` : item.name,
    description: "",
    price: item.unitPrice,
    quantity: item.quantity,
    category: "",
    image: item.image ?? "/assets/homeImg1.jpg",
    variantId: item.variantId,
    variantName: item.variantName,
  };
}

function isLoggedIn(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("tastyc_access_token");
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      // Initialize hydration on first call
      const hydrationStarted = typeof window !== "undefined";

      return {
        items: [],
        syncing: false,

        syncFromApi: async () => {
          if (!isLoggedIn()) return;
          try {
            set({ syncing: true });
            const json = await apiFetch<ApiResponse<{ items: ApiCartItem[] }>>(
              "/api/cart",
            );
            const apiItems: ApiCartItem[] = json.data.items;
            set({ items: apiItems.map(apiItemToCartItem) });
          } catch {
            // silently fail — keep local state
          } finally {
            set({ syncing: false });
          }
        },

        addMenuItem: (item, variantId, variantName) => {
          // Optimistic local update first — instant UI feedback
          set((state) => {
            const cartId = variantId ? `${item.id}-${variantId}` : item.id;
            const existing = state.items.find((i) => i.id === cartId);
            const variant = variantId
              ? item.variants?.find((v) => v.id === variantId)
              : null;
            const price = variant
              ? item.price + variant.priceDelta
              : item.price;

            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i,
                ),
              };
            }

            return {
              items: [
                ...state.items,
                {
                  id: cartId,
                  name: variantName
                    ? `${item.name} (${variantName})`
                    : item.name,
                  description: item.description ?? "",
                  price,
                  quantity: 1,
                  category: item.category?.name ?? "",
                  image: item.image ?? "/assets/homeImg1.jpg",
                  menuItemId: item.id,
                  variantId,
                  variantName,
                  spicy: item.tags.includes("spicy"),
                  veg:
                    item.tags.includes("vegan") ||
                    item.tags.includes("vegetarian"),
                },
              ],
            };
          });

          // Sync to API in background
          if (isLoggedIn()) {
            apiFetch("/api/cart/items", {
              method: "POST",
              data: {
                menuItemId: item.id,
                variantId,
                quantity: 1,
              },
            }).catch(console.error);
          }

          dispatchCartEvent();
        },

        addProduct: (product) => {
          set((state) => {
            const existing = state.items.find((i) => i.id === product.id);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
                ),
              };
            }
            return {
              items: [
                ...state.items,
                {
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  quantity: 1,
                  menuItemId: product.id,
                  category: product.category,
                  image: product.image,
                  spicy: product.spicy,
                  veg: product.veg,
                },
              ],
            };
          });
          dispatchCartEvent();
        },

        removeItem: (id, menuItemId, variantId) => {
          set((state) => ({
            items: state.items.filter((i) => i.id !== id),
          }));

          if (isLoggedIn() && menuItemId) {
            const query = variantId ? `?variantId=${variantId}` : "";
            apiFetch(`/api/cart/items/${menuItemId}${query}`, {
              method: "DELETE",
            }).catch(console.error);
          }

          dispatchCartEvent();
        },

        increaseQty: (id, menuItemId, variantId) => {
          const item = get().items.find((i) => i.id === id);
          if (!item) return;

          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          }));

          if (isLoggedIn() && menuItemId) {
            const query = variantId ? `?variantId=${variantId}` : "";
            apiFetch(`/api/cart/items/${menuItemId}${query}`, {
              method: "PATCH",
              data: { quantity: item.quantity + 1 },
            }).catch(console.error);
          }

          dispatchCartEvent();
        },

        decreaseQty: (id, menuItemId, variantId) => {
          const item = get().items.find((i) => i.id === id);
          if (!item) return;

          set((state) => {
            if (item.quantity === 1) {
              return { items: state.items.filter((i) => i.id !== id) };
            }
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
              ),
            };
          });

          if (isLoggedIn() && menuItemId) {
            const query = variantId ? `?variantId=${variantId}` : "";
            const newQty = item.quantity - 1;
            apiFetch(`/api/cart/items/${menuItemId}${query}`, {
              method: newQty === 0 ? "DELETE" : "PATCH",
              data: newQty > 0 ? { quantity: newQty } : undefined,
            }).catch(console.error);
          }

          dispatchCartEvent();
        },

        clearCart: () => {
          set({ items: [] });
          if (isLoggedIn()) {
            apiFetch("/api/cart", { method: "DELETE" }).catch(console.error);
          }
          dispatchCartEvent();
        },

        getTotalItems: () =>
          get().items.reduce((sum, item) => sum + item.quantity, 0),

        getSubtotal: () =>
          get().items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),
      };
    },
    {
      name: "tastyc-cart",
      skipHydration: false,
    },
  ),
);

function dispatchCartEvent() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage"));
  }
}
