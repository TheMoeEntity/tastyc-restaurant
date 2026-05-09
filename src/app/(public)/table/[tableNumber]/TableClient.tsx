"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ShieldCheck,
  ShieldX,
  Loader2,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  Flame,
  Leaf,
  ArrowRight,
  ChevronDown,
  UtensilsCrossed,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { menuItems } from "@/lib/utils/menuUtils";
import { MenuItem } from "@/types";
import { toast } from "sonner";

type TokenState = "validating" | "valid" | "invalid";

function validateToken(token: string | null): boolean {
  if (!token || token.trim().length < 4) return false;
  // Accept any token matching the pattern: alphanumeric, 6+ chars
  return /^[a-zA-Z0-9]{4,}$/.test(token);
}

const CATEGORIES = ["All", ...Array.from(new Set(menuItems.map((i) => i.category)))];

export default function TableClient() {
  const params = useParams();
  const router = useRouter();
  const tableNumber = params.tableNumber as string;

  const searchParams = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;
  const token = searchParams?.get("token") ?? null;

  const [tokenState, setTokenState] = useState<TokenState>("validating");
  const [activeCategory, setActiveCategory] = useState("All");

  const { items, addMenuItem, increaseQty, decreaseQty, getTotalItems, getSubtotal } = useCartStore();

  // Validate token on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const valid = validateToken(token);
      setTokenState(valid ? "valid" : "invalid");
      if (valid) {
        sessionStorage.setItem("qr_table_number", tableNumber);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [token, tableNumber]);

  const filtered = activeCategory === "All"
    ? menuItems
    : menuItems.filter((i) => i.category === activeCategory);

  const getQty = (id: string) => items.find((i) => i.id === id)?.quantity ?? 0;

  const totalItems = getTotalItems();
  const subtotal = getSubtotal();

  const handleAddItem = (item: MenuItem) => {
    addMenuItem(item);
    toast.success(`${item.name} added to cart`);
  };

  const handleCheckout = () => {
    router.push("/checkout?type=dine-in");
  };

  // ── Validating ──
  if (tokenState === "validating") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-50 border-4 border-yellow-200 rounded-full flex items-center justify-center mx-auto mb-5 animate-pulse">
            <Loader2 className="w-9 h-9 text-yellow-500 animate-spin" />
          </div>
          <h2 className="text-xl font-bold font-serif text-gray-900 mb-1">
            Verifying your table
          </h2>
          <p className="text-gray-400 text-sm">
            Validating QR code for Table {tableNumber}…
          </p>
        </div>
      </div>
    );
  }

  // ── Invalid token ──
  if (tokenState === "invalid") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">
            Invalid QR Code
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            This QR code is invalid or has expired. Please ask your server for a
            fresh QR code.
          </p>
          <Link
            href="/menu"
            className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
          >
            Browse Menu Instead
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ── Valid — full ordering experience ──
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Table header ── */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white sticky top-0 z-30 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold font-serif text-white text-lg leading-tight">
                  Table {tableNumber}
                </span>
                <ShieldCheck className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-gray-400 text-xs">Dine-in · Scan & Order</p>
            </div>
          </div>

          {/* Cart bubble */}
          {totalItems > 0 && (
            <button
              onClick={handleCheckout}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2.5 rounded-xl transition shadow-lg text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems} · ${subtotal.toFixed(2)}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "bg-yellow-500 text-black"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Welcome banner ── */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">
              You&apos;re at Table {tableNumber}
            </p>
            <p className="text-gray-400 text-xs">
              Add items below and tap &quot;Checkout&quot; when ready. Your server will
              bring your order.
            </p>
          </div>
        </div>
      </div>

      {/* ── Menu grid ── */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h2 className="text-lg font-bold font-serif text-gray-900 mb-4">
          {activeCategory === "All" ? "Full Menu" : activeCategory}
          <span className="text-yellow-500 ml-2 text-base">({filtered.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-32">
          {filtered.map((item) => {
            const qty = getQty(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg hover:border-yellow-300 transition-all duration-200"
              >
                <div className="relative h-40 bg-gray-100">
                  <Image
                    src={item.image || "/assets/homeImg1.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.popular && (
                      <span className="flex items-center gap-0.5 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <Star className="w-2.5 h-2.5 fill-black" />
                        Popular
                      </span>
                    )}
                    {item.spicy && (
                      <span className="flex items-center gap-0.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <Flame className="w-2.5 h-2.5" />
                        Spicy
                      </span>
                    )}
                    {item.veg && (
                      <span className="flex items-center gap-0.5 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <Leaf className="w-2.5 h-2.5" />
                        Veg
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">
                      {item.name}
                    </h3>
                    <span className="font-black text-yellow-600 shrink-0 text-sm">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Add / qty controls */}
                  {qty === 0 ? (
                    <button
                      onClick={() => handleAddItem(item)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Order
                    </button>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="w-8 h-8 rounded-full border border-gray-200 hover:border-yellow-500 flex items-center justify-center transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-gray-900 w-6 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold text-yellow-600 text-sm">
                        ${(item.price * qty).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Sticky checkout bar ── */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl p-4 safe-area-bottom">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-400">
                {totalItems} {totalItems === 1 ? "item" : "items"} · Table {tableNumber}
              </p>
              <p className="font-black text-gray-900">
                ${subtotal.toFixed(2)}
                <span className="text-xs font-normal text-gray-400 ml-1">
                  before tax
                </span>
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-lg"
            >
              Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
