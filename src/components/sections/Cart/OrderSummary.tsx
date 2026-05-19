"use client";

import { useState } from "react";
import {
  Tag,
  X,
  AlertCircle,
  CreditCard,
  MapPin,
  Clock,
  Star,
  Package as PackageIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MotionWrapper from "@/components/MotionWrapper";
import { useCartStore } from "@/store/useCartStore";
import { useShopStore } from "@/store/useShopStore";

interface OrderSummaryProps {
  orderType: "dine-in" | "takeout" | "delivery";
}

export function OrderSummary({ orderType }: OrderSummaryProps) {
  const router = useRouter();
  const { getTotalItems, getSubtotal } = useCartStore();
  const { activePromo, applyPromo, clearPromo } = useShopStore();

  const [promoCode, setPromoCode] = useState(activePromo?.code ?? "");
  const [promoError, setPromoError] = useState("");

  const totalItems = getTotalItems();
  const subtotal = getSubtotal();
  const discountPercent = activePromo ? activePromo.discount : 0;
  const discount = (subtotal * discountPercent) / 100;
  const deliveryFee = orderType === "delivery" ? 1000 : 0;
  // const tax = (subtotal - discount) * 0.075;
  const total = subtotal - discount + deliveryFee;

  const handleApplyPromo = () => {
    const result = applyPromo(promoCode.trim().toUpperCase(), subtotal);
    if (!result.valid) {
      setPromoError(result.message);
    } else {
      setPromoError("");
    }
  };

  const handleRemovePromo = () => {
    clearPromo();
    setPromoCode("");
    setPromoError("");
  };

  const trustBadges = [
    { icon: Clock, text: "Ready in 15–30 minutes" },
    { icon: Star, text: "100% fresh ingredients" },
    { icon: PackageIcon, text: "Secure & easy checkout" },
  ];

  return (
    <div className="space-y-4">
      {/* Promo Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
          <Tag className="w-4 h-4 text-yellow-500" />
          Promo Code
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter code"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value);
              setPromoError("");
            }}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 transition"
          />
          <button
            onClick={handleApplyPromo}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-lg transition"
          >
            Apply
          </button>
        </div>
        {activePromo && (
          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
            <p className="text-green-600 text-xs font-medium">
              ✓ {activePromo.discount}% discount applied! ({activePromo.code})
            </p>
            <button
              onClick={handleRemovePromo}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {promoError && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {promoError}
          </p>
        )}
        <p className="text-gray-400 text-xs mt-2">
          Try: FIRST10, WEEKEND20, AFRICAN15, TASTYC10
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({totalItems} items)</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          {activePromo && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount ({activePromo.discount}%)</span>
              <span>-₦{discount.toLocaleString()}</span>
            </div>
          )}
          {orderType === "delivery" && (
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
          )}
          {/* <div className="flex justify-between text-gray-600">
            <span>Tax (7.5%)</span>
            <span>${tax.toFixed(2)}</span>
          </div> */}
          <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-base">
            <span>Total</span>
            <span className="text-yellow-600">₦{total.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => router.push(`/checkout?type=${orderType}`)}
          className="w-full mt-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
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

      {/* Trust Badges - Hidden on mobile */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 hidden md:block">
        <div className="space-y-3">
          {trustBadges.map(({ icon: Icon, text }, i) => (
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
  );
}
