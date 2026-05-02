"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

export function AboutMission() {
  return (
    <section className="relative py-24 px-6 md:px-16 lg:px-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(8,31,34,0.82), rgba(8,31,34,0.88)), url(/assets/homeImg1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          label="Our Mission"
          light
          title={
            <>
              Why We Show Up <br /> Every Single Day
            </>
          }
          subtitle="Our mission isn't written on a poster in our office. It's lived out in our kitchen every morning before the doors open."
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto"
        >
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">
            Mission Statement
          </p>
          <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
            &quot;To create a dining experience so honest, so warm, and so
            consistently excellent that every guest — regardless of where they
            come from — leaves feeling genuinely nourished, not just
            fed.&quot;
          </p>
        </motion.div>
      </div>
    </section>
  );
}