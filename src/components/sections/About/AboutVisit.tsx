"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "./SectionHeader";
import { openingHours } from "@/lib/data/aboutData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function AboutVisit() {
  return (
    <section className="relative py-24 px-6 md:px-16 lg:px-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(8,31,34,0.88), rgba(8,31,34,0.92)), url(/assets/homeImg2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          label="Visit Us"
          light
          title={
            <>
              Come Visit <span className="text-yellow-400">Tastyc</span>
            </>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-yellow-400" />
              <h4 className="text-white font-semibold text-lg">
                Opening Hours
              </h4>
            </div>
            <div className="space-y-3">
              {openingHours.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-white/10 pb-3 last:border-none last:pb-0"
                >
                  <span className="text-gray-400 text-sm">{row.day}</span>
                  <span className="text-white text-sm font-semibold">
                    {row.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center"
          >
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">
              Book a Table
            </p>
            <h4 className="text-white font-bold font-serif text-2xl sm:text-3xl mb-5 leading-tight">
              Ready for an <br /> Unforgettable Meal?
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Whether it&#39;s a quiet dinner for two or a celebration with
              the whole family — we have a table waiting for you.
            </p>
            <Link
              href="/reservation"
              className="inline-flex px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition"
            >
              Make a Reservation
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}