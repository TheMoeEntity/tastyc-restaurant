"use client"

import Link from "next/link"
import { useState } from "react"

const navItems = [
  {
    name: "Home",
    href: "/",
    dropdown: [
      { label: "Home 1", href: "/" },
      { label: "Home 2", href: "/home-2" },
      { label: "Home 3", href: "/home-3" },
      { label: "Home 4", href: "/home-4" },
      { label: "Home 5", href: "/home-5" },
    ],
  },
  {
    name: "About",
    href: "/about",
    dropdown: [
      { label: "Our Story", href: "/about" },
      { label: "Team",      href: "/about/team" },
      { label: "Careers",   href: "/about/careers" },
      { label: "Mission",   href: "/about/mission" },
      { label: "FAQ",       href: "/about/faq" },
    ],
  },
  {
    name: "Menu",
    href: "/menu",
    dropdown: [
      { label: "All Dishes",        href: "/menu" },
      { label: "Dishes",            href: "/menu?tab=Dishes" },
      { label: "Desserts",          href: "/menu?tab=Desserts" },
      { label: "Drinks",            href: "/menu?tab=Drinks" },
      { label: "Special Proposals", href: "/menu#special" },
    ],
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

  return (
    <header className="w-full flex justify-center mt-4">
      <div className="w-[98%] max-w-screen-2xl bg-white border border-gray-200 rounded-xl shadow-sm">

        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-5">

          {/* logo - also links home */}
          <Link href="/" className="flex flex-col leading-tight font-mono">
            <h1 className="text-3xl md:text-5xl font-bold text-black">Tastyc</h1>
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
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-12 font-bold">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setActiveNav(index)}
                onMouseLeave={() => setActiveNav(null)}
              >
                {/* nav label - links to main page on click, dropdown on hover */}
                <Link
                  href={item.href}
                  className="relative flex items-center gap-1 text-xl font-semibold text-gray-800 font-mono pb-2"
                >
                  {item.name}
                  <span className={`text-sm text-yellow-500 transition-opacity duration-150 ${activeNav === index ? "opacity-100" : "opacity-0"}`}>
                    ▾
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-1 bg-yellow-500 rounded-full transition-opacity duration-200 ${activeNav === index ? "opacity-100" : "opacity-0"}`} />
                </Link>

                {/* invisible bridge so mouse can reach dropdown */}
                {activeNav === index && (
                  <div className="absolute left-0 top-full w-56 h-4 z-40" />
                )}

                {activeNav === index && item.dropdown && (
                  <div className="absolute left-0 top-full pt-4 z-50">
                    <div className="flex flex-col bg-yellow-400 p-3 rounded-lg shadow-xl w-56">
                      {item.dropdown.map((drop, i) => (
                        <Link
                          key={i}
                          href={drop.href}
                          className="px-3 py-2 text-black font-bold text-sm transition-all hover:bg-white rounded"
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

            {/* reservation button */}
            <Link
              href="/reservation"
              className="hidden md:inline-flex items-center px-7 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold font-mono text-base rounded-lg transition"
            >
              Reservation
            </Link>

            {/* cart with badge - desktop */}
            <Link href="/cart" className="relative text-2xl cursor-pointer hidden md:block group">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
              <span className="absolute left-0 -bottom-2 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* cart with badge - mobile (sits next to hamburger) */}
            <Link href="/cart" className="relative text-2xl cursor-pointer md:hidden">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* mobile hamburger */}
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
          <div className="md:hidden px-4 py-4 space-y-1 border-t font-mono">
            {navItems.map((item, index) => (
              <div key={index} className="border-b border-gray-100 last:border-none">
                <div className="flex items-center justify-between">
                  {/* clicking the name goes to its main page */}
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 text-sm font-semibold text-gray-800 font-mono"
                  >
                    {item.name}
                  </Link>
                  {/* arrow toggles sub-items */}
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === index ? null : index)}
                    className="py-2.5 px-2 text-yellow-500 text-base"
                  >
                    {mobileExpanded === index ? "▴" : "▾"}
                  </button>
                </div>

                {mobileExpanded === index && (
                  <div className="pb-3 flex flex-col gap-0.5 pl-2">
                    {item.dropdown.map((drop, i) => (
                      <Link
                        key={i}
                        href={drop.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-2 px-2 text-xs font-bold text-gray-700 hover:bg-white hover:text-black rounded transition-all w-fit"
                      >
                        {drop.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* reservation + cart at bottom */}
            <div className="pt-3 flex items-center justify-between">
              <Link
                href="/reservation"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold font-mono text-base rounded-lg transition"
              >
                Reservation
              </Link>
              <Link href="/cart" className="relative text-2xl cursor-pointer">
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
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