"use client"

import Header from "@/components/layout/Header"
import Link from "next/link"
import { useState, useRef } from "react"
import { ArrowRight, ArrowLeft, ShoppingCart } from "lucide-react"

// ─── data ────────────────────────────────────────────────────────────────────

type MenuItem = {
  name: string
  desc: string
  price: number
  oldPrice?: number
  category: "dishes" | "desserts" | "drinks"
  image: string   // swap with real images later
  tag?: string
}

const menuItems: MenuItem[] = [
  { name: "Fruit Salad",  desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 10.00, category: "desserts", image: "/assets/menu/fruit-salad.jpg" },
  { name: "Pancakes",     desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 3.50,  category: "desserts", image: "/assets/menu/pancakes.jpg",   tag: "Popular" },
  { name: "Casserole",    desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 4.99,  category: "dishes",   image: "/assets/menu/casserole.jpg" },
  { name: "King Burger",  desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 1.99,  category: "dishes",   image: "/assets/menu/burger.jpg",     tag: "Chef's pick" },
  { name: "Bear",         desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 20.99, category: "drinks",   image: "/assets/menu/bear.jpg" },
  { name: "Juices",       desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 1.50,  category: "drinks",   image: "/assets/menu/juices.jpg" },
]

const specialItems: MenuItem[] = [
  { name: "Fruit Salad",  desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 10.00, oldPrice: undefined, category: "desserts", image: "/assets/menu/fruit-salad.jpg" },
  { name: "Pancakes",     desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 3.50,  oldPrice: 4.50,  category: "desserts", image: "/assets/menu/pancakes.jpg" },
  { name: "Casserole",    desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 4.99,  oldPrice: 5.99,  category: "dishes",   image: "/assets/menu/casserole.jpg" },
  { name: "King Burger",  desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 1.99,  oldPrice: 2.99,  category: "dishes",   image: "/assets/menu/burger.jpg" },
  { name: "Bear",         desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 20.99, oldPrice: 25.99, category: "drinks",   image: "/assets/menu/bear.jpg" },
  { name: "Juices",       desc: "Consectetur adipisicing elit. Soluta, impedit, saepe.", price: 1.50,  oldPrice: 1.99,  category: "drinks",   image: "/assets/menu/juices.jpg" },
]

const tabs = ["All Dishes", "Dishes", "Desserts", "Drinks"] as const
type Tab = typeof tabs[number]

// ─── small components ─────────────────────────────────────────────────────────

// placeholder image box for when real images aren't there yet
function FoodImage({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div className={`bg-yellow-50 flex items-center justify-center text-5xl ${className}`}>
      {name === "Fruit Salad" ? "🥗"
        : name === "Pancakes"    ? "🥞"
        : name === "Casserole"   ? "🥘"
        : name === "King Burger" ? "🍔"
        : name === "Bear"        ? "🍺"
        : "🍹"}
    </div>
  )
}

