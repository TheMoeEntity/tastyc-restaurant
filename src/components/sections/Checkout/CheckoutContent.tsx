"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Home,
  ArrowLeft,
  CheckCircle,
  Tag,
  AlertCircle,
  Clock,
  Star,
  X,
  Flame,
  Leaf,
  ChevronRight,
  CreditCard,
  Banknote,
  Receipt,
} from "lucide-react";
import { Order, OrderType } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useShopStore } from "@/store/useShopStore";

const ORDER_TYPES = [
  { type: "dine-in" as const, icon: MapPin, label: "Dine In", note: "" },
  { type: "takeout" as const, icon: Package, label: "Takeout", note: "" },
  { type: "delivery" as const, icon: Clock, label: "Delivery", note: "+$3.99" },
];

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const { items, clearCart, getTotalItems, getSubtotal } = useCartStore();
  const { placeOrder } = useOrderStore();
  const { activePromo, applyPromo, clearPromo } = useShopStore();

  const initialType = (searchParams.get("type") as OrderType) || "dine-in";
  const [orderType, setOrderType] = useState<OrderType>(initialType);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);
  const [promoCode, setPromoCode] = useState(activePromo?.code ?? "");
  const [promoError, setPromoError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getSubtotal();
  const discountPercent = activePromo ? activePromo.discount : 0;
  const discount = (subtotal * discountPercent) / 100;
  const deliveryFee = orderType === "delivery" ? 3.99 : 0;
  const tax = (subtotal - discount) * 0.075;
  const total = subtotal - discount + deliveryFee + tax;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill table number from QR scan session
  useEffect(() => {
    if (!mounted || orderType !== "dine-in") return;
    const qrTable = sessionStorage.getItem("qr_table_number");
    if (qrTable && !tableNumber) setTableNumber(qrTable);
  }, [mounted, orderType]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mounted && items.length === 0 && !orderPlaced) {
      router.push("/cart");
    }
  }, [mounted, items.length, orderPlaced, router]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!customerName.trim()) next.name = "Full name is required";
    if (!customerEmail.trim() || !customerEmail.includes("@"))
      next.email = "Valid email is required";
    if (!customerPhone.trim()) next.phone = "Phone number is required";
    if (orderType === "delivery" && !deliveryAddress.trim())
      next.address = "Delivery address is required";
    if (orderType === "dine-in" && !tableNumber.trim())
      next.table = "Table number is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleApplyPromo = () => {
    const result = applyPromo(promoCode.trim().toUpperCase(), subtotal);
    if (!result.valid) {
      setPromoError(result.message);
    } else {
      setPromoError("");
    }
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
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
        deliveryAddress:
          orderType === "delivery" ? deliveryAddress.trim() : undefined,
        tableNumber:
          orderType === "dine-in" ? tableNumber.trim() : undefined,
        promoCode: activePromo?.code,
      });
      setOrderPlaced(newOrder);
      setIsPlacingOrder(false);
      clearCart();
      clearPromo();
    }, 1500);
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
              <div className="h-36 bg-gray-100 rounded-xl" />
            </div>
            <div className="lg:col-span-2 h-96 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 mb-1">
            Thank you,{" "}
            <span className="font-semibold text-gray-700">
              {orderPlaced.customerName}
            </span>
            !
          </p>
          <p className="text-gray-400 text-sm mb-5">
            Order{" "}
            <span className="font-bold text-yellow-600">
              #{orderPlaced.orderNumber}
            </span>{" "}
            · {orderPlaced.date} at {orderPlaced.time}
          </p>

          {orderPlaced.promoCode && (
            <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full mb-5">
              <Tag className="w-3.5 h-3.5" />
              Promo {orderPlaced.promoCode} applied
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Order Type</span>
              <span className="font-medium text-gray-700 capitalize">
                {orderPlaced.orderType}
              </span>
            </div>
            {orderPlaced.tableNumber && (
              <div className="flex justify-between text-gray-500">
                <span>Table</span>
                <span className="font-medium text-gray-700">
                  {orderPlaced.tableNumber}
                </span>
              </div>
            )}
            {orderPlaced.deliveryAddress && (
              <div className="flex justify-between text-gray-500 gap-4">
                <span className="shrink-0">Deliver to</span>
                <span className="font-medium text-gray-700 text-right">
                  {orderPlaced.deliveryAddress}
                </span>
              </div>
            )}
            <div className="flex justify-between text-gray-500 border-t border-gray-200 pt-2">
              <span>Total Paid</span>
              <span className="font-black text-yellow-600 text-base">
                ${orderPlaced.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/order"
              className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-md"
            >
              <Receipt className="w-4 h-4" />
              Track My Order
            </Link>
            <Link
              href="/menu"
              className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 hover:border-yellow-400 text-gray-600 hover:text-yellow-600 font-semibold rounded-xl transition"
            >
              Continue Shopping
            </Link>
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

          {/* 1 · Order Type */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-black text-xs font-black rounded-full flex items-center justify-center shrink-0">
                1
              </span>
              Order Type
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {ORDER_TYPES.map(({ type, icon: Icon, label, note }) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`py-3 px-2 rounded-xl border text-sm font-semibold capitalize transition-all duration-200 flex flex-col items-center gap-1.5 ${
                    orderType === type
                      ? "shadow-lg shadow-yellow-100 bg-yellow-50 text-yellow-600 border-yellow-400"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-yellow-300 hover:bg-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                  {note && (
                    <span className="text-xs text-gray-400 font-normal">
                      {note}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* 2 · Contact Information */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-black text-xs font-black rounded-full flex items-center justify-center shrink-0">
                2
              </span>
              Contact Information
            </h2>
            <div className="space-y-3">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setErrors((p) => ({ ...p, name: "" }));
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition ${
                      errors.name
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      setErrors((p) => ({ ...p, email: "" }));
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition ${
                      errors.email
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      setErrors((p) => ({ ...p, phone: "" }));
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition ${
                      errors.phone
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 3 · Order Details (conditional) */}
          {(orderType === "delivery" || orderType === "dine-in") && (
            <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 text-black text-xs font-black rounded-full flex items-center justify-center shrink-0">
                  3
                </span>
                {orderType === "delivery"
                  ? "Delivery Details"
                  : "Dine-In Details"}
              </h2>

              {orderType === "delivery" ? (
                <div>
                  <div className="relative">
                    <Home className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <textarea
                      placeholder="Street Address, City, Zip Code *"
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        setErrors((p) => ({ ...p, address: "" }));
                      }}
                      rows={3}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition resize-none ${
                        errors.address
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.address}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Estimated delivery: 30–45
                    minutes
                  </p>
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Table Number *"
                      value={tableNumber}
                      onChange={(e) => {
                        setTableNumber(e.target.value);
                        setErrors((p) => ({ ...p, table: "" }));
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition ${
                        errors.table
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.table && (
                    <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.table}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Food will be served to your
                    table in 15–25 minutes
                  </p>
                </div>
              )}
            </section>
          )}

          {/* 4 · Special Instructions */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-100 text-gray-500 text-xs font-black rounded-full flex items-center justify-center shrink-0">
                {orderType === "takeout" ? "3" : "4"}
              </span>
              Special Instructions
              <span className="text-xs font-normal text-gray-400 ml-1">
                (Optional)
              </span>
            </h2>
            <textarea
              placeholder="Allergies, preferences, or special requests..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition resize-none"
            />
          </section>

          {/* 5 · Payment */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-100 text-gray-500 text-xs font-black rounded-full flex items-center justify-center shrink-0">
                {orderType === "takeout" ? "4" : "5"}
              </span>
              Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border-2 border-yellow-400 bg-yellow-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-gray-400">Pay when you receive</p>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-yellow-500 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                </div>
              </div>
              <div className="border-2 border-gray-200 bg-gray-50 rounded-xl p-4 flex items-center gap-3 opacity-50 cursor-not-allowed">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-sm">
                    Card Payment
                  </p>
                  <p className="text-xs text-gray-400">Coming soon</p>
                </div>
              </div>
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
            {/* Cart items review */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-lg">Your Order</h2>
                <Link
                  href="/cart"
                  className="text-xs text-yellow-500 hover:text-yellow-700 font-semibold transition flex items-center gap-1"
                >
                  Edit cart
                  <ChevronRight className="w-3 h-3" />
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
                        <p className="text-xs text-gray-400">
                          × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-yellow-600 text-sm shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo code */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-yellow-500" />
                Promo Code
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoError("");
                  }}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 transition"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition"
                >
                  Apply
                </button>
              </div>
              {activePromo && (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-green-600 text-xs font-medium">
                    ✓ {activePromo.discount}% off ({activePromo.code})
                  </p>
                  <button
                    onClick={() => {
                      clearPromo();
                      setPromoCode("");
                    }}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {promoError && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {promoError}
                </p>
              )}
              {!activePromo && (
                <p className="text-gray-400 text-xs mt-2">
                  Try: FIRST10, WEEKEND20, AFRICAN15
                </p>
              )}
            </div>

            {/* Price breakdown + CTA */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
                Order Total
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {activePromo && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({activePromo.discount}%)</span>
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
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full mt-5 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Place Order · ${total.toFixed(2)}
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 text-gray-400 hover:text-gray-600 text-sm font-medium transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to cart
              </Link>
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 hidden lg:block">
              <div className="space-y-3">
                {[
                  { icon: Clock, text: "Ready in 15–30 minutes" },
                  { icon: Star, text: "100% fresh ingredients" },
                  { icon: Package, text: "Secure & easy checkout" },
                ].map(({ icon: Icon, text }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-yellow-500" />
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
