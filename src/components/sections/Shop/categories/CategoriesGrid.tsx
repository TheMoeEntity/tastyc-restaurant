"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChefHat,
  Globe,
  Cake,
  Wine,
  Coffee,
  UtensilsCrossed,
  Search,
  Star,
  ArrowLeft,
} from "lucide-react";
import MotionWrapper from "@/components/ui/MotionWrapper";
import { allProducts, categories } from "@/lib/data/shopData";
import { Product } from "@/types/shop.types";

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  African: Globe,
  Global: ChefHat,
  Desserts: Cake,
  Drinks: Wine,
  Appetizers: Coffee,
  All: UtensilsCrossed,
};

// Category background images
const categoryBgImages: Record<string, string> = {
  African: "/assets/homeImg2.jpg",
  Global: "/assets/homeImg3.jpg",
  Desserts: "/assets/homeImg1.jpg",
  Drinks: "/assets/homeImg2.jpg",
  Appetizers: "/assets/homeImg3.jpg",
  All: "/assets/homeImg1.jpg",
};

// Category descriptions
const categoryDescriptions: Record<string, string> = {
  African: "Explore the rich flavors of West and East African cuisine",
  Global: "International favorites from around the world",
  Desserts: "Sweet treats to satisfy your cravings",
  Drinks: "Refreshing beverages and cocktails",
  Appetizers: "Perfect starters for any meal",
  All: "Browse our complete collection",
};

// Category list with counts
const categoryList = categories.map((catName: string) => ({
  name: catName,
  slug: catName.toLowerCase(),
  count: allProducts.filter((p: Product) => p.category === catName).length,
}));

export function CategoriesGrid() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categoryList.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Search Bar */}
      <section className="py-8 px-6 md:px-16 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-400">No categories found.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, idx) => {
                const Icon = categoryIcons[category.name] || UtensilsCrossed;
                const bgImage =
                  categoryBgImages[category.name] || "/assets/homeImg1.jpg";

                return (
                  <MotionWrapper
                    key={category.slug}
                    variant="fade-up"
                    delay={idx * 100}
                  >
                    <Link
                      href={
                        category.name === "All"
                          ? "/shop"
                          : `/shop?category=${category.slug}`
                      }
                      className="group block"
                    >
                      <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-64">
                        <Image
                          fill
                          src={bgImage}
                          alt={category.name}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="relative h-full flex flex-col justify-end p-6 z-10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-yellow-500 transition-colors duration-300">
                              <Icon className="w-6 h-6 text-white group-hover:text-black transition-colors duration-300" />
                            </div>
                            <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                              <span className="text-white font-bold text-lg">
                                {category.count}
                              </span>
                              <span className="text-white/70 text-sm ml-1">
                                items
                              </span>
                            </div>
                          </div>
                          <h3 className="font-bold text-2xl text-white group-hover:text-yellow-400 transition-colors duration-300">
                            {category.name}
                          </h3>
                          <p className="text-white/80 text-sm mt-1 mb-3">
                            {categoryDescriptions[category.name]}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-white/20">
                            <div className="flex items-center gap-1 text-sm text-white/70">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              <span>Top rated</span>
                            </div>
                            <span className="text-yellow-400 font-medium group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-1">
                              Shop Now{" "}
                              <ArrowLeft className="w-4 h-4 rotate-180" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </MotionWrapper>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Back to Shop Button */}
      <div className="text-center pb-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Products
        </Link>
      </div>
    </>
  );
}