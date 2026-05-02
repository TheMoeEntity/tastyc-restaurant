"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { categories, menuItems } from "@/lib/utils/menuUtils";
import { useMenuStore } from "@/store/useMenuStore";
import { MenuCard } from "./MenuCard";
import MotionWrapper from "@/components/MotionWrapper";

export function MenuExplorer() {
  const [showFilters, setShowFilters] = useState(false);
  const { activeCategory, searchQuery, setActiveCategory, setSearchQuery } = useMenuStore();

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof menuItems>
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
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-yellow-500 text-black shadow-md scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
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
                {["Spicy", "Vegetarian", "Popular", "Gluten-Free"].map((filter) => (
                  <button
                    key={filter}
                    className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full hover:border-yellow-400 transition"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-16 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-16 last:mb-0">
              <MotionWrapper variant="fade-left" className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 inline-block border-l-4 border-yellow-500 pl-4">
                  {category}
                </h2>
                <p className="text-gray-500 mt-2 ml-4">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </MotionWrapper>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, idx) => (
                  <MenuCard key={item.id} item={item} index={idx} />
                ))}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No dishes found matching your criteria.</p>
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