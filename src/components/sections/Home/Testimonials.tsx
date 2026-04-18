"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const testimonials = [
  {
    quote: "I'm delighted!",
    review:
      "Everything about this place is amazing. The food came out hot, the portions were generous, and the staff made us feel right at home. We'll definitely be back soon.",
    name: "Viktoria Freeman",
    date: "02.02.21",
    image: "/assets/homeImg1.jpg",
  },
  {
    quote: "I will visit again.",
    review:
      "Honestly one of the best dining experiences I've had in a long time. The grilled chicken was perfectly seasoned and the atmosphere was so warm and cozy.",
    name: "Paul Trueman",
    date: "02.02.21",
    image: "/assets/homeImg2.jpg",
  },
  {
    quote: "The best restaurant!",
    review:
      "From the moment we walked in, we were treated like family. The pasta was rich, creamy, and absolutely to die for. This place sets the bar high.",
    name: "Oscar Oldman",
    date: "02.02.21",
    image: "/assets/homeImg3.jpg",
  },
  {
    quote: "It was very delicious!",
    review:
      "The flavors were bold and the presentation was beautiful. You can tell the chef puts real passion into every dish. A must-visit for any food lover.",
    name: "Emma Newman",
    date: "02.02.21",
    image: "/assets/homeImg1.jpg",
  },
  {
    quote: "Absolutely wonderful!",
    review:
      "We celebrated our anniversary here and it was perfect. The candle-lit setting, the wine, the dessert — everything was just right. Thank you for the memories.",
    name: "James Carter",
    date: "02.02.21",
    image: "/assets/homeImg2.jpg",
  },
  {
    quote: "Highly recommended!",
    review:
      "I brought my whole family and everyone left happy. The kids loved the burgers and I couldn't stop raving about the seafood platter. Great value for the quality.",
    name: "Sofia Martins",
    date: "02.02.21",
    image: "/assets/homeImg3.jpg",
  },
]

const CARDS_PER_PAGE = 3

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const total = testimonials.length

  // infinite next
  const next = () => {
    setIndex((prev) => (prev + CARDS_PER_PAGE) % total)
  }

  const prev = () => {
    setIndex((prev) =>
      prev - CARDS_PER_PAGE < 0
        ? total - CARDS_PER_PAGE
        : prev - CARDS_PER_PAGE
    )
  }

  // auto-slide
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      next()
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused])

  // visible cards with looping
  const visibleCards = []
  for (let i = 0; i < CARDS_PER_PAGE; i++) {
    visibleCards.push(testimonials[(index + i) % total])
  }

  const currentPage = Math.floor(index / CARDS_PER_PAGE)
  const totalPages = Math.ceil(total / CARDS_PER_PAGE)

  return (
    <section className="py-24 px-4 -mt-2.5 sm:px-6 lg:px-12 bg-white">

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-1 w-8 bg-yellow-500"></div>
          <h3 className="text-lg text-yellow-500 md:text-xl font-bold">Testimonials</h3>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-6">
          What Our Visitors Say
        </h2>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Real experiences from our guests who enjoyed our meals and service.
        </p>
      </div>

      {/* CARDS */}
      <div
        className="max-w-7xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -50) next()
              if (info.offset.x > 50) prev()
            }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 cursor-grab active:cursor-grabbing"
          >
            {visibleCards.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-white border border-gray-100 rounded-2xl p-8 transition duration-300"
              >
                <h3 className="text-lg md:text-xl font-bold mb-4">
                  {t.quote}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {t.review}
                </p>

                <div className="h-1 w-10 bg-yellow-500 mb-6"></div>

                <div className="flex items-center gap-4">
                  <img
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
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center justify-between max-w-7xl mx-auto mt-10">

        {/* DOTS */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i * CARDS_PER_PAGE)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentPage ? "w-6 bg-yellow-500" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* ARROWS */}
        <div className="flex gap-3">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-yellow-500 text-yellow-500 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition"
          >
            ←
          </button>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center hover:bg-yellow-400 transition"
          >
            →
          </button>
        </div>
      </div>

    </section>
  )
}