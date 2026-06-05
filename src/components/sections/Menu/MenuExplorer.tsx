"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { useMenuStore } from "@/store/useMenuStore";
import { MenuCard } from "./MenuCard";
import MotionWrapper from "@/components/ui/MotionWrapper";
import { getMenuItems, getCategories } from "@/lib/api/menu";

import {
  UtensilsCrossed,
  Cake,
  Coffee,
  Globe,
  ChefHat,
  Wine,
} from "lucide-react";
import { MenuCategory, MenuItem } from "@/types/menu.types";

// Fallback icon for API categories
const DEFAULT_ICON = UtensilsCrossed;

// Map category names to icons
const CATEGORY_ICONS: Record<string, typeof UtensilsCrossed> = {
  all: UtensilsCrossed,
  "Rice Dishes": ChefHat,
  "Soups & Swallow": Globe,
  Grills: Coffee,
  Drinks: Wine,
  Desserts: Cake,
};

export function MenuExplorer() {
  const [showFilters, setShowFilters] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { activeCategory, searchQuery, setActiveCategory, setSearchQuery } =
    useMenuStore();

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.success) setCategories(res.data.categories);
      })
      .catch(() => setError("Failed to load categories"));
  }, []);

  // Fetch items when category or search changes
  useEffect(() => {
    setLoading(true);
    setError("");

    const params: Parameters<typeof getMenuItems>[0] = {
      isAvailable: true,
    };

    if (activeCategory !== "all") params.categoryId = activeCategory;
    if (searchQuery.trim()) params.search = searchQuery.trim();

    getMenuItems(params)
      .then((res) => {
        if (res.success) setItems(res.data.items);
        else setError("Failed to load menu");
      })
      .catch(() => setError("Failed to load menu"))
      .finally(() => setLoading(false));
  }, [activeCategory, searchQuery]);

  // Group items by category name for display
  const groupedItems = items.reduce(
    (acc, item) => {
      const categoryName = item.category?.name ?? "Other";
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>,
  );

  return (
    <>
      {/* Sticky Search + Filter Bar */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-4 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes, ingredients, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {/* All tab */}
              <button
                onClick={() => setActiveCategory("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === "all"
                    ? "bg-yellow-500 text-black shadow-md scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                All
              </button>

              {/* Dynamic categories from API */}
              {categories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.name] ?? DEFAULT_ICON;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat.id
                        ? "bg-yellow-500 text-black shadow-md scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:border-yellow-400 transition"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-3">
                {["Spicy", "Vegetarian", "Popular", "Gluten-Free"].map(
                  (filter) => (
                    <button
                      key={filter}
                      className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full hover:border-yellow-400 transition"
                    >
                      {filter}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-16 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">{error}</p>
              <button
                onClick={() => setActiveCategory("all")}
                className="mt-4 text-yellow-600 hover:text-yellow-700 font-semibold"
              >
                Try again
              </button>
            </div>
          )}

          {/* Items */}
          {!loading &&
            !error &&
            Object.entries(groupedItems).map(([category, catItems]) => (
              <div key={category} className="mb-16 last:mb-0">
                <MotionWrapper variant="fade-left" className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 inline-block border-l-4 border-yellow-500 pl-4">
                    {category}
                  </h2>
                  <p className="text-gray-500 mt-2 ml-4">
                    {catItems.length} {catItems.length === 1 ? "item" : "items"}
                  </p>
                </MotionWrapper>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catItems.map((item, idx) => (
                    <MenuCard key={item.id} item={item} index={idx} />
                  ))}
                </div>
              </div>
            ))}

          {/* Empty state */}
          {!loading && !error && items.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                No dishes found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 text-yellow-600 hover:text-yellow-700 font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
