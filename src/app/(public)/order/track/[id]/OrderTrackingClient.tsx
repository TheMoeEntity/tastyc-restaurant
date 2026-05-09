"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Receipt,
  Clock,
  CheckCircle,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Flame,
  Leaf,
  RefreshCw,
  Home,
} from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { OrderTrackingSteps, OrderStatusBadge } from "@/components/sections/Order";
import { statusConfig, orderTypeConfig } from "@/lib/utils/orderUtils";
import { Order } from "@/types";

const statusMeta: Record<
  Order["status"],
  { title: string; desc: string; eta: string; color: string; bg: string; pulse: boolean }
> = {
  pending: {
    title: "Awaiting Confirmation",
    desc: "Your order has been placed and is waiting to be confirmed by the restaurant.",
    eta: "Being confirmed · ~5 min",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    pulse: true,
  },
  confirmed: {
    title: "Order Confirmed",
    desc: "Your order has been confirmed and is queued for the kitchen.",
    eta: "Preparation starting · ~20 min",
    color: "text-blue-600",
    bg: "bg-blue-50",
    pulse: false,
  },
  preparing: {
    title: "Being Prepared",
    desc: "Our chef is preparing your order with fresh ingredients.",
    eta: "Almost ready · ~15 min",
    color: "text-orange-600",
    bg: "bg-orange-50",
    pulse: true,
  },
  ready: {
    title: "Ready!",
    desc: "Your order is ready. Head to the counter or wait for your server.",
    eta: "Ready to serve now",
    color: "text-green-600",
    bg: "bg-green-50",
    pulse: true,
  },
  delivered: {
    title: "Delivered",
    desc: "Your order has been delivered. Enjoy your meal!",
    eta: "Completed",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    pulse: false,
  },
  cancelled: {
    title: "Order Cancelled",
    desc: "This order has been cancelled.",
    eta: "",
    color: "text-red-600",
    bg: "bg-red-50",
    pulse: false,
  },
};

const statusIcons: Record<Order["status"], typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Package,
  ready: ShoppingBag,
  delivered: Truck,
  cancelled: XCircle,
};

export default function OrderTrackingClient({ id }: { id: string }) {
  const { orders, cancelOrder } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const found = orders.find((o) => o.id === id);
    setOrder(found ?? null);
    setLastUpdated(Date.now());
  }, [mounted, orders, id]);

  // Poll Zustand store every 5s to reflect external status changes
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const found = orders.find((o) => o.id === id);
      setOrder(found ?? null);
      setLastUpdated(Date.now());
      setTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [mounted, orders, id]);

  const secondsAgo = Math.floor((Date.now() - lastUpdated) / 1000);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-40 bg-gray-800 rounded-2xl" />
        <div className="h-32 bg-gray-100 rounded-xl" />
        <div className="h-48 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Receipt className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">
          Order Not Found
        </h1>
        <p className="text-gray-500 mb-8">
          We couldn&apos;t find an order with that ID. It may have been removed or
          the link is incorrect.
        </p>
        <Link
          href="/order"
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Orders
        </Link>
      </div>
    );
  }

  const meta = statusMeta[order.status];
  const StatusIcon = statusIcons[order.status];
  const typeConf = orderTypeConfig[order.orderType];
  const TypeIcon = typeConf.icon;
  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
  const isCancellable = order.status === "pending" || order.status === "confirmed";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-5">
      {/* ── Back link ── */}
      <Link
        href="/order"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to orders
      </Link>

      {/* ── Hero card ── */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/bg.jpg.webp')] bg-cover bg-center" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                  Order Tracking
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-serif text-white">
                {order.orderNumber}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {order.date} · {order.time}
              </p>
            </div>

            {/* Live badge */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    meta.pulse ? "bg-green-400 animate-pulse" : "bg-gray-400"
                  }`}
                />
                <span className="text-xs font-semibold text-white">
                  {meta.pulse ? "Live" : "Final"}
                </span>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          {/* Order type pill */}
          <div className="mt-4 flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20`}
            >
              <TypeIcon className="w-3.5 h-3.5" />
              {order.orderType === "dine-in"
                ? "Dine In"
                : order.orderType === "takeout"
                ? "Takeout"
                : "Delivery"}
              {order.tableNumber && ` · Table ${order.tableNumber}`}
              {order.deliveryAddress && ` · ${order.deliveryAddress.split(",")[0]}`}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
              <RefreshCw className="w-3 h-3" />
              {secondsAgo < 5 ? "Just updated" : `${secondsAgo}s ago`}
            </div>
          </div>
        </div>
      </div>

      {/* ── Status card ── */}
      <div className={`rounded-2xl border p-6 ${meta.bg} border-opacity-50`} style={{ borderColor: "transparent" }}>
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              order.status === "cancelled" ? "bg-red-100" : "bg-white shadow-md"
            }`}
          >
            <StatusIcon
              className={`w-7 h-7 ${meta.color} ${meta.pulse ? "animate-pulse" : ""}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={`text-xl font-bold font-serif ${meta.color} mb-1`}>
              {meta.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{meta.desc}</p>
            {meta.eta && (
              <div className="flex items-center gap-1.5 mt-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">
                  {meta.eta}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Progress steps ── */}
      {order.status !== "cancelled" && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 md:p-6">
          <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-widest text-gray-400">
            Progress
          </h3>
          <OrderTrackingSteps status={order.status} />
        </div>
      )}

      {/* ── Two column: items + details ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Order items */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-yellow-500" />
            Items ({totalItems})
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
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
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.spicy && <Flame className="w-3 h-3 text-red-500" />}
                    {item.veg && <Leaf className="w-3 h-3 text-green-600" />}
                    <span className="text-xs text-gray-400">× {item.quantity}</span>
                  </div>
                </div>
                <p className="font-bold text-yellow-600 text-sm shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer + price */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-yellow-500" />
              Customer
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {order.customerName}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {order.customerEmail}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {order.customerPhone}
              </div>
              {order.tableNumber && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  Table {order.tableNumber}
                </div>
              )}
              {order.deliveryAddress && (
                <div className="flex items-start gap-2 text-gray-600">
                  <Home className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>{order.deliveryAddress}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-yellow-500" />
              Payment
            </h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-black text-gray-900">
                <span>Total</span>
                <span className="text-yellow-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3 pb-6">
        {isCancellable && (
          <button
            onClick={() => {
              if (confirm("Cancel this order?")) cancelOrder(order.id);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-200 transition text-sm"
          >
            <XCircle className="w-4 h-4" />
            Cancel Order
          </button>
        )}
        <Link
          href="/menu"
          className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 hover:border-yellow-400 text-gray-600 hover:text-yellow-600 font-semibold rounded-xl transition text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Order Again
        </Link>
        <Link
          href="/order"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-sm ml-auto"
        >
          <Receipt className="w-4 h-4" />
          All Orders
        </Link>
      </div>
    </div>
  );
}
