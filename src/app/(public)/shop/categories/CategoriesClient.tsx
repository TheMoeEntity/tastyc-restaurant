// src/app/shop/categories/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChefHat,
  Globe,
  Cake,
  Wine,
  Coffee,
  UtensilsCrossed,
  ArrowLeft,
  Search,
  Star,
} from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import { allProducts, categories } from "@/lib/data/shopData";
import { Product } from "@/types/shop.types";
import Image from "next/image";

// Category type
interface CategoryItem {
  name: string;
  slug: string;
  count: number;
}

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  African: Globe,
  Global: ChefHat,
  Desserts: Cake,
  Drinks: Wine,
  Appetizers: Coffee,
  All: UtensilsCrossed,
};

// Category background images - using different images
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
const categoryList: CategoryItem[] = categories.map((catName: string) => ({
  name: catName,
  slug: catName.toLowerCase(),
  count: allProducts.filter((p: Product) => p.category === catName).length,
}));

export default function ShopCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter categories based on search
  const filteredCategories: CategoryItem[] = categoryList.filter(
    (cat: CategoryItem) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-24 px-6 md:px-16 lg:px-20 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <MotionWrapper variant="fade-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                Shop by Category
              </p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-4">
              Browse Our <span className="text-yellow-500">Categories</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find exactly what you&#39;re looking for by exploring our product
              collections
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="px-6 md:px-16 lg:px-20 py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-yellow-500 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-yellow-500 transition">
              Shop
            </Link>
            <span>/</span>
            <span className="text-yellow-600">Categories</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <section className="py-8 px-6 md:px-16 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
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
              {filteredCategories.map((category: CategoryItem, idx: number) => {
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
                        {/* Background Image */}
                        <Image
                          fill
                          src={bgImage}
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Dark Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Content */}
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

      {/* Featured Products Preview */}
      <section className="py-16 px-6 md:px-16 lg:px-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                Popular Picks
              </p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900">
              Most Loved Products
            </h2>
            <p className="text-gray-500 mt-2">
              What our customers are buying right now
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allProducts.slice(0, 4).map((product: Product) => (
              <Link key={product.id} href="/shop" className="group">
                <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discount && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 group-hover:text-yellow-600 transition line-clamp-1 text-sm">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs text-gray-600">
                        {product.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-xs">
                          ${product.originalPrice}
                        </span>
                      )}
                      <span className="font-bold text-yellow-600">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Back to Shop Button */}
      <div className="text-center pb-16">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Products
        </Link>
      </div>
    </main>
  );
}
