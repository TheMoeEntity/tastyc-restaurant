// src/types/index.ts
// Single source of truth for all types across the app.

import { LucideIcon } from "lucide-react";
import React from "react";

// NAVIGATION

export interface NavLink {
  name: string;
  href: string;
}

// ANIMATION

export type AnimationVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-in";

export interface CartItem {
  id: string; // composite: menuItemId or menuItemId-variantId
  menuItemId: string; // ← add this
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  variantId?: string;
  variantName?: string;
  spicy?: boolean;
  veg?: boolean;
  popular?: boolean;
}

export interface MotionWrapperProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

// HEADER

export interface HeaderProps {
  cartCount?: number;
}

// MENU

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  tags: string[];
  spicy?: boolean;
  popular?: boolean;
  veg?: boolean;
  glutenFree?: boolean;
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: LucideIcon;
}

// SHOP

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  tags: string[];
  spicy?: boolean;
  popular?: boolean;
  veg?: boolean;
  glutenFree?: boolean;
  image: string;
  rating: number;
  reviewCount: number;
  menuItemId: string
  inStock: boolean;
  isNew?: boolean;
  discount?: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  discount: number;
  code: string;
  validUntil: string;
  image: string;
  minOrder?: number;
}

export type SortOption = "default" | "price-asc" | "price-desc" | "rating";

export type ViewMode = "grid" | "list";

// CART

// Single CartItem shape used everywhere — menu page, shop page, and cart page.
// When adding a MenuItem, map it to this shape.
// When adding a Product, map it to this shape.
export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  spicy?: boolean;
  popular?: boolean;
  veg?: boolean;
}

// PROMO

export interface AppliedPromo {
  code: string;
  discount: number;
  minOrder?: number;
  appliedAt: string;
}

// ORDERS

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type OrderType = "dine-in" | "takeout" | "delivery";

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  status: OrderStatus;
  orderType: OrderType;
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

// PlaceOrderPayload is what the cart page sends — no id/orderNumber/date/time
// those are generated inside the store
export type PlaceOrderPayload = Omit<
  Order,
  "id" | "orderNumber" | "date" | "time"
>;
