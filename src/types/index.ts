export interface Link {
  name: string;
  href: string;
}
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

export type HeaderProps = {
  cartCount?: number;
};
export type AnimationVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-in";

export interface MotionWrapperProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}
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
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
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
