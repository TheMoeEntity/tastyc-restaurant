// Handles all order state.
// placeOrder generates id, orderNumber, date, time then saves.
// Persisted to localStorage via zustand persist middleware.
// orderUtils.ts statusConfig and orderTypeConfig are still used in the UI
// components — we keep those pure config objects there.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order, OrderStatus, PlaceOrderPayload } from "@/types";
import { generateOrderNumber } from "@/lib/utils/orderUtils";

interface OrderStore {
  orders: Order[];

  placeOrder: (payload: PlaceOrderPayload) => Order;
  cancelOrder: (id: string) => void;
  updateStatus: (id: string, status: OrderStatus) => void;

  // filter helpers used on the orders page
  getByStatus: (status: OrderStatus | "all") => Order[];
  getByType: (type: Order["orderType"] | "all") => Order[];
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      placeOrder: (payload: PlaceOrderPayload): Order => {
        const now = new Date();
        const newOrder: Order = {
          ...payload,
          id: Date.now().toString(),
          orderNumber: generateOrderNumber(),
          date: now.toISOString().split("T")[0],
          time: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        // keep the custom event so OrdersPage can still react if needed
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("orderPlaced", { detail: newOrder })
          );
        }

        return newOrder;
      },

      cancelOrder: (id: string) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status: "cancelled" } : o
          ),
        }));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("ordersUpdated"));
        }
      },

      updateStatus: (id: string, status: OrderStatus) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        }));
      },

      getByStatus: (status) => {
        const { orders } = get();
        if (status === "all") return orders;
        return orders.filter((o) => o.status === status);
      },

      getByType: (type) => {
        const { orders } = get();
        if (type === "all") return orders;
        return orders.filter((o) => o.orderType === type);
      },
    }),
    {
      name: "tastyc-orders",
    }
  )
);