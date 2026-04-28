/* eslint-disable react-hooks/set-state-in-effect */
// src/app/shop/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Search,
  Filter,
  Grid3x3,
  List,
  Clock,
  Truck,
  ShieldCheck,
  Gift,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { allProducts, categories } from "@/lib/data/shopData";
import { Product, Deal } from "@/types/shop.types";
import {
  addToCart,
  saveAppliedPromo,
  getActiveDeals,
} from "@/lib/utils/shopUtils";
import Image from "next/image";
import {
  DealsSection,
  ProductCard,
  WishlistSidebar,
} from "@/components/sections/Shop";

// Storage keys (keep in component for component-specific state)
const WISHLIST_STORAGE_KEY = "restaurant_wishlist";
const ACTIVE_PROMO_KEY = "active_promo_code";

// Deal interface (using imported type)
type DealType = Deal;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [sortBy, setSortBy] = useState("default");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setDeals(getActiveDeals());
    const updateCartCount = () => {
      const cart = localStorage.getItem("cart");
      const items = cart ? JSON.parse(cart) : [];
      setCartCount(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      );
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  useEffect(() => {
    let filtered = allProducts;

    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc")
      filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);

    setProducts(filtered);
  }, [activeCategory, searchQuery, priceRange, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleApplyDeal = (
    code: string,
    discount: number,
    minOrder?: number,
  ) => {
    saveAppliedPromo(code, discount, minOrder);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(/assets/homeImg2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center px-6">
          <MotionWrapper variant="fade-up">
            <div className="flex justify-center mb-3">
              <div className="bg-yellow-500/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Shop Collection
                </p>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-white leading-tight">
              Our <span className="text-yellow-500">Shop</span>
            </h1>
            <p className="text-white mt-3 text-base sm:text-lg">
              Discover our curated collection of delicious dishes, from African
              classics to global favorites.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Deals Section */}
      {deals.length > 0 && (
        <DealsSection deals={deals} onApplyDeal={handleApplyDeal} />
      )}

      {/* Search & Filter Bar */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 py-4 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 transition"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat ? "bg-yellow-500 text-black shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowWishlist(true)}
                className="relative px-4 py-2 border border-gray-300 rounded-xl hover:border-red-400 transition flex items-center gap-2"
              >
                <Heart className="w-4 h-4" /> Wishlist
              </button>
              <Link
                href="/cart"
                className="relative px-4 py-2 border border-gray-300 rounded-xl hover:border-yellow-400 transition flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:border-yellow-400 transition"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="px-4 py-2 border border-gray-300 rounded-xl hover:border-yellow-400 transition"
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4" />
                ) : (
                  <Grid3x3 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {showFilters && (
            <MotionWrapper
              variant="fade-up"
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <div className="flex flex-wrap gap-6 items-end">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Price Range
                  </label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-24 px-2 py-1 border rounded-lg text-sm"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-24 px-2 py-1 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-36 px-2 py-1 border rounded-lg text-sm mt-1"
                  >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setPriceRange([0, 50]);
                    setSortBy("default");
                  }}
                  className="px-4 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                >
                  Reset Filters
                </button>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {["Spicy", "Vegetarian", "Popular"].map((filter) => (
                  <button
                    key={filter}
                    className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full hover:border-yellow-400 transition"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </MotionWrapper>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-500">Showing {products.length} products</p>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No products found matching your criteria.
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                text: "Free Delivery",
                subtext: "On orders over $50",
              },
              { icon: Clock, text: "30 Min Delivery", subtext: "Fast & Fresh" },
              {
                icon: ShieldCheck,
                text: "Secure Payment",
                subtext: "100% Safe",
              },
              { icon: Gift, text: "Rewards Program", subtext: "Earn points" },
            ].map(({ icon: Icon, text, subtext }, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">{text}</p>
                <p className="text-xs text-gray-400">{subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.88)), url(/assets/homeImg3.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <MotionWrapper variant="fade-up">
            <Sparkles className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-4">
              Ready to Order?
            </h2>
            <p className="text-gray-300 mb-8">
              Browse our menu and place your order for pickup or delivery.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/menu"
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
              >
                Full Menu
              </Link>
              <Link
                href="/cart"
                className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-xl transition"
              >
                View Cart
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Wishlist Sidebar */}
      <WishlistSidebar
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}
