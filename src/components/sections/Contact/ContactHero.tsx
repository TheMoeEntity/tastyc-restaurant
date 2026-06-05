"use client";

import MotionWrapper from "@/components/ui/MotionWrapper";

export function ContactHero() {
  return (
    <section className="relative py-16 md:py-20 lg:py-24 px-6 md:px-16 lg:px-20 bg-white">
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center opacity-40">
        <div className="w-80 h-80 md:w-96 md:h-96 bg-yellow-400/10 blur-[120px] rounded-full" />
      </div>
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <MotionWrapper variant="fade-up" duration={700}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-0.5 w-6 bg-yellow-500" />
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
              Get in Touch
            </p>
            <div className="h-0.5 w-6 bg-yellow-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-6">
            Let&apos;s Talk <br />
            <span className="text-yellow-500">Over Good Food</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Whether you have a question, want to make a reservation, or just
            want to say hello — we&apos;d love to hear from you.
          </p>
        </MotionWrapper>
      </div>
    </section>
  );
}