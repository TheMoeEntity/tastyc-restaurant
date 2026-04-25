// src/app/shop/wishlist/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Trash2,
  ArrowLeft,
  Star,
  Check,
} from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import { allProducts } from "@/lib/data/shopData";
import { Product, WishlistItem } from "@/types/shop.types";
import {
  getWishlist,
  removeFromWishlist,
  addToCart,
} from "@/lib/utils/shopUtils";
import Image from "next/image";

export default function ShopWishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [cartAdded, setCartAdded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadWishlist = () => setWishlistItems(getWishlist());
    loadWishlist();

    const handleWishlistUpdate = () => loadWishlist();
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () =>
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, []);

  const getProductDetails = (productId: string): Product | undefined => {
    return allProducts.find((p) => p.id === productId);
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setCartAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(
      () => setCartAdded((prev) => ({ ...prev, [product.id]: false })),
      1500,
    );
  };

  const wishlistProducts = wishlistItems
    .map((item) => getProductDetails(item.productId))
    .filter((p): p is Product => p !== undefined);

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-6 md:px-16 lg:px-20 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <MotionWrapper variant="fade-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                Saved Items
              </p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900 leading-tight mb-4">
              My <span className="text-yellow-500">Wishlist</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1 ? "item" : "items"} saved for later
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="px-6 md:px-16 lg:px-20 py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-yellow-500">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-yellow-500">
              Shop
            </Link>
            <span>/</span>
            <span className="text-yellow-600">Wishlist</span>
          </div>
        </div>
      </div>

      {/* Wishlist Content */}
      <section className="py-12 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-12 h-12 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-400 mb-6">
                Save your favorite items here!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product: Product, idx: number) => (
                <MotionWrapper
                  key={product.id}
                  variant="fade-up"
                  delay={idx * 100}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        fill
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {product.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-semibold">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            ${product.originalPrice}
                          </span>
                        )}
                        <span className="font-bold text-yellow-600 text-lg">
                          ${product.price}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition flex items-center justify-center gap-2"
                        >
                          {cartAdded[product.id] ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                          {cartAdded[product.id] ? "Added" : "Add to Cart"}
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
          )}
        </div>
      </section>

      {/* Back to Shop */}
      <div className="text-center pb-16">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </main>
  );
}
