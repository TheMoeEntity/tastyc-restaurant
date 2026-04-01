"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { name: "Home", dropdown: ["Home 1", "Home 2", "Home 3", "Home 4", "Home 5"] },
  { name: "About", dropdown: ["Our Story", "Team", "Careers", "Mission", "FAQ"] },
  { name: "Order", dropdown: ["Online Order", "Track Order", "Offers", "Cart", "Checkout"] },
  { name: "Pages", dropdown: ["Gallery", "Pricing", "Testimonials", "404", "Coming Soon"] },
  { name: "Blog", dropdown: ["Blog Grid", "Blog List", "Single Post", "Categories", "Authors"] },
  { name: "Contact", dropdown: ["Contact Us", "Support", "Locations", "Email", "Call"] },
  { name: "Shop", dropdown: ["All Products", "Cart", "Checkout", "Wishlist", "Deals"] },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);

  return (
    <header className="w-full flex justify-center mt-4">
      <div className="w-[98%] max-w-screen-2xl bg-white border border-gray-200 rounded-xl shadow-sm">

        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-5">

          {/* LOGO — smaller on mobile */}
          <div className="flex flex-col leading-tight font-mono">
            <h1 className="text-3xl md:text-5xl font-bold text-black">
              Tastyc
            </h1>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="w-4 md:w-6 h-0.5 bg-yellow-500"></span>
                <span className="w-4 md:w-6 h-0.5 bg-yellow-500"></span>
              </div>
              <p className="text-[8px] md:text-xs text-gray-500 uppercase tracking-widest font-mono">
                Food & Drinks
              </p>
              <div className="flex flex-col gap-0.5">
                <span className="w-4 md:w-6 h-0.5 bg-yellow-500"></span>
                <span className="w-4 md:w-6 h-0.5 bg-yellow-500"></span>
              </div>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-12 font-bold">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setActiveNav(index)}
                onMouseLeave={() => setActiveNav(null)}
              >
                <button className="relative flex items-center gap-1 text-xl font-semibold text-gray-800 font-mono pb-2 group">
                  {item.name}
                  <span className={`text-sm text-yellow-500 transition-opacity duration-150 ${activeNav === index ? "opacity-100" : "opacity-0"}`}>
                    ▾
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-1 bg-yellow-500 rounded-full transition-opacity duration-200 ${activeNav === index ? "opacity-100" : "opacity-0"}`} />
                </button>

                {activeNav === index && (
                  <div className="absolute left-0 top-full w-56 h-4 z-40" />
                )}

                {activeNav === index && item.dropdown && (
                  <div className="absolute left-0 top-full pt-4 z-50">
                    <div className="flex flex-col bg-yellow-400 p-3 rounded-lg shadow-xl w-56">
                      {item.dropdown.map((drop, i) => (
                        <Link
                          key={i}
                          href="#"
                          className="px-3 py-2 text-black font-bold text-sm transition-all hover:bg-white rounded"
                        >
                          {drop}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            <div className="relative text-2xl cursor-pointer hidden md:block group">
              🛒
              <span className="absolute left-0 -bottom-2 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
            </div>

            <button
              className="md:hidden flex flex-col gap-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <span className="text-xl font-bold">✕</span>
              ) : (
                <>
                  <span className="w-5 h-0.5 bg-black"></span>
                  <span className="w-5 h-0.5 bg-black"></span>
                  <span className="w-5 h-0.5 bg-black"></span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden px-4 py-4 space-y-1 border-t font-mono">
            {navItems.map((item, index) => (
              <div key={index} className="border-b border-gray-100 last:border-none">

                <button
                  onClick={() => setMobileExpanded(mobileExpanded === index ? null : index)}
                  className="w-full flex justify-between items-center py-2.5 text-sm font-semibold text-gray-800 font-mono"
                >
                  <span>{item.name}</span>
                  <span className="text-yellow-500 text-base">
                    {mobileExpanded === index ? "▴" : "▾"}
                  </span>
                </button>

                {mobileExpanded === index && (
                  <div className="pb-3 flex flex-col gap-0.5 pl-2">
                    {item.dropdown.map((drop, i) => (
                      <Link
                        key={i}
                        href="#"
                        className="py-2 px-2 text-xs font-bold text-gray-700 hover:bg-white hover:text-black rounded transition-all w-fit"
                      >
                        {drop}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 text-xl">🛒</div>
          </div>
        )}
      </div>
    </header>
  );
}