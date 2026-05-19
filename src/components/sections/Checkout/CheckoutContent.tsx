"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Truck,
  Package,
  MapPin,
  Home,
  ChevronRight,
  ArrowLeft,
  Tag,
  AlertCircle,
  Flame,
  Leaf,
  Star,
  Loader2,
  Lock,
  Gift,
  StickyNote,
  CreditCard,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import apiFetch from "@/lib/api";

//

type OrderType = "DELIVERY" | "PICKUP";

function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart, getTotalItems, getSubtotal } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>("PICKUP");

  // Delivery address
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Order options
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [notes, setNotes] = useState("");

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const subtotal = getSubtotal();
  const deliveryFee = orderType === "DELIVERY" ? 1000 : 0;
  const total = subtotal + deliveryFee;
  const totalItems = getTotalItems();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && items.length === 0) router.push("/cart");
  }, [mounted, items.length, router]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (orderType === "DELIVERY") {
      if (!street.trim()) errs.street = "Street address is required";
      if (!city.trim()) errs.city = "City is required";
      if (!state.trim()) errs.state = "State is required";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    setError("");
    if (!validate()) return;
    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        type: orderType,
        idempotencyKey: crypto.randomUUID(),
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        notes: notes.trim() || undefined,
        pointsToRedeem: pointsToRedeem > 0 ? pointsToRedeem : undefined,
      };

      if (orderType === "DELIVERY") {
        payload.address = {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
        };
      }

      // 1. Place order
      const orderRes = await apiFetch<any>(`/api/orders`, {
        method: "POST",
        data: payload,
      });

      if (!orderRes.success)
        throw new Error(orderRes.message ?? "Failed to place order");

      const orderId: string = orderRes.data.order.id;

      // 2. Initiate payment
      const payRes = await apiFetch<any>(`/api/payments/initiate/${orderId}`, {
        method: "POST",
        data: payload,
      });

      if (!payRes.success)
        throw new Error(payRes.message ?? "Failed to initiate payment");

      clearCart();
      window.location.href = payRes.data.authorizationUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 xl:px-12">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="h-36 bg-gray-100 rounded-xl" />
              <div className="h-52 bg-gray-100 rounded-xl" />
            </div>
            <div className="lg:col-span-2 h-96 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 xl:px-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-600 transition">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/cart" className="hover:text-gray-600 transition">
          Cart
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Checkout</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── LEFT: Form ── */}
        <div className="lg:col-span-3 space-y-5">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-900">
            Checkout
          </h1>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* 1 · Order Type */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-black text-xs font-black rounded-full flex items-center justify-center shrink-0">
                1
              </span>
              Order Type
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  {
                    type: "PICKUP" as const,
                    icon: Package,
                    label: "Pickup",
                    sub: "Collect from restaurant",
                  },
                  {
                    type: "DELIVERY" as const,
                    icon: Truck,
                    label: "Delivery",
                    sub: "+₦1000 delivery fee",
                  },
                ] as const
              ).map(({ type, icon: Icon, label, sub }) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`py-4 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 flex items-center gap-3 ₦{
                    orderType === type
                      ? "border-yellow-400 bg-yellow-50 text-yellow-700 shadow-lg shadow-yellow-100"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-yellow-300 hover:bg-white"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ₦{orderType === type ? "bg-yellow-100" : "bg-gray-100"}`}
                  >
                    <Icon
                      className={`w-5 h-5 ₦{orderType === type ? "text-yellow-600" : "text-gray-400"}`}
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{label}</p>
                    <p className="text-xs font-normal text-gray-400">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 2 · Delivery Address (conditional) */}
          {orderType === "DELIVERY" && (
            <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 text-black text-xs font-black rounded-full flex items-center justify-center shrink-0">
                  2
                </span>
                Delivery Address
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Street address *"
                      value={street}
                      onChange={(e) => {
                        setStreet(e.target.value);
                        setFieldErrors((p) => ({ ...p, street: "" }));
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition ₦{fieldErrors.street ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    />
                  </div>
                  {fieldErrors.street && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {fieldErrors.street}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="City *"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          setFieldErrors((p) => ({ ...p, city: "" }));
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition ₦{fieldErrors.city ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                      />
                    </div>
                    {fieldErrors.city && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {fieldErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="State *"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setFieldErrors((p) => ({ ...p, state: "" }));
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition ₦{fieldErrors.state ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    />
                    {fieldErrors.state && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {fieldErrors.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 3 · Loyalty Points */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-100 text-gray-500 text-xs font-black rounded-full flex items-center justify-center shrink-0">
                {orderType === "DELIVERY" ? "3" : "2"}
              </span>
              Loyalty Points
              <span className="text-xs font-normal text-gray-400 ml-1">
                (Optional)
              </span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="number"
                  min={0}
                  placeholder="Points to redeem (0)"
                  value={pointsToRedeem || ""}
                  onChange={(e) =>
                    setPointsToRedeem(
                      Math.max(0, parseInt(e.target.value) || 0),
                    )
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition"
                />
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              Each point is worth ₦0.01. Points are deducted from your total at
              checkout.
            </p>
          </section>

          {/* 4 · Notes */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-100 text-gray-500 text-xs font-black rounded-full flex items-center justify-center shrink-0">
                {orderType === "DELIVERY" ? "4" : "3"}
              </span>
              Order Notes
              <span className="text-xs font-normal text-gray-400 ml-1">
                (Optional)
              </span>
            </h2>
            <div className="relative">
              <StickyNote className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <textarea
                placeholder="Allergies, preferences, or special requests..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition resize-none"
              />
            </div>
          </section>

          <div className="lg:hidden pb-2">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-700 font-semibold transition text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to cart
            </Link>
          </div>
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-8 space-y-4">
            {/* Cart items */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-lg">Your Order</h2>
                <Link
                  href="/cart"
                  className="text-xs text-yellow-500 hover:text-yellow-700 font-semibold transition flex items-center gap-1"
                >
                  Edit <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={item.image || "/assets/homeImg1.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {item.spicy && (
                          <Flame className="w-3 h-3 text-red-500" />
                        )}
                        {item.veg && (
                          <Leaf className="w-3 h-3 text-green-600" />
                        )}
                        {item.popular && (
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        )}
                        <span className="text-xs text-gray-400">
                          × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <p className="font-bold text-yellow-600 text-sm shrink-0">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown + CTA */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
                Order Total
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"}
                    )
                  </span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                {orderType === "DELIVERY" && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₦{deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                {/* <div className="flex justify-between text-gray-600">
                  <span>Tax (7.5%)</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div> */}
                {pointsToRedeem > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Points Redeemed</span>
                    <span>-{(pointsToRedeem * 0.01).toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-base">
                  <span>Total</span>
                  <span className="text-yellow-600">
                    ₦
                    {Math.max(
                      0,
                      total - pointsToRedeem * 0.01,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-5 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Continue to Payment · ₦
                    {Math.max(
                      0,
                      total - pointsToRedeem * 0.01,
                    ).toLocaleString()}
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 justify-center mt-3 text-xs text-gray-400">
                <CreditCard className="w-3.5 h-3.5" />
                Secured by Paystack
              </div>

              <Link
                href="/cart"
                className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 text-gray-400 hover:text-gray-600 text-sm font-medium transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to cart
              </Link>
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 hidden lg:block">
              <div className="space-y-2.5">
                {[
                  { icon: Lock, text: "Payments secured by Paystack" },
                  { icon: Tag, text: "Transparent pricing, no hidden fees" },
                  {
                    icon: ShoppingBag,
                    text: "Order confirmation sent by email",
                  },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <div className="w-7 h-7 bg-yellow-50 rounded-full flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-yellow-500" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutContent() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse h-96 bg-gray-100 rounded-xl" />
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
