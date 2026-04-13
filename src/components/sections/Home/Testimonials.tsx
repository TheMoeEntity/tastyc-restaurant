"use client"

import React, { useState } from "react"
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
  const [startIndex, setStartIndex] = useState(0)

  const totalPages = Math.ceil(testimonials.length / CARDS_PER_PAGE)
  const currentPage = Math.floor(startIndex / CARDS_PER_PAGE)

  // go to previous set of cards
  const prev = () => {
    setStartIndex((i) => Math.max(i - CARDS_PER_PAGE, 0))
  }

  // go to next set of cards
  const next = () => {
    setStartIndex((i) =>
      i + CARDS_PER_PAGE >= testimonials.length ? i : i + CARDS_PER_PAGE
    )
  }

  // get only the 3 cards we want to show right now
  const visibleCards = testimonials.slice(startIndex, startIndex + CARDS_PER_PAGE)

  return (
    <section className="relative py-24 px-10 bg-white overflow-hidden">

      {/* Background glow effect */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-yellow-400/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center mb-16 relative z-10"
      >
        <div className="bg-yellow-500 h-0.5 w-6 mb-3"></div>
        <p className="font-bold text-xl text-yellow-500 uppercase tracking-widest mb-1">
          Testimonials
        </p>
        <h1 className="text-5xl font-black text-gray-900 leading-tight">
          What Our Visitors Say
        </h1>
        <p className="text-gray-500 mt-4 max-w-md">
          Real experiences from our guests who enjoyed our meals and service.
        </p>
      </motion.div>

      {/* Testimonial cards — shows 3 at a time and slides when page changes */}
      <div className="relative max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={startIndex}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {visibleCards.map((t, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group flex flex-col bg-white/80 backdrop-blur rounded-3xl px-8 py-10 shadow-lg hover:shadow-2xl transition-all duration-500 relative border border-gray-100"
              >
                {/* Big quote mark decoration in top-right corner */}
                <span className="absolute top-5 right-7 text-7xl text-yellow-500 font-black leading-none">
                  "
                </span>

                {/* Short headline quote */}
                <h3 className="text-xl font-black text-gray-900 mb-4 pr-10">
                  {t.quote}
                </h3>

                {/* Full review text */}
                <p className="text-gray-500 leading-relaxed flex-1">
                  {t.review}
                </p>

                {/* Yellow divider line */}
                <div className="w-10 h-0.5 bg-yellow-500 my-6"></div>

                {/* Reviewer info — photo, name, date */}
                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500"
                  />
                  <div>
                    <p className="font-black text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.date}</p>
                  </div>
                </div>

                {/* Hover glow overlay */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-yellow-400/10 blur-xl transition"></div>

                {/* Yellow bar that grows from left on hover */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-yellow-500 rounded-b-3xl group-hover:w-full transition-all duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination — dots on the left, arrow buttons on the right */}
      <div className="flex items-center justify-between max-w-7xl mx-auto mt-10">

        {/* Dot indicators, one per page */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(i * CARDS_PER_PAGE)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentPage ? "w-6 bg-yellow-500" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next arrow buttons */}
        <div className="flex gap-3">
          <button
            onClick={prev}
            disabled={startIndex === 0}
            className="w-10 h-10 rounded-full border-2 border-yellow-500 text-yellow-500 font-black flex items-center justify-center hover:bg-yellow-500 hover:text-white transition disabled:opacity-30"
          >
            ←
          </button>
          <button
            onClick={next}
            disabled={startIndex + CARDS_PER_PAGE >= testimonials.length}
            className="w-10 h-10 rounded-full bg-yellow-500 text-white font-black flex items-center justify-center hover:bg-yellow-400 transition disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}