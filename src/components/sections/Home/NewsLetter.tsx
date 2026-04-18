"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";

const newsletters = [
  {
    image: "/assets/homeImg1.jpg",
    category: "Breakfast",
    title: "Busy Breakfast: 5 Morning Meals Under 15 Minutes",
    date: "Jan 12, 2025",
    preview:
      "Mornings are chaotic — but that doesn't mean breakfast has to be boring or skipped entirely.",
    body:
      "Chef Emmanuel shares his go-to morning meals built for speed, simplicity and taste. Overnight oats, avocado toast, smoothies and more.",
  },
  {
    image: "/assets/homeImg2.jpg",
    category: "Dinner",
    title: "The Perfect Dinner Party: What Our Chefs Actually Cook at Home",
    date: "Feb 3, 2025",
    preview:
      "Chefs keep it simple at home — and that's exactly why it works.",
    body:
      "Simple jollof rice, pepper soup and no-fuss desserts are the backbone of chef-hosted dinners.",
  },
  {
    image: "/assets/homeImg3.jpg",
    category: "Desserts",
    title: "Sweet Secrets: The Desserts We Almost Kept to Ourselves",
    date: "Mar 19, 2025",
    preview:
      "Three desserts our pastry team almost never shared.",
    body:
      "Molten chocolate cake, mango panna cotta and chin chin bread pudding — perfected over years.",
  },
  {
    image: "/assets/aboutImg.webp",
    category: "Drinks",
    title: "Beyond Cocktails: Drinks That Surprise Every Guest",
    date: "Apr 7, 2025",
    preview:
      "Great drinks don’t need alcohol — just balance and creativity.",
    body:
      "Hibiscus cooler, tamarind lemonade and palm wine spritz redefine modern beverage craft.",
  },
];

// ANIMATION
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/* ───────────── CARD ───────────── */
function NewsletterCard({ item }: any) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
    >
      {/* IMAGE */}
      <div className="h-44 overflow-hidden relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        <div className="absolute top-3 left-3 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase">
          {item.category}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col gap-2">

        <p className="text-[10px] sm:text-xs text-gray-400">
          {item.date}
        </p>

        <h3 className="text-lg font-bold text-gray-900 font-serif leading-snug">
          {item.title}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          {item.preview}
        </p>

        <div className="w-8 h-0.5 bg-yellow-500 my-2" />

        {/* BODY */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="text-yellow-500 text-xs font-bold flex items-center gap-1 mt-2"
        >
          {open ? (
            <>
              Read Less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Read More <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>

      {/* bottom line */}
      <div className="h-0.5 w-0 group-hover:w-full bg-yellow-500 transition-all duration-500" />
    </motion.div>
  );
}

/* ───────────── SUBSCRIBE ───────────── */
function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="mt-16 rounded-2xl overflow-hidden relative">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-black/80"
        style={{
          backgroundImage: "url(/assets/homeImg3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 text-center px-6 py-14">

        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="h-0.5 w-6 bg-yellow-500" />
          <p className="text-xs uppercase tracking-widest text-yellow-400 font-bold">
            Newsletter
          </p>
          <div className="h-0.5 w-6 bg-yellow-500" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif">
          Get Weekly Chef Tips
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mt-3">
          No spam — just recipes and real kitchen secrets.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mt-6"
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-xs sm:text-sm"
            />
            <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg text-xs sm:text-sm font-bold">
              Subscribe
            </button>
          </form>
        ) : (
          <div className="text-yellow-400 mt-6 text-sm flex flex-col items-center gap-2">
            <Mail />
            You're subscribed!
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────── MAIN ───────────── */
export default function Newsletter() {
  return (
    <section className="py-20 px-6 md:px-16 lg:px-20 bg-white">

      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-12">

        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="h-0.5 w-6 bg-yellow-500" />
          <p className="text-xs sm:text-sm uppercase tracking-widest text-yellow-500 font-bold">
            Newsletter
          </p>
          <div className="h-0.5 w-6 bg-yellow-500" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-serif">
          Tips & Recipes
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 mt-3">
          Real kitchen stories, recipes and chef secrets.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newsletters.map((item, i) => (
          <NewsletterCard key={i} item={item} />
        ))}
      </div>

      <SubscribeForm />
    </section>
  );
}