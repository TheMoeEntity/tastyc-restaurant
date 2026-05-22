"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  UtensilsCrossed,
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
  CheckCircle,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import apiFetch from "@/lib/api";

//

// ── Types matching GET /api/menu response ──
interface MenuVariant {
  id: string;
  name: string;
  price: number;
}

interface MenuItemAPI {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: { id: string; name: string } | string;
  spicy?: boolean;
  veg?: boolean;
  popular?: boolean;
  variants?: MenuVariant[];
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItemAPI[];
}

interface CartEntry {
  item: MenuItemAPI;
  variantId?: string;
  quantity: number;
}

interface PlacedOrder {
  id: string;
  orderNumber: string;
  items: { name: string; quantity: number }[];
}

type PageState =
  | "validating"
  | "invalid"
  | "menu"
  | "placing"
  | "success"
  | "error";

export default function TableClient() {
  const params = useParams();
  const searchParams = useSearchParams()
  const tableNumber = params.tableNumber as string;
  const token = searchParams.get("token") ?? "";

  const [pageState, setPageState] = useState<PageState>("validating");
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [notes, setNotes] = useState("");
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1: validate token
  useEffect(() => {
    if (!token) return; // wait for token to be read from URL
    if (token === "") {
      setPageState("invalid");
      return;
    }

    apiFetch<any>(`/api/qr/validate`, {
      data: { token },
      method: "POST"
    })
      .then((r) => {

        if (!r.success) throw new Error("invalid");
        return apiFetch<any>(`/api/menu`);
      })
      .then((r) => {
        // API returns { success: true, data: { items: [...], pagination: {...} } }
        const items = r.data?.items ?? [];
        const cats = buildCategories(items);
        setCategories(cats);
        setPageState("menu");
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "";
        if (msg === "invalid") {
          setPageState("invalid");
        } else {
          setErrorMsg(msg || "Could not load menu. Please try again.");
          setPageState("error");
        }
      });
  }, [token]);

  function buildCategories(flat: MenuItemAPI[]): MenuCategory[] {
    const map = new Map<string, MenuItemAPI[]>();
    for (const item of flat) {
      // Handle category as either a string or an object with a name property
      const catName = typeof item.category === 'object' && item.category !== null
        ? (item.category as any).name
        : (item.category as string) ?? "Other";

      if (!map.has(catName)) map.set(catName, []);
      map.get(catName)!.push(item);
    }
    return Array.from(map.entries()).map(([name, items]) => ({
      id: name.toLowerCase(),
      name,
      items,
    }));
  }

  const allItems: MenuItemAPI[] = categories.flatMap((c) => c.items);
  const displayedItems =
    activeCategory === "all"
      ? allItems
      : (categories.find((c) => c.id === activeCategory)?.items ?? []);

  const getQty = (id: string) =>
    cart.find((e) => e.item.id === id)?.quantity ?? 0;

  const addItem = (item: MenuItemAPI) => {
    setCart((prev) => {
      const existing = prev.find((e) => e.item.id === item.id);
      if (existing)
        return prev.map((e) =>
          e.item.id === item.id ? { ...e, quantity: e.quantity + 1 } : e,
        );
      return [...prev, { item, quantity: 1 }];
    });
    toast.success(`${item.name} added`);
  };

  const decItem = (id: string) => {
    setCart((prev) =>
      prev
        .map((e) => (e.item.id === id ? { ...e, quantity: e.quantity - 1 } : e))
        .filter((e) => e.quantity > 0),
    );
  };

  const totalItems = cart.reduce((s, e) => s + e.quantity, 0);
  const subtotal = cart.reduce((s, e) => s + e.item.price * e.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setPageState("placing");

    try {
      const res = await apiFetch<any>(`/api/orders/qr`, {
        method: "POST",
        data: {
          tableToken: token,
          idempotencyKey: crypto.randomUUID(),
          items: cart.map((e) => ({
            menuItemId: e.item.id,
            variantId: e.variantId,
            quantity: e.quantity,
          })),
          notes: notes.trim() || undefined,
        },
      });

      if (!res.success) throw new Error(res.message ?? "Failed to place order");

      setPlacedOrder(res.data);
      setCart([]);
      setPageState("success");
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setPageState("error");
    }
  };

  // ── States ──

  if (pageState === "validating") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-50 border-4 border-yellow-200 rounded-full flex items-center justify-center mx-auto mb-5">
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

  if (pageState === "invalid") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">
            QR Code Expired
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            This QR code has expired. Please ask staff to generate a new one.
          </p>
          <Link
            href="/menu"
            className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
          >
            Browse Menu Instead <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (pageState === "success" && placedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-gray-900 mb-1">
            Order Placed!
          </h1>
          <p className="text-gray-500 text-sm mb-2">
            The kitchen has been notified.
          </p>
          <p className="text-yellow-600 font-bold mb-5">
            Order #{placedOrder.orderNumber ?? placedOrder.id}
          </p>

          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              Items Ordered
            </p>
            {(placedOrder.items ?? []).map((it, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm text-gray-600"
              >
                <span>{it.name}</span>
                <span className="font-semibold">× {it.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <Receipt className="w-4 h-4 text-blue-500 shrink-0" />
            Sit back and relax — your food is being prepared!
          </div>
        </div>
      </div>
    );
  }

  // ── Menu view ──
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 sticky top-0 z-30 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold font-serif text-white text-lg">
                  Table {tableNumber}
                </span>
                <ShieldCheck className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-gray-400 text-xs">Dine-in · Scan & Order</p>
            </div>
          </div>

          {totalItems > 0 && (
            <button
              onClick={() =>
                document
                  .getElementById("cart-bar")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2.5 rounded-xl transition text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems} · ${subtotal.toLocaleString()}
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition ${activeCategory === "all" ? "bg-yellow-500 text-black" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition ${activeCategory === cat.id ? "bg-yellow-500 text-black" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-40">
          {displayedItems.map((item) => {
            const qty = getQty(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg hover:border-yellow-300 transition-all"
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
                        <Star className="w-2.5 h-2.5 fill-black" /> Popular
                      </span>
                    )}
                    {item.spicy && (
                      <span className="flex items-center gap-0.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <Flame className="w-2.5 h-2.5" /> Spicy
                      </span>
                    )}
                    {item.veg && (
                      <span className="flex items-center gap-0.5 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <Leaf className="w-2.5 h-2.5" /> Veg
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {item.name}
                    </h3>
                    <span className="font-black text-yellow-600 text-sm shrink-0">
                      ${item.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  {qty === 0 ? (
                    <button
                      onClick={() => addItem(item)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-sm"
                    >
                      <Plus className="w-4 h-4" /> Add to Order
                    </button>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decItem(item.id)}
                          className="w-8 h-8 rounded-full border border-gray-200 hover:border-yellow-500 flex items-center justify-center transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-gray-900 w-6 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => addItem(item)}
                          className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold text-yellow-600 text-sm">
                        ${(item.price * qty).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky cart / checkout bar */}
      {totalItems > 0 && (
        <div
          id="cart-bar"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl p-4"
        >
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Cart summary */}
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {cart.map((entry) => (
                <div
                  key={entry.item.id}
                  className="flex items-center justify-between text-sm text-gray-600"
                >
                  <span className="truncate flex-1">{entry.item.name}</span>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => decItem(entry.item.id)}
                      className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="font-bold w-4 text-center">
                      {entry.quantity}
                    </span>
                    <button
                      onClick={() => addItem(entry.item)}
                      className="w-5 h-5 rounded-full bg-yellow-500 text-black flex items-center justify-center"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                    <span className="text-yellow-600 font-bold w-14 text-right">
                      ${(entry.item.price * entry.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <input
              type="text"
              placeholder="Any notes? (allergies, preferences…)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition"
            />

            {/* Place order */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-400">
                  {totalItems} {totalItems === 1 ? "item" : "items"} · Table{" "}
                  {tableNumber}
                </p>
                <p className="font-black text-gray-900">
                  ${subtotal.toLocaleString()}{" "}
                  <span className="text-xs font-normal text-gray-400">
                    + tax
                  </span>
                </p>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={pageState === "placing"}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-lg disabled:opacity-50"
              >
                {pageState === "placing" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Placing…
                  </>
                ) : (
                  <>
                    Place Order <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
