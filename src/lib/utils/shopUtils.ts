import { Deal, Product, WishlistItem } from "@/types";

// app/utils/shopUtils.ts
export const WISHLIST_STORAGE_KEY = "restaurant_wishlist";
export const DEALS_STORAGE_KEY = "restaurant_deals";
export const ACTIVE_PROMO_KEY = "active_promo_code";

// Default deals
export const defaultDeals: Deal[] = [
  {
    id: "1",
    title: "First Order Special",
    description: "Get 10% off your first order",
    discount: 10,
    code: "FIRST10",
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/assets/homeImg1.jpg",
  },
  {
    id: "2",
    title: "Weekend Feast",
    description: "20% off on orders above $50",
    discount: 20,
    code: "WEEKEND20",
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/assets/homeImg2.jpg",
    minOrder: 50,
  },
  {
    id: "3",
    title: "African Specialties",
    description: "15% off all African dishes",
    discount: 15,
    code: "AFRICAN15",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/assets/homeImg3.jpg",
  },
];

// Wishlist functions
export const getWishlist = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
  return wishlist ? JSON.parse(wishlist) : [];
};

export const addToWishlist = (product: Product): void => {
  const wishlist = getWishlist();
  if (!wishlist.some((item) => item.productId === product.id)) {
    const newItem: WishlistItem = {
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      addedAt: new Date().toISOString(),
    };
    wishlist.unshift(newItem);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  }
};

export const removeFromWishlist = (productId: string): void => {
  const wishlist = getWishlist();
  const updated = wishlist.filter((item) => item.productId !== productId);
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("wishlistUpdated"));
  }
};

export const isInWishlist = (productId: string): boolean => {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.productId === productId);
};

// Cart functions
export const addToCart = (product: Product): void => {
  const existingCart = localStorage.getItem("cart");
  let cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      description: product.description,
      category: product.category,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

// Promo functions (shared with cart page)
export const saveAppliedPromo = (
  code: string,
  discount: number,
  minOrder?: number,
): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      ACTIVE_PROMO_KEY,
      JSON.stringify({
        code,
        discount,
        minOrder,
        appliedAt: new Date().toISOString(),
      }),
    );
    window.dispatchEvent(new Event("promoApplied"));
  }
};

export const getAppliedPromo = (): {
  code: string;
  discount: number;
  minOrder?: number;
} | null => {
  if (typeof window === "undefined") return null;
  const promo = localStorage.getItem(ACTIVE_PROMO_KEY);
  return promo ? JSON.parse(promo) : null;
};

export const clearAppliedPromo = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACTIVE_PROMO_KEY);
    window.dispatchEvent(new Event("promoCleared"));
  }
};

// Deals functions
export const getActiveDeals = (): Deal[] => {
  const deals = localStorage.getItem(DEALS_STORAGE_KEY);
  const allDeals: Deal[] = deals ? JSON.parse(deals) : defaultDeals;
  const now = new Date();
  return allDeals.filter((deal) => new Date(deal.validUntil) > now);
};

export const applyDealCode = (
  code: string,
  subtotal: number,
): { valid: boolean; discount: number; message: string } => {
  const deals = getActiveDeals();
  const deal = deals.find((d) => d.code.toUpperCase() === code.toUpperCase());

  if (!deal) {
    return { valid: false, discount: 0, message: "Invalid promo code" };
  }

  if (deal.minOrder && subtotal < deal.minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order of $${deal.minOrder} required`,
    };
  }

  const discount = (subtotal * deal.discount) / 100;
  return {
    valid: true,
    discount,
    message: `${deal.discount}% discount applied!`,
  };
};

const defaultDeals: Deal[] = [
  {
    id: "1",
    title: "First Order Special",
    description: "Get 10% off your first order",
    discount: 10,
    code: "FIRST10",
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/assets/homeImg1.jpg",
  },
  {
    id: "2",
    title: "Weekend Feast",
    description: "20% off on orders above $50",
    discount: 20,
    code: "WEEKEND20",
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/assets/homeImg2.jpg",
    minOrder: 50,
  },
  {
    id: "3",
    title: "African Specialties",
    description: "15% off all African dishes",
    discount: 15,
    code: "AFRICAN15",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    image: "/assets/homeImg3.jpg",
  },
];
