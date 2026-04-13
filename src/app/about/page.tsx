"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Star, Heart, Users, Award } from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "12+", label: "Years Serving" },
  { value: "80+", label: "Menu Items" },
  { value: "98%", label: "Happy Guests" },
  { value: "15k+", label: "Orders Served" },
];

const team = [
  {
    name: "Chef Emmanuel Obi",
    role: "Executive Chef",
    bio: "18 years across Lagos, Accra, and London. Emmanuel leads with fearless creativity and deep respect for every ingredient.",
    image: "/assets/homeImg1.jpg",
  },
  {
    name: "Adaeze Nwosu",
    role: "Pastry Chef",
    bio: "Trained in Paris, Adaeze brings a delicate touch to every dessert. Her molten chocolate cake has been on the menu since day one.",
    image: "/assets/homeImg2.jpg",
  },
  {
    name: "Kingsley Eze",
    role: "Head of Operations",
    bio: "Kingsley's obsession with guest experience means every visit feels personal, warm, and perfectly timed.",
    image: "/assets/homeImg3.jpg",
  },
];

const milestones = [
  { year: "2012", title: "We Opened Our Doors", description: "Tastyc started as a small 20-seat kitchen driven by one idea — make people feel at home through food." },
  { year: "2015", title: "First Expansion", description: "Growing demand pushed us to double our space and introduce our now-famous intercontinental menu." },
  { year: "2018", title: "Best Restaurant Award", description: "We were honored with the Regional Culinary Excellence Award for our commitment to quality." },
  { year: "2021", title: "Online Shop Launched", description: "We brought Tastyc to your doorstep — meal kits and signature sauces shipped nationwide." },
  { year: "2024", title: "Community Kitchen Program", description: "Every weekend we open our kitchen to train young aspiring chefs for free." },
];

const values = [
  {
    icon: Heart,
    title: "Cooked with Love",
    description:
      "Every dish that leaves our kitchen carries the warmth and care of the people who made it. We cook like we're feeding family — because in many ways, we are. That emotional investment is something you can taste.",
  },
  {
    icon: Star,
    title: "Uncompromising Quality",
    description:
      "We never cut corners. If an ingredient isn't right, it doesn't go on your plate — full stop. From the oil we fry in to the garnish we finish with, every detail is held to the same standard every single day.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We believe restaurants exist to bring people together. Every table is a gathering place — for families, old friends, first dates, and everything in between. Tastyc was built for the community and belongs to it.",
  },
  {
    icon: Award,
    title: "Honest Recognition",
    description:
      "Awards and good reviews are gratifying, but they're not why we show up. Our real reward is a guest who comes back — who brings their friend, who tells their colleague. That quiet loyalty is the only metric that truly matters to us.",
  },
];

const openingHours = [
  { day: "Monday – Friday", time: "10:00 AM – 10:00 PM" },
  { day: "Saturday", time: "9:00 AM – 11:00 PM" },
  { day: "Sunday", time: "11:00 AM – 9:00 PM" },
  { day: "Public Holidays", time: "12:00 PM – 8:00 PM" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

function SectionHeader({ label, title, subtitle, light = false }: {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="text-center max-w-3xl mx-auto mb-16"
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-0.5 w-6 bg-yellow-500" />
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">{label}</p>
        <div className="h-0.5 w-6 bg-yellow-500" />
      </div>
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-4 ${light ? "text-white" : "text-gray-900"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base sm:text-lg leading-relaxed ${light ? "text-gray-400" : "text-gray-500"}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

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
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">About Us</p>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-8">
              More Than a <br />
              <span className="text-yellow-500">Restaurant</span>
            </h1>

            <div className="space-y-5 text-gray-600 leading-relaxed text-base sm:text-lg mb-10">
              <p>
                Tastyc was never meant to be just another restaurant. When we opened in 2012, we had twenty seats, two chefs, a borrowed oven, and a completely unreasonable belief that we could change how people experienced food in this city.
              </p>
              <p>
                From the very beginning, our philosophy has been simple: treat every guest like they're eating at your home, and cook every dish like it's the only one going out tonight. That standard hasn't changed — even when we're serving three hundred covers on a Saturday night.
              </p>
              <p>
                We source our ingredients fresh every morning. Our kitchen team arrives before most of the city wakes up — checking deliveries, tasting sauces, prepping stocks. The invisible labour is what makes a great meal look effortless. We still argue passionately about seasoning. We still obsess over presentation. And we still believe that a really good meal can make a bad day feel manageable and a good day feel extraordinary.
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
                  <p className="text-2xl font-black text-yellow-500">{s.value}</p>
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
            backgroundImage: "linear-gradient(rgba(8,31,34,0.82), rgba(8,31,34,0.88)), url(/assets/homeImg1.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            label="Our Mission"
            light
            title={<>Why We Show Up <br /> Every Single Day</>}
            subtitle="Our mission isn't written on a poster in our office. It's lived out in our kitchen every morning before the doors open."
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto"
          >
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">Mission Statement</p>
            <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
              "To create a dining experience so honest, so warm, and so consistently excellent that every guest — regardless of where they come from — leaves feeling genuinely nourished, not just fed."
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
                <h4 className="font-bold text-gray-900 text-lg mb-3">{v.title}</h4>

                {/* paragraph */}
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{v.description}</p>

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
            backgroundImage: "linear-gradient(rgba(8,31,34,0.82), rgba(8,31,34,0.88)), url(/assets/homeImg3.jpg)",
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
              <motion.div key={i} variants={fadeUp} className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="overflow-hidden h-72">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">{member.role}</p>
                  <h4 className="text-white font-bold text-xl">{member.name}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed mt-2 max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500">{member.bio}</p>
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
                  <div className={`md:w-1/2 flex ${i % 2 === 0 ? "md:justify-end md:pr-12" : "md:justify-start md:pl-12"} pl-14 md:pl-0`}>
                    <span className="text-5xl font-black text-yellow-500/20 leading-none select-none">{m.year}</span>
                  </div>
                  <div className={`md:w-1/2 ${i % 2 === 0 ? "md:pl-12" : "md:pr-12"} pl-14 md:pl-12`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                      <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2">{m.year}</p>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">{m.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{m.description}</p>
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
            backgroundImage: "linear-gradient(rgba(8,31,34,0.88), rgba(8,31,34,0.92)), url(/assets/homeImg2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader label="Visit Us" light title={<>Come Visit <span className="text-yellow-400">Tastyc</span></>} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-yellow-400" />
                <h4 className="text-white font-semibold text-lg">Opening Hours</h4>
              </div>
              <div className="space-y-3">
                {openingHours.map((row, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-none last:pb-0">
                    <span className="text-gray-400 text-sm">{row.day}</span>
                    <span className="text-white text-sm font-semibold">{row.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">Book a Table</p>
              <h4 className="text-white font-bold font-serif text-2xl sm:text-3xl mb-5 leading-tight">
                Ready for an <br /> Unforgettable Meal?
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Whether it's a quiet dinner for two or a celebration with the whole family — we have a table waiting for you.
              </p>
              <Link href="/reservation" className="inline-flex px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition">
                Make a Reservation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>


    </main>
  );
}