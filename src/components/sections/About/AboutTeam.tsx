"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "./SectionHeader";
import { team } from "@/lib/data/aboutData";

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

export function AboutTeam() {
  return (
    <section className="relative py-24 px-6 md:px-16 lg:px-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(8,31,34,0.82), rgba(8,31,34,0.88)), url(/assets/homeImg3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          label="The Team"
          light
          title="The People Behind Every Plate"
          subtitle="Small, tight-knit, and genuinely passionate. Meet the faces behind your favourite meals."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
          {team.map((member, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="overflow-hidden relative h-72">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">
                  {member.role}
                </p>
                <h4 className="text-white font-bold text-xl">
                  {member.name}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed mt-2 max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500">
                  {member.bio}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-yellow-500 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}