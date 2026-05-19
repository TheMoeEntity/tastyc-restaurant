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
} from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import { OrderType } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { OrderSummary } from "./OrderSummary";

export function CartContent() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
    getTotalItems,
  } = useCartStore();

  const [orderType, setOrderType] = useState<OrderType>("dine-in");

  const totalItems = getTotalItems();
  useEffect(() => {
    setMounted(true);
    useCartStore.getState().syncFromApi();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <h2 className="text-xl md:text-2xl font-bold font-serif text-gray-900 mb-2 md:mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8 max-w-md mx-auto px-4">
            Looks like you haven&apos;t added anything yet. Head back to the
            menu and explore our dishes.
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
    {
      type: "delivery" as const,
      icon: Clock,
      label: "Delivery",
      note: "+$3.99",
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT - Cart Items */}
          <div className="flex-1 min-w-0">
            {/* Order Type Selection */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                Order Type
              </h2>
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
                    {note && (
                      <span className="text-[10px] md:text-xs text-gray-400">
                        {note}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Header */}
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900">
                Cart Items{" "}
                <span className="text-yellow-500">({totalItems})</span>
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
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 md:p-4"
                >
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
                          <h3 className="font-bold text-gray-900 text-sm md:text-base truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {item.category}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.id, item.menuItemId, item.variantId)
                          }
                          className="text-red-500 hover:text-red-600 shrink-0"
                        >
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
                            onClick={() =>
                              decreaseQty(
                                item.id,
                                item.menuItemId,
                                item.variantId,
                              )
                            }
                            className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-gray-200 hover:border-yellow-500 flex items-center justify-center transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-gray-900 w-6 text-center text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              increaseQty(
                                item.id,
                                item.menuItemId,
                                item.variantId,
                              )
                            }
                            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-yellow-600 text-sm md:text-base">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              ₦{item.price.toLocaleString()} each
                            </p>
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
            <OrderSummary orderType={orderType} />
          </div>
        </div>
      </div>
    </>
  );
}
