"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { values } from "@/lib/data/aboutData";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function AboutValues() {
  return (
    <section className="relative py-24 px-6 md:px-16 lg:px-20 bg-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="w-[600px] h-[600px] bg-yellow-400/15 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          label="Our Values"
          title="What We Believe In"
          subtitle="These aren't words on a wall. They are the principles that shape every decision we make in and out of the kitchen."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((v, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group relative flex flex-col p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg bg-white transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-5 group-hover:bg-yellow-500/20 transition">
                <v.icon className="w-6 h-6 text-yellow-500" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-3">
                {v.title}
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                {v.description}
              </p>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-500 rounded-b-2xl group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}