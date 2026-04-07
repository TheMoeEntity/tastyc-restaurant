"use client"

import React, { useState } from 'react'

const testimonials = [
  {
    quote: "I'm delighted!",
    review: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique, eligendi dolorem? Voluptates rem magnam nesciunt ullam hic error sed, minus, accusantium inventore ex reprehenderit ipsum aperiam libero ut, laudantium delectus.",
    name: "Viktoria Freeman",
    date: "02.02.21",
    image: "/assets/homeimg1.jpg",
  },
  {
    quote: "I will visit again.",
    review: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique, eligendi dolorem? Voluptates rem magnam nesciunt ullam hic error sed, minus, accusantium inventore ex reprehenderit ipsum aperiam libero ut, laudantium delectus.",
    name: "Paul Trueman",
    date: "02.02.21",
    image: "/assets/homeimg2.jpg",
  },
  {
    quote: "The best restaurant!",
    review: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique, eligendi dolorem? Voluptates rem magnam nesciunt ullam hic error sed, minus, accusantium inventore ex reprehenderit ipsum aperiam libero ut, laudantium delectus.",
    name: "Oscar Oldman",
    date: "02.02.21",
    image: "/assets/homeimg3.jpg",
  },
  {
    quote: "It was very delicious!",
    review: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique, eligendi dolorem? Voluptates rem magnam nesciunt ullam hic error sed, minus, accusantium inventore ex reprehenderit ipsum aperiam libero ut, laudantium delectus.",
    name: "Emma Newman",
    date: "02.02.21",
    image: "/assets/homeimg1.jpg",
  },
  {
    quote: "Absolutely wonderful!",
    review: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique, eligendi dolorem? Voluptates rem magnam nesciunt ullam hic error sed, minus, accusantium inventore ex reprehenderit ipsum aperiam libero ut, laudantium delectus.",
    name: "James Carter",
    date: "02.02.21",
    image: "/assets/homeimg2.jpg",
  },
  {
    quote: "Highly recommended!",
    review: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique, eligendi dolorem? Voluptates rem magnam nesciunt ullam hic error sed, minus, accusantium inventore ex reprehenderit ipsum aperiam libero ut, laudantium delectus.",
    name: "Sofia Martins",
    date: "02.02.21",
    image: "/assets/homeimg3.jpg",
  },
]

const CARDS_PER_PAGE = 3

export default function Testimonials() {
  const [startIndex, setStartIndex] = useState(0)

  const totalPages = Math.ceil(testimonials.length / CARDS_PER_PAGE)
  const currentPage = Math.floor(startIndex / CARDS_PER_PAGE)

  const prev = () => {
    setStartIndex((i) => Math.max(i - CARDS_PER_PAGE, 0))
  }

  const next = () => {
    setStartIndex((i) =>
      i + CARDS_PER_PAGE >= testimonials.length ? i : i + CARDS_PER_PAGE
    )
  }

  const visibleCards = testimonials.slice(startIndex, startIndex + CARDS_PER_PAGE)

  return (
    <section className="py-24 px-10 bg-white">

      {/* header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="bg-yellow-500 h-0.5 w-6 mb-3"></div>
        <p className="font-bold text-xl text-yellow-500 uppercase tracking-widest mb-1">Testimonials</p>
        <h1 className="text-5xl font-black text-gray-900 leading-tight">What Our Visitors Say</h1>
        <p className="text-gray-400 mt-4 text-base max-w-md">
          Porro eveniet, autem ipsam corrupti consectetur cum. Repudiandae dignissimos fugiat sit nam.
        </p>
      </div>

      {/* 3 visible cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {visibleCards.map((t, index) => (
          <div
            key={startIndex + index}
            className="group flex flex-col bg-gray-50 rounded-3xl px-8 py-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative"
          >
            {/* big quote mark */}
            <span className="absolute top-5 right-7 text-7xl text-yellow-500 font-black leading-none select-none">"</span>

            {/* quote title */}
            <h3 className="text-xl font-black text-gray-900 mb-4 pr-10">{t.quote}</h3>

            {/* review */}
            <p className="text-gray-400 text-sm leading-relaxed flex-1">{t.review}</p>

            {/* accent line */}
            <div className="w-10 h-0.5 bg-yellow-500 my-6"></div>

            {/* author */}
            <div className="flex items-center gap-4">
              <img
                src={t.image}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500"
                style={{ boxShadow: '0 4px 0px #a16207, 0 6px 8px rgba(0,0,0,0.2)' }}
              />
              <div>
                <p className="font-black text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.date}</p>
              </div>
            </div>

            {/* bottom accent bar on hover */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-yellow-500 rounded-b-3xl group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>

      {/* navigation */}
      <div className="flex items-center justify-between max-w-7xl mx-auto mt-10">

        {/* dot indicators */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(i * CARDS_PER_PAGE)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentPage ? 'w-6 bg-yellow-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* prev / next */}
        <div className="flex gap-3">
          <button
            onClick={prev}
            disabled={startIndex === 0}
            className="w-10 h-10 rounded-full border-2 border-yellow-500 text-yellow-500 font-black flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ←
          </button>
          <button
            onClick={next}
            disabled={startIndex + CARDS_PER_PAGE >= testimonials.length}
            className="w-10 h-10 rounded-full bg-yellow-500 text-white font-black flex items-center justify-center hover:bg-yellow-400 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      </div>

    </section>
  )
}