"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function ReservationHero() {
  return (
    <section className="relative py-32 px-6 md:px-16 lg:px-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url(/assets/homeImg1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-500 text-sm font-bold uppercase tracking-wider">
              Limited Spots Available
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif text-white mb-6 leading-tight">
            Reserve Your{" "}
            <span className="text-yellow-500 relative inline-block">
              Experience
              <div className="absolute bottom-2 left-0 right-0 h-3 bg-yellow-500/30 -z-10" />
            </span>
          </h1>

          <p className="text-gray-200 text-lg sm:text-xl max-w-2xl mx-auto">
            Every great meal begins with a seat at the table. Let us prepare
            something unforgettable for you and your guests.
          </p>
        </motion.div>
      </div>
    </section>
  );
}