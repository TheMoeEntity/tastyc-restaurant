"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

const navItems = [
  {
    name: "Home",
    href: "/",
    dropdown: null,
  },
  {
    name: "About",
    href: "/about",
    dropdown: null,
  },
  {
    name: "Menu",
    href: "/menu",
    dropdown: null,
  },
  {
    name: "Order",
    href: "/order",
    dropdown: [
      { label: "Online Order", href: "/order" },
      { label: "Track Order",  href: "/order/track" },
      { label: "Offers",       href: "/order/offers" },
      { label: "Cart",         href: "/cart" },
      { label: "Checkout",     href: "/checkout" },
    ],
  },
  {
    name: "Pages",
    href: "/gallery",
    dropdown: [
      { label: "Gallery",      href: "/gallery" },
      { label: "Pricing",      href: "/pricing" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "404",          href: "/404" },
      { label: "Coming Soon",  href: "/coming-soon" },
    ],
  },
  {
    name: "Blog",
    href: "/blog",
    dropdown: [
      { label: "Blog Grid",   href: "/blog" },
      { label: "Blog List",   href: "/blog/list" },
      { label: "Single Post", href: "/blog/post" },
      { label: "Categories",  href: "/blog/categories" },
      { label: "Authors",     href: "/blog/authors" },
    ],
  },
  {
    name: "Contact",
    href: "/contact",
    dropdown: [
      { label: "Contact Us", href: "/contact" },
      { label: "Support",    href: "/contact/support" },
      { label: "Locations",  href: "/contact/locations" },
      { label: "Email",      href: "/contact/email" },
      { label: "Call",       href: "/contact/call" },
    ],
  },
  {
    name: "Shop",
    href: "/shop",
    dropdown: [
      { label: "All Products", href: "/shop" },
      { label: "Cart",         href: "/cart" },
      { label: "Checkout",     href: "/checkout" },
      { label: "Wishlist",     href: "/shop/wishlist" },
      { label: "Deals",        href: "/shop/deals" },
    ],
  },
]

type HeaderProps = {
  cartCount?: number
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<number | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null)
  const [cartItemCount, setCartItemCount] = useState(cartCount)

  // Listen for cart updates from localStorage or custom events
  useEffect(() => {
    // Update cart count from localStorage
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart)
          const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
          setCartItemCount(totalItems)
        } catch (e) {
          console.error("Error parsing cart:", e)
        }
      } else {
        setCartItemCount(0)
      }
    }

    // Initial load
    updateCartCount()

    // Listen for storage events (when cart changes in another tab)
    window.addEventListener("storage", updateCartCount)

    // Listen for custom cart update event
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  // Also update when prop changes
  useEffect(() => {
    setCartItemCount(cartCount)
  }, [cartCount])

  return (
    <header className=" w-full flex justify-center mt-4">
      <div className="w-[98%] max-w-screen-2xl bg-white border border-gray-200 rounded-xl shadow-sm">

        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-5">

          {/* logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <h1 className="text-3xl md:text-5xl font-bold text-black">Tastyc</h1>
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
                  className="relative flex items-center gap-1 text-xl text-gray-800 pb-2"
                >
                  {item.name}
                  {item.dropdown && (
                    <span className={`text-sm text-yellow-500 transition-opacity duration-150 ${activeNav === index ? "opacity-100" : "opacity-0"}`}>
                      ▾
                    </span>
                  )}
                  <span className={`absolute bottom-0 left-0 w-full h-1 bg-yellow-500 rounded-full transition-opacity duration-200 ${activeNav === index ? "opacity-100" : "opacity-0"}`} />
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
            <Link href="/cart" className="relative text-2xl cursor-pointer hidden md:block group">
              🛒
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
              <span className="absolute left-0 -bottom-2 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* cart - mobile */}
            <Link href="/cart" className="relative text-2xl cursor-pointer md:hidden">
              🛒
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* hamburger */}
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

        {/* mobile menu */}
        {mobileOpen && (
          <div className="md:hidden px-4 py-4 space-y-1 border-t">
            {navItems.map((item, index) => (
              <div key={index} className="border-b border-gray-100 last:border-none">
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
                      onClick={() => setMobileExpanded(mobileExpanded === index ? null : index)}
                      className="py-2.5 px-2 text-yellow-500 text-base"
                    >
                      {mobileExpanded === index ? "▴" : "▾"}
                    </button>
                  )}
                </div>

                {mobileExpanded === index && item.dropdown && (
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
                )}
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
              <Link href="/cart" className="relative text-2xl cursor-pointer">
                🛒
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  )
}