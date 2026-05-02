"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Utensils } from "lucide-react";

export function ReservationCTA() {
  return (
    <section className="relative py-24 px-6 md:px-16 lg:px-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.88)), url(/assets/homeImg3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Utensils className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-500 text-sm font-bold uppercase tracking-wider">
              Private Events
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-4">
            Host Your Special Event With Us
          </h3>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Whether it's a birthday, anniversary, or corporate gathering, our
            team will create an unforgettable experience for you and your
            guests.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-lg hover:shadow-xl text-base"
            >
              Contact Our Events Team
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-xl transition text-base"
            >
              View Catering Menu
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}