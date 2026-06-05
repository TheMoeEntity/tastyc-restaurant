"use client";

import { ShoppingCart } from "lucide-react";
import MotionWrapper from "@/components/ui/MotionWrapper";

export function ShopHero() {
  return (
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
  );
}