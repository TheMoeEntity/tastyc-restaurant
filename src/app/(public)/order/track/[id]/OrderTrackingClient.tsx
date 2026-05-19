"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { io, Socket } from "socket.io-client";
import {
  ArrowLeft,
  Receipt,
  Clock,
  CheckCircle,
  Package,
  ShoppingBag,
  Truck,
  MapPin,
  Flame,
  Leaf,
  CreditCard,
  Home,
  RefreshCw,
  Loader2,
} from "lucide-react";
import apiFetch from "@/lib/api";

//

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED";
type OrderType = "DELIVERY" | "PICKUP";

interface OrderItem {
  id: string;
  menuItem: { name: string; image?: string };
  quantity: number;
  unitPrice: number; // ← matches Prisma field name
  totalPrice: number;
  notes?: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee?: number;
  tax?: number;
  total: number;
  estimatedTime?: string;
  address?: { street: string; city: string; state: string };
  notes?: string;
  createdAt: string;
}

const STEPS: { key: OrderStatus; label: string; icon: typeof Clock }[] = [
  { key: "PENDING", label: "Order Placed", icon: Receipt },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { key: "PREPARING", label: "Preparing", icon: Package },
  { key: "READY", label: "Ready", icon: ShoppingBag },
  { key: "DELIVERED", label: "Delivered", icon: Truck },
];

const STEP_INDEX: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  READY: 3,
  DELIVERED: 4,
};

const STATUS_META: Record<
  OrderStatus,
  {
    title: string;
    desc: string;
    eta: string;
    color: string;
    bg: string;
    pulse: boolean;
  }
> = {
  PENDING: {
    title: "Awaiting Confirmation",
    desc: "Your order has been placed and is waiting to be confirmed.",
    eta: "~5 min",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    pulse: true,
  },
  CONFIRMED: {
    title: "Order Confirmed",
    desc: "Confirmed! Your order is queued for the kitchen.",
    eta: "~20 min",
    color: "text-blue-600",
    bg: "bg-blue-50",
    pulse: false,
  },
  PREPARING: {
    title: "Being Prepared",
    desc: "Our chef is preparing your order right now.",
    eta: "~15 min",
    color: "text-orange-600",
    bg: "bg-orange-50",
    pulse: true,
  },
  READY: {
    title: "Ready!",
    desc: "Your order is ready — pick up or wait for delivery.",
    eta: "Now",
    color: "text-green-600",
    bg: "bg-green-50",
    pulse: true,
  },
  DELIVERED: {
    title: "Delivered",
    desc: "Your order has been delivered. Enjoy your meal!",
    eta: "Done",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    pulse: false,
  },
};

function getCookieToken(): string {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("tastyc_access_token="))
      ?.split("=")[1] ?? ""
  );
}

