"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart, Trash2, Plus, Minus, ChevronRight,
  ArrowLeft, Tag, Flame, Leaf, Star, Package,
  MapPin, Clock, CreditCard,
} from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  spicy?: boolean;
  popular?: boolean;
  veg?: boolean;
  image?: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [orderType, setOrderType] = useState<"dine-in" | "takeout" | "delivery">("dine-in");

  useEffect(() => {
    const loadCart = () => {
      const stored = localStorage.getItem("cart");
      setCart(stored ? JSON.parse(stored) : []);
    };
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const saveCart = (updated: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    setCart(updated);
  };

  const increaseQty = (id: string) => {
    saveCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQty = (id: string) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (item.quantity === 1) {
      removeItem(id);
    } else {
      saveCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
    }
  };

  const removeItem = (id: string) => {
    saveCart(cart.filter(i => i.id !== id));
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
    setCart([]);
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "TASTYC10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try TASTYC10.");
      setPromoApplied(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const deliveryFee = orderType === "delivery" ? 3.99 : 0;
  const tax = (subtotal - discount) * 0.075;
  const total = subtotal - discount + deliveryFee + tax;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.70), rgba(0,0,0,0.80)), url(/assets/homeImg2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center px-6">
          <MotionWrapper variant="fade-up">
            <div className="flex justify-center mb-3">
              <div className="bg-yellow-500/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-white leading-tight">
              Your <span className="text-yellow-500">Order</span>
            </h1>
            <p className="text-white mt-3 text-base sm:text-lg">
              Review your selections before placing your order.
            </p>
          </MotionWrapper>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20 py-16">

        {cart.length === 0 ? (

          /* EMPTY STATE */
          <MotionWrapper variant="fade-up" className="text-center py-24">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything yet. Head back to the menu and explore our dishes.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Menu
            </Link>
          </MotionWrapper>

        ) : (

          <div className="flex flex-col lg:flex-row gap-10">

            {/* LEFT — CART ITEMS */}
            <div className="flex-1">

              {/* ORDER TYPE */}
              <MotionWrapper variant="fade-up" className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Type</h2>
                <div className="grid grid-cols-3 gap-3">
                  {(["dine-in", "takeout", "delivery"] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold capitalize transition-all duration-200 flex flex-col items-center gap-1 ${
                        orderType === type
                          ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-yellow-300"
                      }`}
                    >
                      {type === "dine-in" && <MapPin className="w-4 h-4" />}
                      {type === "takeout" && <Package className="w-4 h-4" />}
                      {type === "delivery" && <Clock className="w-4 h-4" />}
                      {type}
                      {type === "delivery" && <span className="text-xs text-gray-400">+$3.99</span>}
                    </button>
                  ))}
                </div>
              </MotionWrapper>

              {/* ITEMS HEADER */}
              <MotionWrapper variant="fade-up" delay={100} className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Cart Items <span className="text-yellow-500">({totalItems})</span>
                </h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              </MotionWrapper>

              {/* ITEMS LIST */}
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <MotionWrapper key={item.id} variant="fade-up" delay={idx * 80}>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-start">

                      {/* IMAGE */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {item.popular && (
                          <div className="absolute top-1 left-1 bg-yellow-500 rounded-full p-0.5">
                            <Star className="w-2.5 h-2.5 fill-black text-black" />
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base leading-tight">{item.name}</h3>
                            <p className="text-gray-400 text-xs mt-0.5">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-300 hover:text-red-500 transition shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-gray-500 text-xs leading-relaxed mt-1 line-clamp-1">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5">
                          {item.spicy && (
                            <span className="flex items-center gap-0.5 text-xs text-red-500 font-medium">
                              <Flame className="w-3 h-3" /> Spicy
                            </span>
                          )}
                          {item.veg && (
                            <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium">
                              <Leaf className="w-3 h-3" /> Veg
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* QTY CONTROLS */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className="w-7 h-7 rounded-full border border-gray-200 hover:border-yellow-500 hover:text-yellow-600 flex items-center justify-center transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-gray-900 w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => increaseQty(item.id)}
                              className="w-7 h-7 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* PRICE */}
                          <div className="text-right">
                            <p className="font-black text-yellow-600 text-base">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-400">${item.price} each</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </MotionWrapper>
                ))}
              </div>

              {/* BACK TO MENU */}
              <MotionWrapper variant="fade-up" delay={100} className="mt-8">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Add more items
                </Link>
              </MotionWrapper>
            </div>

            {/* RIGHT — ORDER SUMMARY */}
            <div className="lg:w-96 shrink-0">
              <div className="sticky top-24 space-y-4">

                {/* PROMO CODE */}
                <MotionWrapper variant="fade-left" delay={200}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-yellow-500" />
                      Promo Code
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 transition"
                      />
                      <button
                        onClick={applyPromo}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-lg transition"
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-green-600 text-xs mt-2 font-medium">✓ 10% discount applied!</p>
                    )}
                    {promoError && (
                      <p className="text-red-500 text-xs mt-2">{promoError}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-2">Try: TASTYC10 for 10% off</p>
                  </div>
                </MotionWrapper>

                {/* ORDER SUMMARY */}
                <MotionWrapper variant="fade-left" delay={300}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Summary</h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({totalItems} items)</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>

                      {promoApplied && (
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Discount (10%)</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}

                      {orderType === "delivery" && (
                        <div className="flex justify-between text-gray-600">
                          <span>Delivery Fee</span>
                          <span>${deliveryFee.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-gray-600">
                        <span>Tax (7.5%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>

                      <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-base">
                        <span>Total</span>
                        <span className="text-yellow-600">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <button className="w-full mt-5 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Place Order
                    </button>

                    <Link
                      href="/reservation"
                      className="w-full mt-3 py-3 border-2 border-gray-200 hover:border-yellow-400 text-gray-700 hover:text-yellow-600 font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm"
                    >
                      <MapPin className="w-4 h-4" />
                      Book a Table Instead
                    </Link>
                  </div>
                </MotionWrapper>

                {/* ASSURANCE BADGES */}
                <MotionWrapper variant="fade-left" delay={400}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="space-y-3">
                      {[
                        { icon: Clock, text: "Ready in 15–30 minutes" },
                        { icon: Star, text: "100% fresh ingredients" },
                        { icon: Package, text: "Secure & easy checkout" },
                      ].map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-yellow-500" />
                          </div>
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </MotionWrapper>

              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}