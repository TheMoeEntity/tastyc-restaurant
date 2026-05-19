"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag,
  X,
  Trash2,
  LogIn,
  UserPlus,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { navItems } from "@/lib/constants";
import { HeaderProps } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import apiFetch from "@/lib/api";
import { useConfirmModal } from "@/hooks/useConfirmModal";

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [accountHovered, setAccountHovered] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { confirm, modal } = useConfirmModal();

  const { items, removeItem, getTotalItems, getSubtotal } = useCartStore();
  const cartItemCount = getTotalItems();
  const subtotal = getSubtotal();

  const headerRef = useRef<HTMLElement>(null);
  const isCartPage = usePathname() === "/cart";

  useEffect(() => {
    setMounted(true);
    // tastyc_user_id is not httpOnly — intentionally readable by JS for auth detection
    setIsAuthenticated(document.cookie.includes("tastyc_user_id="));
  }, []);

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Log out?",
      message: "You'll need to sign in again to access your account.",
      confirmLabel: "Log out",
      cancelLabel: "Stay",
      danger: true,
    });
    if (!confirmed) return;
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // best-effort — clear UI regardless
    }
    setIsAuthenticated(false);
    setAccountHovered(false);
    setMobileOpen(false);
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartVersion((prev) => prev + 1);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  const mainNavItems = navItems.filter((item) => item.name !== "Account");

  return (
    <>
    <header
      ref={headerRef}
      className={`fixed transition-all duration-900 ease ${isScrolled ? "-top-2" : "top-4"} left-0 z-50 w-full flex justify-center`}
    >
      <div
        className={`w-[97%] max-w-screen-2xl bg-white border border-gray-200 rounded-xl shadow-sm ${isScrolled ? "py-3" : "py-0"}`}
      >
        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-3">
          {/* LOGO */}
          <Link href="/" className="flex flex-col leading-tight">
            <h1
              className={`transition-all duration-200 ease ${isScrolled ? "text-xl md:text-2xl" : "text-2xl md:text-4xl"} font-bold text-black`}
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

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-12">
            {mainNavItems.map((item, index) => (
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
                    <span className="text-sm text-yellow-500 transition-opacity duration-150">
                      ▾
                    </span>
                  )}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-1 bg-yellow-500 rounded-full transition-opacity duration-200 ${activeNav === index ? "opacity-100" : "opacity-0"}`}
                  />
                </Link>

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

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Reservation — desktop only */}
            <Link
              href="/reservation"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-lg transition"
            >
              Reservation
            </Link>

            {/* ACCOUNT — desktop only */}
            <div
              className="hidden md:block relative"
              onMouseEnter={() => setAccountHovered(true)}
              onMouseLeave={() => setAccountHovered(false)}
            >
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition group cursor-pointer">
                <User className="w-5 h-5 text-gray-700 group-hover:text-yellow-600 transition" />
              </button>

              <AnimatePresence>
                {accountHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full pt-2 z-50"
                  >
                    {/* Invisible bridge to prevent hover gap */}
                    <div className="absolute -top-2 left-0 right-0 h-2" />
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-44">
                      {isAuthenticated ? (
                        <>
                          <Link
                            href="/dashboard/user"
                            className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <div className="h-px bg-gray-100 mx-3" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/auth/login"
                            className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition"
                          >
                            <LogIn className="w-4 h-4" />
                            Login
                          </Link>
                          <div className="h-px bg-gray-100 mx-3" />
                          <Link
                            href="/auth/register"
                            className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition"
                          >
                            <UserPlus className="w-4 h-4" />
                            Sign Up
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CART */}
            <div className="relative">
              {/* Desktop cart button */}
              <button
                onClick={() => {
                  if (!isCartPage) setCartPreviewOpen(!cartPreviewOpen);
                }}
                className="relative text-2xl cursor-pointer hidden md:block group"
              >
                <ShoppingBag className="text-black" size={24} />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
                <span className="absolute left-0 -bottom-2 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
              </button>

              {/* Mobile cart button */}
              <button
                onClick={() => {
                  if (!isCartPage) setCartPreviewOpen(!cartPreviewOpen);
                }}
                className="relative text-2xl cursor-pointer md:hidden text-black block"
              >
                <ShoppingBag size={24} />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </button>

              {/* Mini cart preview dropdown */}
              <AnimatePresence>
                {cartPreviewOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed md:absolute right-0 left-0 md:left-auto top-auto md:top-full mt-2 md:mt-4 w-full md:w-[380px] max-h-[80vh] md:max-h-[500px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden mx-auto md:mx-0"
                    style={{ bottom: "auto", top: "70px" }}
                  >
                    <div className="sticky top-0 p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                      <h3 className="font-bold text-gray-900">
                        Your Cart{" "}
                        <span className="text-yellow-500">
                          ({cartItemCount})
                        </span>
                      </h3>
                      <button
                        onClick={() => setCartPreviewOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition p-1"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div
                      className="overflow-y-auto p-4 space-y-4"
                      style={{ maxHeight: "calc(80vh - 160px)" }}
                    >
                      {items.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          Your cart is empty
                        </div>
                      ) : (
                        items.map((item, idx) => (
                          <div
                            key={`${item.id}-${idx}`}
                            className="flex gap-3 items-start"
                          >
                            <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 bg-gray-100">
                              <Image
                                src={item.image || "/assets/homeImg1.jpg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 break-words leading-tight">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.quantity} × ${item.price.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-yellow-600 whitespace-nowrap">
                                ₦{(item.quantity * item.price).toLocaleString()}
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-300 hover:text-red-500 transition mt-2 p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {items.length > 0 && (
                      <div className="sticky bottom-0 p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                        <div className="flex justify-between items-center font-bold text-gray-900 text-sm">
                          <span>Subtotal:</span>
                          <span className="text-yellow-600">
                            ₦{subtotal.toLocaleString()}
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
                            href="/checkout"
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

            {/* HAMBURGER */}
            <button
              className="md:hidden flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] p-2"
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
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1 border-t">
                {/* nav links */}
                {navItems.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 last:border-none"
                  >
                    {item.name === "Account" ? (
                      // Account item — toggle Login + Register buttons on click
                      <>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() =>
                              setMobileExpanded(
                                mobileExpanded === index ? null : index,
                              )
                            }
                            className="py-2.5 text-sm text-gray-800 text-left w-full"
                          >
                            {item.name}
                          </button>
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
                        </div>

                        <AnimatePresence>
                          {mobileExpanded === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pb-3 flex gap-3">
                                {isAuthenticated ? (
                                  <>
                                    <Link
                                      href="/dashboard/user"
                                      onClick={() => setMobileOpen(false)}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-sm rounded-lg transition"
                                    >
                                      <LayoutDashboard className="w-4 h-4" />
                                      Dashboard
                                    </Link>
                                    <button
                                      onClick={handleLogout}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-600 font-semibold text-sm rounded-lg transition"
                                    >
                                      <LogOut className="w-4 h-4" />
                                      Logout
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <Link
                                      href="/auth/login"
                                      onClick={() => setMobileOpen(false)}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 hover:border-yellow-500 text-gray-700 font-semibold text-sm rounded-lg transition"
                                    >
                                      <LogIn className="w-4 h-4" />
                                      Login
                                    </Link>
                                    <Link
                                      href="/auth/register"
                                      onClick={() => setMobileOpen(false)}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm rounded-lg transition"
                                    >
                                      <UserPlus className="w-4 h-4" />
                                      Register
                                    </Link>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      // All other nav items — normal behaviour
                      <>
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
                      </>
                    )}
                  </div>
                ))}

                {/* Mobile bottom actions */}
                <div className="pt-4">
                  <Link
                    href="/reservation"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center px-5 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-base rounded-lg transition"
                  >
                    Reservation
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
    {modal}
    </>
  );
}
