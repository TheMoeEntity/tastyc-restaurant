"use client";

import Link from "next/link";
import { ChevronRight, ShoppingCart } from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";

export function MenuCTA() {
  const stats = [
    { value: "30+", label: "Countries Inspired" },
    { value: "80+", label: "Menu Items" },
    { value: "15min", label: "Avg. Prep Time" },
    { value: "100%", label: "Fresh Ingredients" },
  ];

  return (
    <section className="relative py-24 px-6 md:px-16 lg:px-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.88)), url(/assets/homeImg3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <MotionWrapper variant="fade-up">
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-3">
            Ready to Order?
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white mb-5">
            Dine In, Take Out, or Delivery
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Whether you&apos;re craving our famous Jollof, a perfectly grilled steak, or a
            quiet dinner for two — we&apos;re here to serve you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/reservation"
              className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-lg hover:shadow-xl"
            >
              Book a Table <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-xl transition"
            >
              View Cart <ShoppingCart className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <p className="text-2xl font-black text-yellow-500">{stat.value}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}