export default function OrderTrackingClient({ id }: { id: string }) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [fetchState, setFetchState] = useState<"loading" | "ok" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [liveLabel, setLiveLabel] = useState("Connecting…");
  const socketRef = useRef<Socket | null>(null);

  // Fetch initial order data
  useEffect(() => {
    apiFetch<any>(`/api/orders/${id}`)
      .then((r) => {
        if (!r.success) throw new Error(r.message ?? "Order not found");
        setOrder(r.data.order);
        setFetchState("ok");
      })
      .catch((err: unknown) => {
        setErrorMsg(
          err instanceof Error ? err.message : "Could not load order.",
        );
        setFetchState("error");
      });
  }, [id]);

  // Socket.IO live updates
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const token = getCookieToken();
    const socket = io(API!, { auth: { token }, transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => setLiveLabel("Live"));
    socket.on("disconnect", () => setLiveLabel("Reconnecting…"));
    socket.on("connect_error", () => setLiveLabel("Offline"));

    socket.emit("join-order", id);

    socket.on(
      "order-status-updated",
      (payload: { orderId: string; status: OrderStatus }) => {
        if (payload.orderId === id) {
          setOrder((prev) =>
            prev ? { ...prev, status: payload.status } : prev,
          );
        }
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [id]);

  // ── Loading ──
  if (fetchState === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        <p className="text-gray-500 text-sm">Loading your order…</p>
      </div>
    );
  }

  // ── Error ──
  if (fetchState === "error" || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Receipt className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">
          Order Not Found
        </h1>
        <p className="text-gray-500 mb-2 text-sm">{errorMsg}</p>
        <Link
          href="/order"
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition mt-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStep = STEP_INDEX[order.status] ?? 0;
  const meta = STATUS_META[order.status];
  const StatusIcon = STEPS[currentStep]?.icon ?? Clock;
  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-5">
      {/* Back */}
      <Link
        href="/order"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to orders
      </Link>

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/bg.jpg.webp')] bg-cover bg-center" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-1">
              Order Tracking
            </p>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-white">
              {order.orderNumber}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {new Date(order.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Live badge */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
              <span
                className={`w-2 h-2 rounded-full ${liveLabel === "Live" ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
              />
              <span className="text-xs font-semibold text-white">
                {liveLabel}
              </span>
            </div>
            {/* Order type pill */}
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-white text-xs font-semibold">
              {order.type === "DELIVERY" ? (
                <Truck className="w-3.5 h-3.5" />
              ) : (
                <Package className="w-3.5 h-3.5" />
              )}
              {order.type === "DELIVERY" ? "Delivery" : "Pickup"}
            </div>
          </div>
        </div>
      </div>

      {/* Status card */}
      <div className={`rounded-2xl p-6 ${meta.bg}`}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center shrink-0">
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
                  {order.estimatedTime
                    ? `Ready by ${order.estimatedTime}`
                    : `ETA: ${meta.eta}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 md:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
          Progress
        </p>
        <div className="relative flex justify-between">
          {/* Background track */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
            <div
              className="h-full bg-yellow-500 transition-all duration-700"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const done = idx <= currentStep;
            const current = idx === currentStep;
            return (
              <div
                key={step.key}
                className="relative flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${done ? "bg-yellow-500 text-black" : "bg-gray-200 text-gray-400"} ${current ? "ring-4 ring-yellow-200 scale-110" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs mt-2 font-medium hidden sm:block ${done ? "text-gray-700" : "text-gray-400"}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column: items + details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Items */}
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
                    src={item.menuItem.image || "/assets/homeImg1.jpg"}
                    alt={item.menuItem.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {item.menuItem.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {item.spicy && <Flame className="w-3 h-3 text-red-500" />}
                    {item.veg && <Leaf className="w-3 h-3 text-green-600" />}
                    <span className="text-xs text-gray-400">
                      × {item.quantity}
                    </span>
                  </div>
                </div>
                <p className="font-bold text-yellow-600 text-sm shrink-0">
                  ₦{item.totalPrice.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          {order.notes && (
            <p className="mt-3 text-xs text-gray-500 italic border-t border-gray-100 pt-3">
              &ldquo;{order.notes}&rdquo;
            </p>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Delivery address */}
          {order.type === "DELIVERY" && order.address && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Home className="w-4 h-4 text-yellow-500" />
                Deliver to
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.address.street}
                <br />
                {order.address.city}, {order.address.state}
              </p>
            </div>
          )}

          {order.type === "PICKUP" && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                Pickup Location
              </h3>
              <p className="text-sm text-gray-600">123 Foodie Street, Lagos</p>
              <p className="text-xs text-gray-400 mt-1">
                Ready at counter when status is &ldquo;Ready&rdquo;
              </p>
            </div>
          )}

          {/* Price */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-yellow-500" />
              Payment
            </h3>
            <div className="space-y-1.5 text-sm">
              {order.subtotal != null && (
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₦{order.subtotal.toLocaleString()}</span>
                </div>
              )}
              {order.deliveryFee != null && order.deliveryFee > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span>₦{order.deliveryFee.toLocaleString()}</span>
                </div>
              )}
              {order.tax != null && order.tax > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Tax</span>
                  <span>₦{order.tax.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2 flex justify-between font-black text-gray-900">
                <span>Total</span>
                <span className="text-yellow-600">
                  ₦{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-6">
        <Link
          href="/menu"
          className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 hover:border-yellow-400 text-gray-600 hover:text-yellow-600 font-semibold rounded-xl transition text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Order Again
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 hover:border-yellow-400 text-gray-600 hover:text-yellow-600 font-semibold rounded-xl transition text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
        <Link
          href="/order"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-sm sm:ml-auto"
        >
          <Receipt className="w-4 h-4" />
          All Orders
        </Link>
      </div>
    </div>
  );
}
