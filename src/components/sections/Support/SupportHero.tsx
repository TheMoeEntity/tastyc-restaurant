"use client";

import { LifeBuoy } from "lucide-react";
import MotionWrapper from "@/components/ui/MotionWrapper";

export function SupportHero() {
  return (
    <section className="relative py-16 md:py-20 lg:py-24 px-6 md:px-16 lg:px-20 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center opacity-20">
        <div className="w-80 h-80 md:w-96 md:h-96 bg-yellow-400/10 blur-[120px] rounded-full" />
      </div>
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <MotionWrapper variant="fade-up" duration={700}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-0.5 w-6 bg-yellow-500" />
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
              Help Center
            </p>
            <div className="h-0.5 w-6 bg-yellow-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-white leading-tight mb-6">
            How Can We <br />
            <span className="text-yellow-500">Help You Today?</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Find answers to common questions, get support, or contact our team for assistance.
          </p>
        </MotionWrapper>
      </div>
    </section>
  );
}