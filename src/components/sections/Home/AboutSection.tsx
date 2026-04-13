"use client"

import React from "react"
import { motion } from "framer-motion"
import { Utensils, Leaf, ChefHat, Globe } from "lucide-react"

// Stats shown in the floating card at the bottom of the image
const stats = [
  { value: "12+", label: "Years of Experience" },
  { value: "80+", label: "Menu Items" },
  { value: "98%", label: "Happy Customers" },
]

// The 4 highlight cards on the right side
const highlights = [
  {
    icon: Utensils,
    title: "Menu for Every Taste",
    description:
      "From local favorites to international classics, every dish is crafted to satisfy and surprise.",
  },
  {
    icon: Leaf,
    title: "Always Fresh Ingredients",
    description:
      "We source fresh, organic produce daily from trusted local farmers and suppliers.",
  },
  {
    icon: ChefHat,
    title: "Experienced Chefs",
    description:
      "Our kitchen team brings years of culinary passion, precision, and creativity to every plate.",
  },
  {
    icon: Globe,
    title: "Intercontinental Dishes",
    description:
      "Explore bold flavors from across the globe — all prepared under one roof.",
  },
]

export default function AboutPage() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative">

        {/* Background glow — same radiance treatment as features section */}
        <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
          <div className="w-[600px] h-[600px] bg-yellow-400/20 blur-[120px] rounded-full -translate-x-40"></div>
        </div>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 relative z-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-0.5 w-6 bg-yellow-500"></div>
            <p className="text-xl font-bold uppercase tracking-widest text-yellow-500">
              About Us
            </p>
            <div className="h-0.5 w-6 bg-yellow-500"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            We Invite You to Visit <br /> Our Restaurant
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            We started Tastyc with one simple belief — great food should feel
            like home. Every dish is made fresh daily, crafted by chefs who
            genuinely love what they do.
          </p>
        </motion.div>

        {/* Main content grid — image left, cards right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

          {/* LEFT — image with floating stats card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main image */}
            <div className="rounded-3xl overflow-hidden shadow-xl relative z-10">
              <img
                src="/assets/aboutImg.webp"
                alt="Inside our restaurant"
                className="h-[460px] w-full object-cover"
              />
            </div>

            {/* Extra glow near image — matches features section */}
            <div className="absolute -left-10 top-10 w-72 h-72 bg-yellow-400/20 blur-[100px] rounded-full"></div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 left-6 right-6 bg-white rounded-2xl shadow-lg px-6 py-5 z-10"
            >
              <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
                {stats.map((stat, i) => (
                  <div key={i} className="px-4">
                    <p className="text-xl font-black text-yellow-500">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — 4 highlight cards in 2x2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 lg:mt-0">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group relative p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition bg-white/80 backdrop-blur"
              >
                {/* Hover glow overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-yellow-400/10 blur-xl"></div>

                <item.icon className="h-8 w-8 mb-4 text-yellow-500 relative z-10" />
                <h4 className="font-semibold text-lg mb-2 text-gray-900 relative z-10">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 relative z-10">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}