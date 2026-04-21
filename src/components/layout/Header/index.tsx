"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { navItems } from "@/lib/constants";
import { HeaderProps } from "@/types";

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const [cartItemCount, setCartItemCount] = useState(cartCount);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // Listen for cart updates from localStorage or custom events
  useEffect(() => {
    // Update cart count from localStorage
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          const totalItems = cart.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (sum: number, item: any) => sum + (item.quantity || 1),
            0,
          );
          setCartItemCount(totalItems);
        } catch (e) {
          console.error("Error parsing cart:", e);
        }
      } else {
        setCartItemCount(0);
      }
    };

    // Initial load
    updateCartCount();

    // Listen for storage events (when cart changes in another tab)
    window.addEventListener("storage", updateCartCount);

    // Listen for custom cart update event
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Also update when prop changes
  useEffect(() => {
    setCartItemCount(cartCount);
  }, [cartCount]);

  return (
    <header
      className={`fixed transition-all duration-900 ease ${isScrolled ? "-top-2" : "top-4"} left-0 z-50 w-full flex justify-center`}
    >
      <div
        className={`w-[97%] max-w-screen-2xl bg-white border border-gray-200 rounded-xl shadow-sm ${isScrolled ? "py-3" : "py-0"}`}
      >
        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-3">
          {/* logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <h1
              className={`transition-all duration-200 ease ${isScrolled ? "text-xl md:text-2xl" : "text-2xl md:text-4xl"}  font-bold text-black`}
            >
              Tastyc
            </h1>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="w-4 md:w-6 h-0.5 bg-yellow-500"></span>
                <span className="w-4 md:w-6 h-0.5 bg-yellow-500"></span>
              </div>
              <p className="text-[8px] md:text-xs text-gray-500 uppercase tracking-widest">
                Food & Drinks
              </p>
              <div className="flex flex-col gap-0.5">
                <span className="w-4 md:w-6 h-0.5 bg-yellow-500"></span>
                <span className="w-4 md:w-6 h-0.5 bg-yellow-500"></span>
              </div>
            </div>
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-12">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setActiveNav(index)}
                onMouseLeave={() => setActiveNav(null)}
              >
                <Link
                  href={item.href}
                  className="relative text-sm uppercase font-extrabold flex items-center gap-1 text-gray-800 pb-2"
                >
                  {item.name}
                  {item.dropdown && (
                    <span
                      className={`text-sm text-yellow-500 transition-opacity duration-150 `}
                    >
                      ▾
                    </span>
                  )}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-1 bg-yellow-500 rounded-full transition-opacity duration-200 ${activeNav === index ? "opacity-100" : "opacity-0"}`}
                  />
                </Link>

                {/* invisible bridge so mouse can reach dropdown */}
                {activeNav === index && item.dropdown && (
                  <div className="absolute left-0 top-full w-56 h-4 z-40" />
                )}

                {activeNav === index && item.dropdown && (
                  <div className="absolute left-0 top-full pt-4 z-50">
                    <div className="flex flex-col bg-yellow-400 p-3 rounded-lg shadow-xl w-56">
                      {item.dropdown.map((drop, i) => (
                        <Link
                          key={i}
                          href={drop.href}
                          className="px-3 py-2 text-black text-sm transition-all hover:bg-white rounded"
                        >
                          {drop.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* right side */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/reservation"
              className="hidden md:inline-flex items-center px-7 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-base rounded-lg transition"
            >
              Reservation
            </Link>

            {/* cart - desktop */}
            <Link
              href="/cart"
              className="relative text-2xl cursor-pointer hidden md:block group"
            >
              <ShoppingBag className="text-black" size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
              <span className="absolute left-0 -bottom-2 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* cart - mobile */}
            <Link
              href="/cart"
              className="relative text-2xl cursor-pointer md:hidden"
            >
              <ShoppingBag />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* hamburger */}
            <button
              className="md:hidden flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] p-2"
              onClick={() => {
                setMobileOpen(!mobileOpen);
              }}
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

        {/* mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1 border-t">
                {navItems.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 last:border-none"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-2.5 text-sm text-gray-800"
                      >
                        {item.name}
                      </Link>
                      {item.dropdown && (
                        <button
                          onClick={() =>
                            setMobileExpanded(
                              mobileExpanded === index ? null : index,
                            )
                          }
                          className="py-2.5 px-2 text-yellow-500 text-base"
                        >
                          {mobileExpanded === index ? "▴" : "▾"}
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {mobileExpanded === index && item.dropdown && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-3 flex flex-col gap-0.5 pl-2">
                            {item.dropdown.map((drop, i) => (
                              <Link
                                key={i}
                                href={drop.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-2 px-2 text-xs text-gray-700 hover:bg-white hover:text-black rounded transition-all w-fit"
                              >
                                {drop.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <div className="pt-3 flex items-center justify-between">
                  <Link
                    href="/reservation"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-base rounded-lg transition"
                  >
                    Reservation
                  </Link>
                  <Link
                    href="/cart"
                    className="relative text-2xl cursor-pointer"
                  >
                    <ShoppingBag />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                        {cartItemCount > 99 ? "99+" : cartItemCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
