"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { stats } from "@/lib/data/aboutData";

export function AboutHero() {
  return (
    <section className="relative py-24 px-6 md:px-16 lg:px-20 bg-white">
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="w-[600px] h-[600px] bg-yellow-400/15 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-0.5 w-6 bg-yellow-500" />
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
              About Us
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-8">
            More Than a <br />
            <span className="text-yellow-500">Restaurant</span>
          </h1>

          <div className="space-y-5 text-gray-600 leading-relaxed text-base sm:text-lg mb-10">
            <p>
              Tastyc was never meant to be just another restaurant. When we
              opened in 2012, we had twenty seats, two chefs, a borrowed oven,
              and a completely unreasonable belief that we could change how
              people experienced food in this city.
            </p>
            <p>
              From the very beginning, our philosophy has been simple: treat
              every guest like they&#39;re eating at your home, and cook every
              dish like it&#39;s the only one going out tonight. That standard
              hasn&#39;t changed — even when we&#39;re serving three hundred
              covers on a Saturday night.
            </p>
            <p>
              We source our ingredients fresh every morning. Our kitchen team
              arrives before most of the city wakes up — checking deliveries,
              tasting sauces, prepping stocks. The invisible labour is what
              makes a great meal look effortless. We still argue passionately
              about seasoning. We still obsess over presentation. And we still
              believe that a really good meal can make a bad day feel
              manageable and a good day feel extraordinary.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-gray-50 rounded-2xl py-4 px-2"
              >
                <p className="text-2xl font-black text-yellow-500">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-7 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition"
          >
            Explore Our Menu
          </Link>
        </motion.div>
      </div>
    </section>
  );
}