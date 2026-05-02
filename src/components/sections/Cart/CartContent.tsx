"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  MapPin,
  Package,
  Clock,
  Star,
  Flame,
  Leaf,
  User,
  Home,
  CheckCircle,
  X,
} from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import { Order, OrderType } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useShopStore } from "@/store/useShopStore";
import { OrderSummary } from "./OrderSummary";

export function CartContent() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, increaseQty, decreaseQty, clearCart, getTotalItems, getSubtotal } = useCartStore();
  const { placeOrder } = useOrderStore();
  const { activePromo, clearPromo } = useShopStore();

  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);

  const totalItems = getTotalItems();
  const subtotal = getSubtotal();
  const discountPercent = activePromo ? activePromo.discount : 0;
  const discount = (subtotal * discountPercent) / 100;
  const deliveryFee = orderType === "delivery" ? 3.99 : 0;
  const tax = (subtotal - discount) * 0.075;
  const total = subtotal - discount + deliveryFee + tax;

  useEffect(() => {
    setMounted(true);
  }, []);

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

    setTimeout(() => {
      const newOrder = placeOrder({
        status: "pending",
        orderType,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          description: item.description,
          category: item.category,
          spicy: item.spicy,
          popular: item.popular,
          veg: item.veg,
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
      });

      setOrderPlaced(newOrder);
      setIsPlacingOrder(false);
      clearCart();
      clearPromo();
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setDeliveryAddress("");
      setTableNumber("");
      setSpecialInstructions("");
      setShowCheckoutModal(false);
    }, 1500);
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 xl:px-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-gray-100 rounded-xl"></div>
              <div className="h-32 bg-gray-100 rounded-xl"></div>
            </div>
            <div className="h-96 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 xl:px-12">
        <div className="text-center py-12 md:py-20">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-gray-900 mb-2 md:mb-3">Your cart is empty</h2>
          <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8 max-w-md mx-auto px-4">
            Looks like you haven&apos;t added anything yet. Head back to the menu and explore our dishes.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-lg text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const orderTypes = [
    { type: "dine-in" as const, icon: MapPin, label: "Dine In" },
    { type: "takeout" as const, icon: Package, label: "Takeout" },
    { type: "delivery" as const, icon: Clock, label: "Delivery", note: "+$3.99" },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT - Cart Items */}
          <div className="flex-1 min-w-0">
            {/* Order Type Selection */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Order Type</h2>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {orderTypes.map(({ type, icon: Icon, label, note }) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`py-2 md:py-3 px-2 rounded-lg border text-xs md:text-sm font-semibold capitalize transition-all duration-200 flex flex-col items-center gap-1 ${
                      orderType === type
                        ? "shadow-yellow-100 shadow-lg bg-yellow-50 text-yellow-500 border-yellow-400"
                        : "border-gray-200 bg-white text-gray-600 hover:border-yellow-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {note && <span className="text-[10px] md:text-xs text-gray-400">{note}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Header */}
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900">
                Cart Items <span className="text-yellow-500">({totalItems})</span>
              </h2>
              <button
                onClick={clearCart}
                className="text-xs md:text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                Clear all
              </button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 md:space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 md:p-4">
                  <div className="flex gap-3 md:gap-4">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={item.image || "/assets/homeImg1.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      {item.popular && (
                        <div className="absolute top-1 left-1 bg-yellow-500 rounded-full p-0.5">
                          <Star className="w-2 h-2 fill-black text-black" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-sm md:text-base truncate">{item.name}</h3>
                          <p className="text-gray-400 text-xs mt-0.5">{item.category}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600 shrink-0">
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed mt-1 line-clamp-1 hidden sm:block">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
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
                      <div className="flex items-center justify-between mt-2 md:mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-gray-200 hover:border-yellow-500 flex items-center justify-center transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-gray-900 w-6 text-center text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-yellow-600 text-sm md:text-base">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">${item.price} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Back to Menu Link */}
            <div className="mt-6 md:mt-8">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-700 font-semibold transition text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                Add more items
              </Link>
            </div>
          </div>

          {/* RIGHT - Order Summary */}
          <div className="lg:w-96">
            <OrderSummary orderType={orderType} onCheckout={() => setShowCheckoutModal(true)} />
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full my-8 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif text-gray-900">Checkout</h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Customer Info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-yellow-500" />
                  Your Information
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 transition"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 transition"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 transition"
                  />
                </div>
              </div>

              {/* Delivery Address or Table Number */}
              {orderType === "delivery" && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                    <Home className="w-4 h-4 text-yellow-500" />
                    Delivery Address
                  </h3>
                  <textarea
                    placeholder="Street Address, City, Zip Code *"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 transition resize-none"
                  />
                </div>
              )}

              {orderType === "dine-in" && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-yellow-500" />
                    Table Number
                  </h3>
                  <input
                    type="text"
                    placeholder="Table Number *"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 transition"
                  />
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-yellow-500" />
                  Special Instructions (Optional)
                </h3>
                <textarea
                  placeholder="Any allergies, preferences, or special requests..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 transition resize-none"
                />
              </div>

              {/* Order Total */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">Order Total</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {activePromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({activePromo.discount}%):</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  {orderType === "delivery" && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery Fee:</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-yellow-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {orderPlaced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">Order Placed!</h2>
            <p className="text-gray-500 mb-2">
              Order Number: <span className="font-bold text-yellow-600">{orderPlaced.orderNumber}</span>
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {orderPlaced.date} at {orderPlaced.time}
            </p>
            {orderPlaced.promoCode && (
              <p className="text-sm text-green-600 mb-4">Discount applied: {orderPlaced.promoCode}</p>
            )}
            <div className="space-y-3">
              <Link
                href="/order"
                onClick={() => setOrderPlaced(null)}
                className="block w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-center"
              >
                View My Orders
              </Link>
              <Link
                href="/menu"
                onClick={() => setOrderPlaced(null)}
                className="block w-full py-3 border border-gray-200 hover:border-yellow-400 text-gray-600 hover:text-yellow-600 font-semibold rounded-xl transition text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}