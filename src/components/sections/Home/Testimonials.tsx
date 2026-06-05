"use client";

import React, { useEffect, useRef, useState } from "react";
import MotionWrapper from "@/components/ui/MotionWrapper";
import Image from "next/image";
import { testimonials as testimonialData } from "@/lib/constants";

const CARDS_PER_PAGE = 3;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonialData.length;
  const totalPages = Math.ceil(total / CARDS_PER_PAGE);
  const currentPage = Math.floor(index / CARDS_PER_PAGE);

  // slide transition helper
  const goTo = (newIndex: number) => {
    setVisible(false);
    setTimeout(() => {
      setIndex(newIndex);
      setVisible(true);
    }, 300);
  };

  const next = () => goTo((index + CARDS_PER_PAGE) % total);
  const prev = () =>
    goTo(
      index - CARDS_PER_PAGE < 0
        ? total - CARDS_PER_PAGE
        : index - CARDS_PER_PAGE,
    );

  // auto-slide
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, index]);

  const visibleCards = [];
  for (let i = 0; i < CARDS_PER_PAGE; i++) {
    visibleCards.push(testimonialData[(index + i) % total]);
  }

  return (
    <>
      <style>{`
        .cards-wrap {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .cards-wrap.hidden-slide {
          opacity: 0;
          transform: translateX(30px);
        }
        .t-card {
          transition: transform 0.3s ease;
        }
        .t-card:hover {
          transform: translateY(-6px);
        }
      `}</style>

      <section className="py-24 px-4 -mt-24 sm:px-6 lg:px-12 bg-white">
        {/* HEADER */}
        <MotionWrapper
          variant="fade-up"
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-1 w-8 bg-yellow-500"></div>
            <h3 className="text-lg text-yellow-500 md:text-xl font-bold">
              Testimonials
            </h3>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-6">
            What Our Visitors Say
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Real experiences from our guests who enjoyed our meals and service.
          </p>
        </MotionWrapper>

        {/* CARDS */}
        <MotionWrapper
          variant="fade-up"
          delay={200}
          className="max-w-7xl mx-auto"
        >
          <div
            className={`cards-wrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 ${!visible ? "hidden-slide" : ""}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart === null) return;
              const diff = touchStart - e.changedTouches[0].clientX;
              if (diff > 50) next();
              if (diff < -50) prev();
              setTouchStart(null);
            }}
          >
            {visibleCards.map((t, i) => (
              <div
                key={i}
                className="t-card bg-white border border-gray-100 rounded-2xl p-8"
              >
                <h3 className="text-lg md:text-xl font-bold mb-4">{t.quote}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {t.review}
                </p>
                <div className="h-1 w-10 bg-yellow-500 mb-6"></div>
                <div className="flex relative items-center gap-4">
                  <Image
                    width={48}
                    height={48}
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-xs">{t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MotionWrapper>

        {/* CONTROLS */}
        <div className="relative z-10 flex items-center justify-between max-w-7xl mx-auto mt-10">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i * CARDS_PER_PAGE)}
                className={`h-2 rounded-full transition-all duration-300 touch-manipulation ${
                  i === currentPage ? "w-6 bg-yellow-500" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-yellow-500 text-yellow-500 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition touch-manipulation"
            >
              ←
            </button>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full bg-yellow-500 text-white flex items-center justify-center hover:bg-yellow-400 transition touch-manipulation"
            >
              →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
