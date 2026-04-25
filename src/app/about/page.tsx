"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  fadeUp,
  milestones,
  openingHours,
  stagger,
  stats,
  team,
  values,
} from "@/lib/data/aboutData";
import { SectionHeader } from "@/components/sections/About/SectionHeader";

export default function AboutPage() {
  return (
    <main className="bg-white overflow-hidden">
      {/* ABOUT US — text only, no image */}
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

      {/* MISSION */}
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

      {/* VALUES — white cards with icon, heading, and paragraph */}
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
                {/* icon */}
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-5 group-hover:bg-yellow-500/20 transition">
                  <v.icon className="w-6 h-6 text-yellow-500" />
                </div>

                {/* heading */}
                <h4 className="font-bold text-gray-900 text-lg mb-3">
                  {v.title}
                </h4>

                {/* paragraph */}
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {v.description}
                </p>

                {/* yellow bottom bar grows on hover */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-500 rounded-b-2xl group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TEAM */}
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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

      {/* JOURNEY */}
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

      {/* VISIT US */}
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
    </main>
  );
}
