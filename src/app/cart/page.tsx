// app/cart/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart, Trash2, Plus, Minus, ChevronRight,
  ArrowLeft, Tag, Flame, Leaf, Star, Package,
  MapPin, Clock, CreditCard, CheckCircle, X,
  User, Home, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { saveOrder, type CartItem as CartItemType, type Order } from "@/app/utils/orderUtils";

// Storage key for promo
const ACTIVE_PROMO_KEY = "active_promo_code";

// Helper functions for promo
const getAppliedPromo = (): { code: string; discount: number; minOrder?: number } | null => {
  if (typeof window === "undefined") return null;
  const promo = localStorage.getItem(ACTIVE_PROMO_KEY);
  return promo ? JSON.parse(promo) : null;
};

const clearAppliedPromo = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACTIVE_PROMO_KEY);
    window.dispatchEvent(new Event("promoCleared"));
  }
};

interface CartItem extends CartItemType {
  description: string;
  category: string;
  tags: string[];
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [activePromo, setActivePromo] = useState<{ code: string; discount: number; minOrder?: number } | null>(null);
  const [orderType, setOrderType] = useState<"dine-in" | "takeout" | "delivery">("dine-in");
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);

  useEffect(() => {
    const loadCart = () => {
      const stored = localStorage.getItem("cart");
      setCart(stored ? JSON.parse(stored) : []);
    };
    loadCart();
    
    // Load saved promo from shop page
    const savedPromo = getAppliedPromo();
    if (savedPromo) {
      setActivePromo(savedPromo);
      setPromoCode(savedPromo.code);
      setPromoApplied(true);
      setPromoError("");
    }
    
    const handleCartUpdate = () => {
      const stored = localStorage.getItem("cart");
      setCart(stored ? JSON.parse(stored) : []);
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
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
    const code = promoCode.trim().toUpperCase();
    const subtotalValue = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Check against available deals
    if (code === "FIRST10") {
      setPromoApplied(true);
      setPromoError("");
      setActivePromo({ code: "FIRST10", discount: 10 });
      localStorage.setItem(ACTIVE_PROMO_KEY, JSON.stringify({ code: "FIRST10", discount: 10 }));
    } else if (code === "WEEKEND20") {
      if (subtotalValue >= 50) {
        setPromoApplied(true);
        setPromoError("");
        setActivePromo({ code: "WEEKEND20", discount: 20, minOrder: 50 });
        localStorage.setItem(ACTIVE_PROMO_KEY, JSON.stringify({ code: "WEEKEND20", discount: 20, minOrder: 50 }));
      } else {
        setPromoError(`Minimum order of $50 required for WEEKEND20. Current subtotal: $${subtotalValue.toFixed(2)}`);
        setPromoApplied(false);
        setActivePromo(null);
      }
    } else if (code === "AFRICAN15") {
      setPromoApplied(true);
      setPromoError("");
      setActivePromo({ code: "AFRICAN15", discount: 15 });
      localStorage.setItem(ACTIVE_PROMO_KEY, JSON.stringify({ code: "AFRICAN15", discount: 15 }));
    } else if (code === "TASTYC10") {
      setPromoApplied(true);
      setPromoError("");
      setActivePromo({ code: "TASTYC10", discount: 10 });
      localStorage.setItem(ACTIVE_PROMO_KEY, JSON.stringify({ code: "TASTYC10", discount: 10 }));
    } else {
      setPromoError("Invalid promo code. Try: FIRST10, WEEKEND20, AFRICAN15, or TASTYC10");
      setPromoApplied(false);
      setActivePromo(null);
      clearAppliedPromo();
    }
  };

  const removePromo = () => {
    setPromoApplied(false);
    setActivePromo(null);
    setPromoCode("");
    clearAppliedPromo();
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountPercent = promoApplied && activePromo ? activePromo.discount : 0;
  const discount = (subtotal * discountPercent) / 100;
  const deliveryFee = orderType === "delivery" ? 3.99 : 0;
  const tax = (subtotal - discount) * 0.075;
  const total = subtotal - discount + deliveryFee + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (!customerName.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    if (!customerPhone.trim()) {
      alert("Please enter your phone number");
      return;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) {
      alert("Please enter your delivery address");
      return;
    }
    if (orderType === "dine-in" && !tableNumber.trim()) {
      alert("Please enter your table number");
      return;
    }

    setIsPlacingOrder(true);

    const orderData = {
      status: "pending" as const,
      orderType,
      items: cart.map(item => ({ 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: item.quantity,
        image: item.image,
        description: item.description,
        category: item.category,
        spicy: item.spicy,
        popular: item.popular,
        veg: item.veg
      })),
      subtotal,
      discount,
      deliveryFee,
      tax,
      total,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      specialInstructions: specialInstructions.trim() || undefined,
      deliveryAddress: orderType === "delivery" ? deliveryAddress.trim() : undefined,
      tableNumber: orderType === "dine-in" ? tableNumber.trim() : undefined,
      promoCode: activePromo?.code,
    };

    setTimeout(() => {
      const newOrder = saveOrder(orderData);
      setOrderPlaced(newOrder);
      setIsPlacingOrder(false);
      
      localStorage.removeItem("cart");
      clearAppliedPromo();
      window.dispatchEvent(new Event("cartUpdated"));
      setCart([]);
      
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setDeliveryAddress("");
      setTableNumber("");
      setSpecialInstructions("");
      setPromoApplied(false);
      setActivePromo(null);
      setPromoCode("");
      setShowCheckoutModal(false);
    }, 1500);
  };

  const closeSuccessModal = () => {
    setOrderPlaced(null);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
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
          <MotionWrapper variant="fade-up" className="text-center py-24">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 text-base mb-8 max-w-md mx-auto">
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
            <div className="flex-1">
              <MotionWrapper variant="fade-up" className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Type</h2>
                <div className="grid grid-cols-3 gap-3">
                  {(["dine-in", "takeout", "delivery"] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`py-3 px-4 rounded-lg border text-sm font-semibold capitalize transition-all duration-200 flex flex-col items-center gap-1 ${
                        orderType === type
                          ? "shadow-yellow-100 shadow-lg bg-yellow-50 text-yellow-500 border-yellow-400"
                          : "border-gray-200 bg-white text-gray-600 hover:border-yellow-300"
                      }`}
                    >
                      {type === "dine-in" && <MapPin className="w-4 h-4" />}
                      {type === "takeout" && <Package className="w-4 h-4" />}
                      {type === "delivery" && <Clock className="w-4 h-4" />}
                      {type === "dine-in" ? "Dine In" : type === "takeout" ? "Takeout" : "Delivery"}
                      {type === "delivery" && <span className="text-xs text-gray-400">+$3.99</span>}
                    </button>
                  ))}
                </div>
              </MotionWrapper>

              <MotionWrapper variant="fade-up" delay={100} className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Cart Items <span className="text-yellow-500">({totalItems})</span>
                </h2>
                <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition">
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              </MotionWrapper>

              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <MotionWrapper key={item.id} variant="fade-up" delay={idx * 80}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex gap-4 items-start">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                        <img src={item.image || "/assets/homeImg1.jpg"} alt={item.name} className="w-full h-full object-cover" />
                        {item.popular && (
                          <div className="absolute top-1 left-1 bg-yellow-500 rounded-full p-0.5">
                            <Star className="w-2.5 h-2.5 fill-black text-black" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base leading-tight">{item.name}</h3>
                            <p className="text-gray-400 text-xs mt-0.5">{item.category}</p>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition shrink-0">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed mt-1 line-clamp-1">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {item.spicy && <span className="flex items-center gap-0.5 text-xs text-red-500 font-medium"><Flame className="w-3 h-3" /> Spicy</span>}
                          {item.veg && <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium"><Leaf className="w-3 h-3" /> Veg</span>}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => decreaseQty(item.id)} className="w-7 h-7 rounded-full border border-gray-200 hover:border-yellow-500 hover:text-yellow-600 flex items-center justify-center transition">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-gray-900 w-6 text-center">{item.quantity}</span>
                            <button onClick={() => increaseQty(item.id)} className="w-7 h-7 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center transition">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-yellow-600 text-base">${(item.price * item.quantity).toFixed(2)}</p>
                            {item.quantity > 1 && <p className="text-xs text-gray-500">${item.price} each</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </MotionWrapper>
                ))}
              </div>

              <MotionWrapper variant="fade-up" delay={100} className="mt-8">
                <Link href="/menu" className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-700 font-semibold transition">
                  <ArrowLeft className="w-4 h-4" />
                  Add more items
                </Link>
              </MotionWrapper>
            </div>

            <div className="lg:w-96 shrink-0">
              <div className="sticky top-24 space-y-4">
                <MotionWrapper variant="fade-left" delay={200}>
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
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
                    {promoApplied && activePromo && (
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-green-600 text-xs font-medium">
                          ✓ {activePromo.discount}% discount applied! ({activePromo.code})
                        </p>
                        <button onClick={removePromo} className="text-red-500 hover:text-red-700">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {promoError && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {promoError}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-2">Try: FIRST10, WEEKEND20, AFRICAN15, or TASTYC10</p>
                  </div>
                </MotionWrapper>

                <MotionWrapper variant="fade-left" delay={300}>
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({totalItems} items)</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>

                      {promoApplied && activePromo && (
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Discount ({activePromo.discount}% - {activePromo.code})</span>
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

                    <button
                      onClick={() => setShowCheckoutModal(true)}
                      className="w-full mt-5 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Proceed to Checkout
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

                <MotionWrapper variant="fade-left" delay={400}>
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
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

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif text-gray-900">Checkout</h2>
              <button onClick={() => setShowCheckoutModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-yellow-500" />
                  Your Information
                </h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Full Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition" />
                  <input type="email" placeholder="Email Address *" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition" />
                  <input type="tel" placeholder="Phone Number *" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition" />
                </div>
              </div>

              {orderType === "delivery" && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Home className="w-4 h-4 text-yellow-500" />
                    Delivery Address
                  </h3>
                  <textarea placeholder="Street Address, City, Zip Code *" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition resize-none" />
                </div>
              )}

              {orderType === "dine-in" && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-yellow-500" />
                    Table Number
                  </h3>
                  <input type="text" placeholder="Table Number *" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition" />
                </div>
              )}

              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-yellow-500" />
                  Special Instructions (Optional)
                </h3>
                <textarea placeholder="Any allergies, preferences, or special requests..." value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition resize-none" />
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">Order Total</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                  {promoApplied && activePromo && (
                    <div className="flex justify-between text-green-600"><span>Discount ({activePromo.discount}%):</span><span>-${discount.toFixed(2)}</span></div>
                  )}
                  {orderType === "delivery" && <div className="flex justify-between"><span className="text-gray-500">Delivery Fee:</span><span>${deliveryFee.toFixed(2)}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-500">Tax:</span><span>${tax.toFixed(2)}</span></div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold"><span>Total:</span><span className="text-yellow-600">${total.toFixed(2)}</span></div>
                </div>
              </div>

              <button onClick={handlePlaceOrder} disabled={isPlacingOrder} className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isPlacingOrder ? (
                  <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> Placing Order...</>
                ) : (
                  <><CheckCircle className="w-5 h-5" /> Place Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER SUCCESS MODAL */}
      {orderPlaced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <MotionWrapper variant="fade-up" className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">Order Placed!</h2>
            <p className="text-gray-500 mb-2">Order Number: <span className="font-bold text-yellow-600">{orderPlaced.orderNumber}</span></p>
            <p className="text-sm text-gray-400 mb-6">{orderPlaced.date} at {orderPlaced.time}</p>
            {orderPlaced.promoCode && (
              <p className="text-sm text-green-600 mb-4">Discount applied: {orderPlaced.promoCode}</p>
            )}
            <div className="space-y-3">
              <Link href="/orders" onClick={closeSuccessModal} className="block w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-center">
                View My Orders
              </Link>
              <Link href="/menu" onClick={closeSuccessModal} className="block w-full py-3 border border-gray-200 hover:border-yellow-400 text-gray-600 hover:text-yellow-600 font-semibold rounded-xl transition">
                Continue Shopping
              </Link>
            </div>
          </MotionWrapper>
        </div>
      )}
    </main>
  );
}