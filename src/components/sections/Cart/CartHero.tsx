"use client";

import { ShoppingCart } from "lucide-react";
import MotionWrapper from "@/components/ui/MotionWrapper";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

export function CartHero() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative h-[35vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.70), rgba(0,0,0,0.80)), url(/assets/homeImg2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10 text-center px-6">
        <MotionWrapper variant="fade-up">
          <div className="flex justify-center mb-3">
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {mounted ? totalItems : 0} {mounted && totalItems === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-white leading-tight">
            Your <span className="text-yellow-500">Order</span>
          </h1>
          <p className="text-white mt-3 text-base sm:text-lg">
            Review your selections before placing your order.
          </p>
        </MotionWrapper>
      </div>
    </section>
  );
}