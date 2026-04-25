// app/utils/orderUtils.ts

import { Order } from "@/types";
import {
  Clock,
  CheckCircle,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
  MapPin,
} from "lucide-react";
export const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    step: 0,
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    step: 1,
  },
  preparing: {
    label: "Preparing",
    icon: Package,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    step: 2,
  },
  ready: {
    label: "Ready",
    icon: ShoppingBag,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    step: 3,
  },
  delivered: {
    label: "Delivered",
    icon: Truck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    step: 4,
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    step: -1,
  },
};

export const orderTypeConfig = {
  "dine-in": {
    label: "Dine In",
    icon: MapPin,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  takeout: {
    label: "Takeout",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  delivery: {
    label: "Delivery",
    icon: Truck,
    color: "text-green-600",
    bg: "bg-green-50",
  },
};

export const ORDERS_STORAGE_KEY = "restaurant_orders";

export const generateOrderNumber = (): string => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const day = String(new Date().getDate()).padStart(2, "0");
  const hours = String(new Date().getHours()).padStart(2, "0");
  const minutes = String(new Date().getMinutes()).padStart(2, "0");
  const seconds = String(new Date().getSeconds()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
};

export const saveOrder = (
  orderData: Omit<Order, "id" | "orderNumber" | "date" | "time">,
): Order => {
  const existingOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  const orders: Order[] = existingOrders ? JSON.parse(existingOrders) : [];

  const newOrder: Order = {
    ...orderData,
    id: Date.now().toString(),
    orderNumber: generateOrderNumber(),
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };

  orders.unshift(newOrder);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("orderPlaced", { detail: newOrder }));
  }

  return newOrder;
};

export const getOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  const orders = localStorage.getItem(ORDERS_STORAGE_KEY);
  const parsedOrders = orders ? JSON.parse(orders) : [];
  return parsedOrders.sort((a: Order, b: Order) => {
    const dateTimeA = new Date(`${a.date} ${a.time}`).getTime();
    const dateTimeB = new Date(`${b.date} ${b.time}`).getTime();
    return dateTimeB - dateTimeA;
  });
};

export const updateOrderStatus = (
  orderId: string,
  status: Order["status"],
): void => {
  const orders = getOrders();
  const updatedOrders = orders.map((order) =>
    order.id === orderId ? { ...order, status } : order,
  );
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ordersUpdated"));
  }
};

export const cancelOrder = (orderId: string): void => {
  updateOrderStatus(orderId, "cancelled");
};
