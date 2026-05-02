"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { milestones } from "@/lib/data/aboutData";

export function AboutJourney() {
  return (
    <section className="relative py-24 px-6 md:px-16 lg:px-20 bg-gray-50 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeader
          label="Our Journey"
          title="Twelve Years of Flavour"
          subtitle="From a tiny 20-seat kitchen to a full dining destination — here's how Tastyc grew."
        />
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
          <div className="space-y-12">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-500 border-4 border-white shadow z-10 mt-1" />
                <div
                  className={`md:w-1/2 flex ${i % 2 === 0 ? "md:justify-end md:pr-12" : "md:justify-start md:pl-12"} pl-14 md:pl-0`}
                >
                  <span className="text-5xl font-black text-yellow-500/20 leading-none select-none">
                    {m.year}
                  </span>
                </div>
                <div
                  className={`md:w-1/2 ${i % 2 === 0 ? "md:pl-12" : "md:pr-12"} pl-14 md:pl-12`}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2">
                      {m.year}
                    </p>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">
                      {m.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}