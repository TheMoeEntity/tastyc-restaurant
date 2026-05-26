"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Star,
  Percent,
  Check,
  AlertCircle,
  Clock,
  Gift,
  ArrowLeft,
} from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import { allProducts } from "@/lib/data/shopData";
import { Product, Deal } from "@/types/shop.types";
import { useCartStore } from "@/store/useCartStore";
import { useShopStore } from "@/store/useShopStore";

const fallbackDeals: Deal[] = [
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

export function DealsContent() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<{ message: string; type: string } | null>(null);
  const [cartAdded, setCartAdded] = useState<Record<string, boolean>>({});

  const { addProduct, items } = useCartStore();
  const { getActiveDeals, applyPromo, addToWishlist, removeFromWishlist, isInWishlist } = useShopStore();

  // Get discounted products
  const discountedProducts = allProducts.filter((p: Product) => p.discount && p.discount > 0);
  
  // Get popular products
  const popularProducts = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 4);

  useEffect(() => {
    const activeDeals = getActiveDeals();
    setDeals(activeDeals.length > 0 ? activeDeals : fallbackDeals);
  }, [getActiveDeals]);

  const copyCode = async (code: string, discount: number, minOrder?: number) => {
    let success = false;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        success = true;
      }
    } catch (err) {
      // Clipboard API failed, fallback will be used
    }

    if (!success) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
    }

    if (success) {
      setCopiedCode(code);
      setShowToast({ message: `${code} copied! Use at checkout.`, type: "success" });
      setTimeout(() => {
        setCopiedCode(null);
        setShowToast(null);
      }, 3000);
      applyPromo(code, 0);
    } else {
      setShowToast({ message: `Please copy manually: ${code}`, type: "error" });
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  const handleAddToCart = (product: Product) => {
    addProduct(product);
    setCartAdded((prev) => ({ ...prev, [product.id]: true }));
    setShowToast({ message: `${product.name} added to cart!`, type: "success" });
    setTimeout(() => {
      setShowToast(null);
      setCartAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const isInCart = (productId: string) => items.some((item) => item.id === productId);

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce"
          style={{ backgroundColor: showToast.type === "success" ? "#22c55e" : "#ef4444", color: "white" }}
        >
          {showToast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {showToast.message}
        </div>
      )}

      {/* Stats Bar */}
      <div className="bg-yellow-500 py-3 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-8 text-sm text-black">
          <span className="font-semibold flex items-center gap-1"><Gift className="w-4 h-4" /> {deals.length} Active Deals</span>
          <span className="w-1 h-1 bg-black/30 rounded-full" />
          <span className="font-semibold flex items-center gap-1"><Percent className="w-4 h-4" /> Up to 20% OFF</span>
          <span className="w-1 h-1 bg-black/30 rounded-full" />
          <span className="font-semibold flex items-center gap-1"><Clock className="w-4 h-4" /> Limited Time Only</span>
        </div>
      </div>

      {/* Promo Codes Section */}
      {deals.length > 0 && (
        <section className="py-16 px-6 md:px-16 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-0.5 w-6 bg-yellow-500" />
                <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">Promo Codes</p>
                <div className="h-0.5 w-6 bg-yellow-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900">Active Promo Codes</h2>
              <p className="text-gray-500 mt-2">Copy and use at checkout</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deals.map((deal: Deal, idx: number) => (
                <MotionWrapper key={deal.id} variant="fade-up" delay={idx * 100}>
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100">
                    <div className="relative h-36 overflow-hidden">
                      <Image src={deal.image} alt={deal.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 right-3 bg-yellow-500 text-black text-sm font-bold px-2 py-1 rounded-full">{deal.discount}% OFF</div>
                      <div className="absolute bottom-3 left-4"><h3 className="text-white font-bold text-xl">{deal.title}</h3></div>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-600 text-sm mb-3">{deal.description}</p>
                      {deal.minOrder && <p className="text-xs text-gray-400 mb-3">Min. order: ${deal.minOrder}</p>}
                      <div className="flex items-center justify-between">
                        <div className="bg-gray-100 rounded-lg px-3 py-2">
                          <code className="font-mono font-bold text-gray-800 text-sm">{deal.code}</code>
                        </div>
                        <button onClick={() => copyCode(deal.code, deal.discount, deal.minOrder)} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold rounded-lg transition">
                          {copiedCode === deal.code ? "Copied! ✓" : "Copy Code"}
                        </button>
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Discounted Products + You Might Also Like (merged) */}
      <section className="py-16 px-6 md:px-16 lg:px-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Discounted Items */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-0.5 w-6 bg-yellow-500" />
                <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">Save Big</p>
                <div className="h-0.5 w-6 bg-yellow-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900">Discounted Items</h2>
              <p className="text-gray-500 mt-2">Grab these while stocks last</p>
            </div>

            {discountedProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Percent className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-400">No discounted items at the moment.</p>
                <p className="text-sm text-gray-400 mt-1">Check back soon for new deals!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {discountedProducts.map((product: Product, idx: number) => (
                  <MotionWrapper key={product.id} variant="fade-up" delay={idx * 50}>
                    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="relative h-52 overflow-hidden">
                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <Percent className="w-3 h-3" /> {product.discount}% OFF
                        </div>
                        <button onClick={() => handleWishlist(product)} className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/90 text-gray-600 hover:bg-yellow-500 hover:text-black">
                          <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-black text-black" : ""}`} />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">{product.category}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-800 group-hover:text-yellow-600 transition-colors line-clamp-1">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          {product.originalPrice && <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>}
                          <span className="font-bold text-yellow-600 text-xl">${product.price}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-2 line-clamp-2">{product.description}</p>
                        <button onClick={() => handleAddToCart(product)} className="w-full mt-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition flex items-center justify-center gap-2">
                          {cartAdded[product.id] || isInCart(product.id) ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                          {cartAdded[product.id] ? "Added!" : isInCart(product.id) ? "In Cart" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            )}
          </div>

          {/* You Might Also Like */}
          <div>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-0.5 w-6 bg-yellow-500" />
                <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">Customer Favorites</p>
                <div className="h-0.5 w-6 bg-yellow-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900">You Might Also Like</h2>
              <p className="text-gray-500 mt-2">Popular items our customers love</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularProducts.map((product: Product) => (
                <Link key={product.id} href="/shop" className="group">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                    <div className="relative h-36 overflow-hidden">
                      <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 group-hover:text-yellow-600 transition line-clamp-1 text-sm">{product.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs text-gray-600">{product.rating}</span>
                      </div>
                      <p className="font-bold text-yellow-600 text-sm mt-1">${product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Back to Shop Button */}
      <div className="text-center pb-16">
        <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-md hover:shadow-lg">
          <ArrowLeft className="w-4 h-4" /> Back to All Products
        </Link>
      </div>
    </>
  );
}