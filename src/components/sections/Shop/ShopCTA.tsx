"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import MotionWrapper from "@/components/ui/MotionWrapper";

export function ShopCTA() {
  return (
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
  );
}