function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        <FoodImage name={item.name} className="w-full h-44" />
        {item.tag && (
          <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold font-mono px-2.5 py-1 rounded-full">
            {item.tag}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif font-bold text-gray-900 text-lg leading-tight">{item.name}</h3>
          <span className="text-yellow-500 font-bold font-mono text-base whitespace-nowrap">€{item.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-400 text-xs font-mono leading-relaxed mb-4">{item.desc}</p>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-yellow-500 text-yellow-600 font-bold font-mono text-sm rounded-xl hover:bg-yellow-500 hover:text-black transition-all duration-200">
          <ShoppingCart size={14} />
          Add to order
        </button>
      </div>
    </div>
  )
}

function SpecialCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <FoodImage name={item.name} className="w-full h-40" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif font-bold text-gray-900 text-base leading-tight">{item.name}</h3>
          <div className="text-right">
            {item.oldPrice && (
              <p className="text-gray-400 text-xs font-mono line-through">€{item.oldPrice.toFixed(2)}</p>
            )}
            <p className="text-yellow-500 font-bold font-mono text-sm">€{item.price.toFixed(2)}</p>
          </div>
        </div>
        <p className="text-gray-400 text-xs font-mono leading-relaxed">{item.desc}</p>
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Dishes")
  const sliderRef = useRef<HTMLDivElement>(null)

  // filter menu items by tab
  const filtered = activeTab === "All Dishes"
    ? menuItems
    : menuItems.filter(item => {
        if (activeTab === "Dishes")   return item.category === "dishes"
        if (activeTab === "Desserts") return item.category === "desserts"
        if (activeTab === "Drinks")   return item.category === "drinks"
        return true
      })

  function scrollSlider(dir: "left" | "right") {
    if (!sliderRef.current) return
    sliderRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* shared header */}
      <Header />

      {/* ── hero banner ───────────────────────────────────────── */}
      <div className="w-full bg-black py-14 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="w-10 h-0.5 bg-yellow-500 inline-block"></span>
          <p className="text-yellow-500 uppercase tracking-widest text-xs font-mono">Discover Our Menu</p>
          <span className="w-10 h-0.5 bg-yellow-500 inline-block"></span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-white mb-3">Our Menu</h1>
        <p className="text-gray-400 font-mono text-sm max-w-md mx-auto mb-5">
          Quaerat debitis, vel, sapiente dicta sequi labore porro pariatur harum expedita.
        </p>
        {/* breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-500">
          <Link href="/" className="hover:text-yellow-500 transition">Home</Link>
          <span>/</span>
          <span className="text-yellow-500">Menu</span>
        </div>
      </div>

      {/* ── tabs + grid ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-14">

        {/* section label */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="w-8 h-0.5 bg-yellow-500 inline-block"></span>
            <p className="text-yellow-500 uppercase tracking-widest text-xs font-mono">Our Menu</p>
            <span className="w-8 h-0.5 bg-yellow-500 inline-block"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-gray-900 mb-2">{activeTab}</h2>
          <p className="text-gray-400 font-mono text-sm max-w-lg mx-auto">
            Porro eveniet, autem ipsam corrupti consectetur cum. Repudiandae dignissimos fugiat sit nam.
          </p>
        </div>

        {/* tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full font-mono font-bold text-sm transition-all duration-200 border-2 ${
                activeTab === tab
                  ? "bg-yellow-500 border-yellow-500 text-black"
                  : "border-gray-200 text-gray-600 hover:border-yellow-500 hover:text-yellow-600 bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <MenuCard key={`${item.name}-${i}`} item={item} />
          ))}
        </div>
      </section>

      {/* ── good offer banner ────────────────────────────────────── */}
      <section className="bg-black py-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <span className="w-8 h-0.5 bg-yellow-500 inline-block"></span>
              <p className="text-yellow-500 uppercase tracking-widest text-xs font-mono">Good Offer</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-white mb-3">
              Pay for one<br />
              <span className="text-yellow-500">Get two!</span>
            </h2>
            <p className="text-gray-400 font-mono text-sm max-w-sm">
              Quaerat debitis, vel, sapiente dicta sequi labore porro pariatur harum expedita.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/reservation"
              className="px-7 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold font-mono rounded-lg transition"
            >
              Reservation
            </Link>
            <Link
              href="/order"
              className="px-7 py-3.5 border-2 border-white hover:bg-white hover:text-black text-white font-bold font-mono rounded-lg transition"
            >
              Get Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── special proposals slider ─────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-14">

        {/* section label */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-0.5 bg-yellow-500 inline-block"></span>
              <p className="text-yellow-500 uppercase tracking-widest text-xs font-mono">Menu</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-gray-900 mb-1">Special Proposals</h2>
            <p className="text-gray-400 font-mono text-sm max-w-md">
              Porro eveniet, autem ipsam corrupti consectetur cum. Repudiandae dignissimos fugiat sit nam.
            </p>
          </div>

          {/* slider arrows */}
          <div className="flex gap-3">
            <button
              onClick={() => scrollSlider("left")}
              className="w-10 h-10 rounded-full border-2 border-yellow-500 flex items-center justify-center text-yellow-500 hover:bg-yellow-500 hover:text-black transition"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => scrollSlider("right")}
              className="w-10 h-10 rounded-full border-2 border-yellow-500 flex items-center justify-center text-yellow-500 hover:bg-yellow-500 hover:text-black transition"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* horizontally scrollable cards */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {specialItems.map((item, i) => (
            <SpecialCard key={i} item={item} />
          ))}
        </div>

        {/* all products link */}
        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold font-mono rounded-lg transition"
          >
            All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  )
}