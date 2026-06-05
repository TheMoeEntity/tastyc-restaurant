export type BackendOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export type BackendOrderType = "DELIVERY" | "PICKUP" | "DINE_IN";

export interface BackendOrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  menuItem: { id: string; name: string; image?: string };
  variant?: { name: string } | null;
}

export interface BackendOrder {
  id: string;
  orderNumber: string;
  type: BackendOrderType;
  status: BackendOrderStatus;
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  tableNumber?: string | null;
  notes?: string | null;
  items: BackendOrderItem[];
  user?: { id: string; name: string; email: string; phone?: string } | null;
  payment?: { status: string; amount: number } | null;
}

export type KitchenOrderStatus = "CONFIRMED" | "PREPARING" | "READY";

export interface KitchenOrderItem {
  id: string;
  quantity: number;
  menuItem: { name: string };
  variant?: { name: string } | null;
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  type: BackendOrderType;
  status: KitchenOrderStatus;
  tableNumber?: string | null;
  notes?: string | null;
  createdAt: string;
  items: KitchenOrderItem[];
  isNew?: boolean;
}

export interface UserOrderItem {
  id: string;
  quantity: number;
  menuItem: { id: string; name: string; image?: string };
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  type: string;
  status: BackendOrderStatus;
  total: number;
  createdAt: string;
  items: UserOrderItem[];
}

export type TrackingOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED";

export type TrackingOrderType = "DELIVERY" | "PICKUP";

export interface TrackingOrderItem {
  id: string;
  menuItem: { name: string; image?: string };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  spicy?: boolean;
  veg?: boolean;
}

export interface TrackingOrderData {
  id: string;
  orderNumber: string;
  type: TrackingOrderType;
  status: TrackingOrderStatus;
  items: TrackingOrderItem[];
  subtotal: number;
  deliveryFee?: number;
  tax?: number;
  total: number;
  estimatedTime?: string;
  address?: { street: string; city: string; state: string };
  notes?: string;
  createdAt: string;
}

export const ORDER_STATUS_COLORS: Record<BackendOrderStatus, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  CONFIRMED: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  PREPARING: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  READY: "text-green-400 bg-green-500/10 border-green-500/30",
  DELIVERED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  CANCELLED: "text-red-400 bg-red-500/10 border-red-500/30",
};

export const ALL_ORDER_STATUSES: BackendOrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED",
];

export const ALL_ORDER_TYPES: BackendOrderType[] = [
  "DELIVERY",
  "PICKUP",
  "DINE_IN",
];
