"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Trash2,
  ArrowLeft,
  Star,
  Check,
} from "lucide-react";
import MotionWrapper from "@/components/ui/MotionWrapper";
import { allProducts } from "@/lib/data/shopData";
import { Product, WishlistItem } from "@/types/shop.types";
import { useCartStore } from "@/store/useCartStore";
import { useShopStore } from "@/store/useShopStore";

export function WishlistContent() {
  const [mounted, setMounted] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [cartAdded, setCartAdded] = useState<Record<string, boolean>>({});
  const [forceUpdate, setForceUpdate] = useState(0);

  const { addProduct, items, getTotalItems } = useCartStore();
  const { wishlist, removeFromWishlist } = useShopStore();

  // Force re-render when cart changes
  useEffect(() => {
    const handleCartUpdate = () => {
      setForceUpdate(prev => prev + 1);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    setWishlistItems([...wishlist]);

    const handleWishlistUpdate = () => {
      setWishlistItems([...wishlist]);
    };
    
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [wishlist]);

  const getProductDetails = (productId: string): Product | undefined => {
    return allProducts.find((p) => p.id === productId);
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleAddToCart = (product: Product) => {
    // Add product to cart
    addProduct(product);
    
    // Force multiple events to ensure navbar updates
    setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("storage"));
    }, 50);
    
    setCartAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setCartAdded((prev) => ({ ...prev, [product.id]: false })), 1500);
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const wishlistProducts = wishlistItems
    .map((item) => getProductDetails(item.productId))
    .filter((p): p is Product => p !== undefined);

  if (!mounted) {
    return (
      <section className="py-12 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-12 h-12 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-400 mb-6">Save your favorite items here!</p>
              <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition">
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} in your wishlist
                </p>
                <p className="text-sm text-green-600">
                  Cart has {getTotalItems()} items
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.map((product: Product, idx: number) => (
                  <MotionWrapper key={product.id} variant="fade-up" delay={idx * 100}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                      <div className="relative h-48 overflow-hidden">
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {product.discount && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
                          )}
                          <span className="font-bold text-yellow-600 text-lg">${product.price}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`flex-1 py-2 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
                              isInCart(product.id) || cartAdded[product.id]
                                ? "bg-green-500 text-white"
                                : "bg-yellow-500 hover:bg-yellow-400 text-black"
                            }`}
                          >
                            {cartAdded[product.id] || isInCart(product.id) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <ShoppingCart className="w-4 h-4" />
                            )}
                            {cartAdded[product.id]
                              ? "Added!"
                              : isInCart(product.id)
                              ? "In Cart"
                              : "Add to Cart"}
                          </button>
                          <button
                            onClick={() => handleRemove(product.id)}
                            className="px-3 py-2 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <div className="text-center pb-16">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" /> Continue Shopping
        </Link>
      </div>
    </>
  );
}