"use client";

import Link from "next/link";
import MotionWrapper from "@/components/ui/MotionWrapper";

export function CategoriesHero() {
  return (
    <>
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
    </>
  );
}