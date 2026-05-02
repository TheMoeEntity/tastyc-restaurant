"use client";

import { Receipt } from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";

export function OrdersHeader() {
  return (
    <section className="relative min-h-[30vh] sm:min-h-[35vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="relative z-10 text-center px-4 sm:px-6 py-12">
        <MotionWrapper variant="fade-up">
          <div className="flex justify-center mb-3">
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
              <p className="text-yellow-400 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-3 h-3 sm:w-4 sm:h-4" />
                Order Management
              </p>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-serif text-white leading-tight">
            Your <span className="text-yellow-500">Orders</span>
          </h1>
          <p className="text-gray-200 mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg max-w-md sm:max-w-none mx-auto px-4">
            Track and manage all your restaurant orders in one place.
          </p>
        </MotionWrapper>
      </div>
    </section>
  );
}