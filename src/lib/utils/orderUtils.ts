// app/utils/orderUtils.ts
export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
  spicy?: boolean;
  popular?: boolean;
  veg?: boolean;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";
  orderType: "dine-in" | "takeout" | "delivery";
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialInstructions?: string;
  deliveryAddress?: string;
  tableNumber?: string;
  promoCode?: string;
}

export const ORDERS_STORAGE_KEY = "restaurant_orders";

export const generateOrderNumber = (): string => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const day = String(new Date().getDate()).padStart(2, "0");
  const hours = String(new Date().getHours()).padStart(2, "0");
  const minutes = String(new Date().getMinutes()).padStart(2, "0");
  const seconds = String(new Date().getSeconds()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
};

export const saveOrder = (orderData: Omit<Order, "id" | "orderNumber" | "date" | "time">): Order => {
  const existingOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  const orders: Order[] = existingOrders ? JSON.parse(existingOrders) : [];
  
  const newOrder: Order = {
    ...orderData,
    id: Date.now().toString(),
    orderNumber: generateOrderNumber(),
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
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

export const updateOrderStatus = (orderId: string, status: Order["status"]): void => {
  const orders = getOrders();
  const updatedOrders = orders.map(order => 
    order.id === orderId ? { ...order, status } : order
  );
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ordersUpdated"));
  }
};

export const cancelOrder = (orderId: string): void => {
  updateOrderStatus(orderId, "cancelled");
};