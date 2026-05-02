"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid3x3,
  List,
  Heart,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { allProducts, categories } from "@/lib/data/shopData";
import { ProductCard } from "./ProductCard";
import { DealsSection, WishlistSidebar } from ".";
import { useShopStore } from "@/store/useShopStore";
import { useCartStore } from "@/store/useCartStore";

export function ShopProducts() {
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    resetFilters,
    getActiveDeals,
    applyPromo,
  } = useShopStore();

  const { getTotalItems, addProduct, items } = useCartStore();
  const cartCount = getTotalItems();
  const deals = getActiveDeals();

  useEffect(() => {
    setMounted(true);
  }, []);

  const products = (() => {
    let filtered = allProducts;

    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (sortBy === "price-asc")
      return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      return [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === "rating")
      return [...filtered].sort((a, b) => b.rating - a.rating);
    return filtered;
  })();

  const handleApplyDeal = (code: string) => {
    applyPromo(code, 0);
  };

  return (
    <>
      {/* Deals Section */}
      {deals.length > 0 && (
        <DealsSection deals={deals} onApplyDeal={handleApplyDeal} />
      )}

      {/* Search + Filter Bar */}
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-yellow-500 text-black shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
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
                {mounted && cartCount > 0 && (
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
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:border-yellow-400 transition"
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {showFilters && (
            <MotionWrapper variant="fade-up" className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-6 items-end">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Price Range</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-24 px-2 py-1 border rounded-lg text-sm"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-24 px-2 py-1 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-36 px-2 py-1 border rounded-lg text-sm mt-1"
                  >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
                <button
                  onClick={resetFilters}
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
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </section>

      <WishlistSidebar
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        onAddToCart={addProduct}
      />
    </>
  );
}