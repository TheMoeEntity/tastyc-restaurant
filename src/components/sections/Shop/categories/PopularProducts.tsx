"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { allProducts } from "@/lib/data/shopData";
import { Product } from "@/types/shop.types";

export function PopularProducts() {
  return (
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
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
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
  );
}