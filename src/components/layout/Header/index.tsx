"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X, Trash2 } from "lucide-react";
import Image from "next/image";
import { navItems } from "@/lib/constants";
import { HeaderProps } from "@/types";
import { usePathname } from "next/navigation";

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const [cartItemCount, setCartItemCount] = useState(cartCount);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const isCartPage = usePathname() === "/cart";
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
          setCartItems(cart);
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
        setCartItems([]);
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
  }, [cartCount]);

  // Also update when prop changes
  // useEffect(() => {
  //   setCartItemCount(cartCount);
  // }, [cartCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setCartPreviewOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedCart = cartItems.filter((i) => i.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <header
      ref={headerRef}
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

            {/* cart - unified toggle */}
            <div className="relative">
              {/* Desktop Cart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  isCartPage ? null : setCartPreviewOpen(!cartPreviewOpen);
                }}
                className="relative text-2xl cursor-pointer hidden md:block group"
              >
                <ShoppingBag className="text-black" size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
                <span className="absolute left-0 -bottom-2 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
              </button>

              {/* Mobile Cart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  isCartPage ? null : setCartPreviewOpen(!cartPreviewOpen);
                }}
                className="relative text-2xl cursor-pointer md:hidden text-black block"
              >
                <ShoppingBag size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </button>

              {/* Mini Cart Preview */}
              <AnimatePresence>
                {cartPreviewOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-4 w-[320px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                      <h3 className="font-bold text-gray-900">
                        Your Cart{" "}
                        <span className="text-yellow-500">
                          ({cartItemCount})
                        </span>
                      </h3>
                      <button
                        onClick={() => setCartPreviewOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto p-4 space-y-4">
                      {cartItems.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 text-sm">
                          Your cart is empty
                        </div>
                      ) : (
                        cartItems.map((item, idx) => (
                          <div
                            key={`${item.id}-${idx}`}
                            className="flex gap-3 items-center"
                          >
                            <div className="w-12 h-12 relative rounded-md overflow-scroll shrink-0 bg-gray-100">
                              <Image
                                src={item.image || "/assets/homeImg1.jpg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-yellow-600">
                                $
                                {(
                                  (item.quantity || 1) * (item.price || 0)
                                ).toFixed(2)}
                              </p>
                              <button
                                onClick={(e) => removeItem(item.id, e)}
                                className="text-gray-300 hover:text-red-500 transition mt-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {cartItems.length > 0 && (
                      <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                        <div className="flex justify-between items-center font-bold text-gray-900 text-sm">
                          <span>Subtotal:</span>
                          <span className="text-yellow-600">
                            $
                            {cartItems
                              .reduce(
                                (acc, item) =>
                                  acc +
                                  (item.price || 0) * (item.quantity || 1),
                                0,
                              )
                              .toFixed(2)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href="/cart"
                            onClick={() => setCartPreviewOpen(false)}
                            className="flex-1 text-center py-2.5 border-2 border-yellow-500 text-yellow-600 font-bold text-sm rounded-lg hover:bg-yellow-50 transition"
                          >
                            View Cart
                          </Link>
                          <Link
                            href="/cart"
                            onClick={() => setCartPreviewOpen(false)}
                            className="flex-1 text-center py-2.5 bg-yellow-500 text-black font-bold text-sm rounded-lg hover:bg-yellow-400 transition"
                          >
                            Checkout
                          </Link>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
