"use client";

import { ChefHat } from "lucide-react";
import MotionWrapper from "@/components/ui/MotionWrapper";

export function MenuHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(/assets/homeImg1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <MotionWrapper variant="fade-up">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <ChefHat className="w-4 h-4" />
                Since 2012
              </p>
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif text-white mb-6 leading-tight">
            Our <span className="text-yellow-500">Menu</span>
          </h1>
          <p className="text-gray-200 text-lg sm:text-xl max-w-2xl mx-auto">
            A culinary journey across continents — from West African classics to global
            favorites, crafted with passion and served with love.
          </p>
        </MotionWrapper>
      </div>
    </section>
  );
}