"use client";

import Header from "@/components/layout/Header";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// each slide has its own bg animation
const slides = [
  {
    image: "/assets/homeImg1.jpg",
    subtitle: "Hello, new friend",
    mainTitle: "Welcome Back",
    secondaryTitle: "to Tastyc",
    description:
      "Quaerat debitis, vel, sapiente dicta sequi labore porro pariatur harum expedita.",
    btn1: { text: "Reservation", href: "/reservation" },
    btn2: { text: "Open Menu", href: "/menu" },
    animation: "zoom-in",
  },
  {
    image: "/assets/homeImg2.jpg",
    subtitle: "Hello, new friend",
    mainTitle: "Reserve Your",
    secondaryTitle: "Table Today",
    description:
      "Quaerat debitis, vel, sapiente dicta sequi labore porro pariatur harum expedita.",
    btn1: { text: "Reservation", href: "/reservation" },
    btn2: { text: "Online Shop", href: "/shop" },
    animation: "zoom-out",
  },
  {
    image: "/assets/homeImg3.jpg",
    subtitle: "Hello, new friend",
    mainTitle: "Visit to Our",
    secondaryTitle: "Online Shop",
    description:
      "Quaerat debitis, vel, sapiente dicta sequi labore porro pariatur harum expedita.",
    btn1: { text: "Go To Shop", href: "/shop" },
    btn2: { text: "Open Menu", href: "/menu" },
    animation: "fade-up",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[activeSlide];

  function goNext() {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }

  function goPrev() {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }

  return (
    <>
      <style>{`
        /* background image animations */
        @keyframes zoomIn { from { transform: scale(1); } to { transform: scale(1.12); } }
        @keyframes zoomOut { from { transform: scale(1.12); } to { transform: scale(1); } }
        @keyframes bgFadeUp { from { transform: translateY(20px); opacity: 0.7; } to { transform: translateY(0px); opacity: 1; } }
        .anim-zoom-in  { animation: zoomIn   6s ease-in-out forwards; }
        .anim-zoom-out { animation: zoomOut  6s ease-in-out forwards; }
        .anim-fade-up  { animation: bgFadeUp 1.2s ease-out forwards; }

        /* content pieces animate in with a delay so bg plays first */
        @keyframes contentIn { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        .content-bar      { animation: contentIn 0.6s ease-out 0.4s both; }
        .content-title1   { animation: contentIn 0.6s ease-out 0.55s both; }
        .content-title2   { animation: contentIn 0.6s ease-out 0.7s both; }
        .content-desc     { animation: contentIn 0.6s ease-out 0.85s both; }
        .content-buttons  { animation: contentIn 0.6s ease-out 1s both; }
        .content-dots     { animation: contentIn 0.6s ease-out 1.1s both; }
      `}</style>

      <section className="relative w-full h-[85vh] md:h-screen overflow-hidden">
        {/* header on top */}
        <div className="absolute top-0 left-0 w-full z-20">
          <Header cartCount={cartCount} />
        </div>

        {/* background slides */}
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              key={`${i}-${activeSlide === i}`}
              className={`absolute inset-0 ${i === activeSlide ? `anim-${s.animation}` : ""}`}
              style={{
                backgroundImage: `linear-gradient(rgba(8, 31, 34, 0.25), rgba(8, 31, 34, 0.3)), url(${s.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        {/* content */}
        <div className="relative z-10 h-full flex items-center pt-20 md:pt-0">
          <div
            key={`content-${activeSlide}`}
            className="w-full max-w-4xl px-5 sm:px-8 md:px-16 lg:px-20 text-white"
          >
            {/* yellow bar + subtitle */}
            <div className="content-bar flex items-center gap-3 mb-2">
              <span className="w-8 sm:w-12 h-1 bg-yellow-500 inline-block flex-shrink-0"></span>
              <p className="text-sm sm:text-lg md:text-2xl lg:text-3xl py-2 md:py-4 tracking-wide leading-tight">
                {slide.subtitle}
              </p>
            </div>

            {/* title line 1 */}
            <h1 className="content-title1 text-[10vw] sm:text-6xl md:text-8xl lg:text-[100px] font-serif font-extrabold leading-[1.05] tracking-tight whitespace-nowrap">
              {slide.mainTitle}
            </h1>

            {/* title line 2 */}
            <h2 className="content-title2 mt-1 text-[10vw] sm:text-6xl md:text-8xl lg:text-[100px] font-serif font-extrabold leading-[1.05] tracking-tight whitespace-nowrap">
              {slide.secondaryTitle}
            </h2>

            {/* description */}
            <p className="content-desc mt-3 md:mt-6 text-sm sm:text-base md:text-xl text-gray-200 max-w-sm sm:max-w-lg leading-relaxed">
              {slide.description}
            </p>

            {/* buttons */}
            <div className="content-buttons mt-4 md:mt-6 flex flex-wrap gap-3">
              <Link
                href={slide.btn1.href}
                className="px-7 py-3 md:px-9 md:py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-md transition text-sm md:text-lg"
              >
                {slide.btn1.text}
              </Link>
              <Link
                href={slide.btn2.href}
                className="px-7 py-3 md:px-9 md:py-4 border border-white hover:bg-white hover:text-black rounded-md transition text-sm md:text-lg"
              >
                {slide.btn2.text}
              </Link>
            </div>

            {/* dots */}
            <div className="content-dots mt-4 md:mt-6 flex gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`rounded-full transition-all duration-300 border-2 border-white w-3.5 h-3.5 md:w-4 md:h-4 ${
                    i === activeSlide
                      ? "border-yellow-500 scale-125"
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* arrows bottom right (moved up on desktop) */}
        <div className="absolute bottom-5 right-5 md:bottom-16 md:right-8 flex gap-3 z-10">
          <button
            onClick={goPrev}
            className="text-white hover:text-yellow-500 transition"
          >
            <ArrowRight className="rotate-180" size={26} />
          </button>
          <button
            onClick={goNext}
            className="text-white hover:text-yellow-500 transition"
          >
            <ArrowRight size={26} />
          </button>
        </div>
      </section>
    </>
  );
}
