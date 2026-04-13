"use client"

import { motion } from "framer-motion"
import {
  Utensils,
  Leaf,
  ChefHat,
  Globe,
} from "lucide-react"

export default function FeaturesAdvisoryStyle() {
  const features = [
    {
      icon: Utensils,
      title: "Menu for Every Taste",
      description:
        "Carefully curated dishes designed to satisfy diverse preferences and elevate dining experiences.",
    },
    {
      icon: Leaf,
      title: "Always Fresh Ingredients",
      description:
        "We prioritize quality by sourcing fresh, organic, and locally produced ingredients for every meal.",
    },
    {
      icon: ChefHat,
      title: "Experienced Chefs",
      description:
        "Our chefs bring years of culinary expertise, ensuring consistency, creativity, and excellence.",
    },
    {
      icon: Globe,
      title: "Intercontinental Dishes",
      description:
        "We cook and serve a wide variety of meals from around the globe.",
    },
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative">

        {/* Radiance Glow (behind content) */}
        <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
          <div className="w-[500px] h-[500px] bg-yellow-400/20 blur-[120px] rounded-full translate-x-40"></div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 relative z-10"
        >
          <h3 className="text-xl uppercase tracking-widest text-yellow-500 mb-3">
            Features
          </h3>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-black">
            Why Choose Our Restaurant
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            We combine quality ingredients, expert chefs, and diverse menus to
            deliver a dining experience that stands out every time.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition bg-white/80 backdrop-blur"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-yellow-400/10 blur-xl"></div>

                <feature.icon className="h-8 w-8 mb-4 text-yellow-500 relative z-10" />
                <h4 className="font-semibold text-lg mb-2 text-gray-900 relative z-10">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Visual Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-xl relative z-10">
              <img
                src="/assets/homeImg1.jpg"
                alt="Restaurant feature"
                className="h-[420px] w-full object-cover"
              />
            </div>

            {/* Extra Glow near image */}
            <div className="absolute -right-10 top-10 w-72 h-72 bg-yellow-400/20 blur-[100px] rounded-full"></div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 left-6 right-6 bg-white rounded-2xl shadow-lg p-6 text-center z-10"
            >
              <p className="font-semibold text-yellow-500 text-lg">
                Fresh • Quality • Experience
              </p>
              <p className="text-sm text-gray-500">
                Crafted to give you the best dining moments
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}