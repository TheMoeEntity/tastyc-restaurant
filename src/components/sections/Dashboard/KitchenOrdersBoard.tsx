"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Wifi,
  WifiOff,
  Clock,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import apiFetch from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL!;

type OrderStatus = "CONFIRMED" | "PREPARING" | "READY";

interface KitchenOrderItem {
  id: string;
  quantity: number;
  menuItem: { name: string };
  variant?: { name: string } | null;
}

interface KitchenOrder {
  id: string;
  orderNumber: string;
  type: "DELIVERY" | "PICKUP" | "DINE_IN";
  status: OrderStatus;
  tableNumber?: string | null;
  notes?: string | null;
  createdAt: string;
  items: KitchenOrderItem[];
  isNew?: boolean;
}

function getCookieToken(): string {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("tastyc_access_token="))
      ?.split("=")[1] ?? ""
  );
}

function playNotification() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // Audio API may not be available
  }
}

function useTimeTicker() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(t);
  }, []);
}

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function Clock12() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return <span>{time}</span>;
}

function OrderCard({
  order,
  onUpdate,
}: {
  order: KitchenOrder;
  onUpdate: (id: string, status: OrderStatus) => Promise<void>;
}) {
  useTimeTicker();
  const [updating, setUpdating] = useState(false);
  const [flash, setFlash] = useState(order.isNew ?? false);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 3000);
    return () => clearTimeout(t);
  }, [flash]);

  const handleAction = async () => {
    const next: OrderStatus =
      order.status === "CONFIRMED" ? "PREPARING" : "READY";
    setUpdating(true);
    await onUpdate(order.id, next);
    setUpdating(false);
  };

  const actionLabel =
    order.status === "CONFIRMED" ? "Start Cooking" : "Mark Ready";

  const locationLabel =
    order.type === "DINE_IN"
      ? `Table ${order.tableNumber ?? "?"}`
      : order.type === "DELIVERY"
        ? "Delivery"
        : "Pickup";

  return (
    <div
      className={`rounded-2xl p-4 space-y-3 border transition-all duration-500 ${flash ? "ring-2 ring-yellow-400 border-yellow-400/60" : ""
        } ${order.status === "CONFIRMED"
          ? "border-yellow-500/40 bg-yellow-500/5"
          : order.status === "PREPARING"
            ? "border-orange-500/40 bg-orange-500/5"
            : "border-green-500/40 bg-green-500/5"
        }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white font-bold text-lg leading-none">
            {order.orderNumber}
          </p>
          <p className="text-white/40 text-xs mt-0.5">{locationLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-[10px]">
            {timeAgo(order.createdAt)}
          </p>
          {flash && (
            <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/20 px-1.5 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-1.5">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="text-white/70 text-sm flex items-start gap-2"
          >
            <span className="text-white/30 shrink-0">×{item.quantity}</span>
            <div>
              <span>{item.menuItem.name}</span>
              {item.variant && (
                <span className="text-white/30 text-xs ml-1">
                  ({item.variant.name})
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {order.notes && (
        <p className="text-yellow-400/70 text-xs italic border-t border-white/5 pt-2">
          {order.notes}
        </p>
      )}

      {order.status !== "READY" && (
        <button
          onClick={handleAction}
          disabled={updating}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50 ${order.status === "CONFIRMED"
            ? "bg-orange-500 hover:bg-orange-400 text-white"
            : "bg-green-500 hover:bg-green-400 text-white"
            }`}
        >
          {updating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : order.status === "CONFIRMED" ? (
            <Flame size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          {updating ? "Updating…" : actionLabel}
        </button>
      )}
    </div>
  );
}

export default function KitchenOrdersBoard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const [r1, r2, r3] = await Promise.all([
          apiFetch<any>(`/api/orders?status=CONFIRMED&limit=50`),
          apiFetch<any>(`/api/orders?status=PREPARING&limit=50`),
          apiFetch<any>(`/api/orders?status=READY&limit=50`),
        ]);
        const confirmed: KitchenOrder[] = r1.success ? (r1.data.orders ?? []) : [];
        const preparing: KitchenOrder[] = r2.success ? (r2.data.orders ?? []) : [];
        const ready: KitchenOrder[] = r3.success ? (r3.data.orders ?? []) : [];
        setOrders([...confirmed, ...preparing, ...ready]);

      } finally {
        setLoading(false);
      }
    };

    fetchActive();

    const token = getCookieToken();
    const socket = io(API, { auth: { token }, transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join-kitchen");
    });
    socket.on("disconnect", () => setConnected(false));


    socket.on("new-order", (payload: any) => {
      playNotification();

      const order: KitchenOrder = {
        id: payload.orderId,
        orderNumber: payload.orderNumber,
        type: payload.type,
        status: "CONFIRMED",
        tableNumber: payload.tableNumber ?? null,
        notes: payload.notes ?? null,
        createdAt: payload.receivedAt,
        isNew: true,
        items: payload.items.map((item: any, index: number) => ({
          id: `${payload.orderId}-${index}`,
          quantity: item.quantity,
          menuItem: { name: item.name },
          variant: item.variant ? { name: item.variant } : null,
        })),
      };

      setOrders((prev) => {
        if (prev.find((o) => o.id === order.id)) return prev;
        return [order, ...prev];
      });
    });

    socket.on(
      "order-status-updated",
      (payload: { orderId: string; status: string }) => {
        const s = payload.status as OrderStatus;
        if (["CONFIRMED", "PREPARING", "READY"].includes(s)) {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === payload.orderId ? { ...o, status: s } : o,
            ),
          );
        } else {
          // DELIVERED or CANCELLED — remove from board
          setOrders((prev) => prev.filter((o) => o.id !== payload.orderId));
        }
      },
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const r = await apiFetch<any>(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      data: { status },
    });
    if (r.success) {
      if (status === "READY") {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "READY" } : o)),
        );
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
        );
      }
    }
  };

  const confirmed = orders.filter((o) => o.status === "CONFIRMED");
  const preparing = orders.filter((o) => o.status === "PREPARING");
  const ready = orders.filter((o) => o.status === "READY");

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
      {/* Kitchen top bar */}
      <div className="flex items-center justify-between px-2 py-3 border-b border-white/5 mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-bold text-lg">Tastyc Kitchen</h1>
          <span className="text-white/30 text-sm">|</span>
          <Clock12 />
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <Wifi size={12} /> Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-red-400">
              <WifiOff size={12} /> Disconnected
            </span>
          )}
          <span className="text-white/20 text-xs ml-2">
            {orders.length} active order{orders.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={28} className="text-yellow-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-y-auto">
          {/* NEW column */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-yellow-500/20">
              <Clock size={14} className="text-yellow-400" />
              <h2 className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                New ({confirmed.length})
              </h2>
            </div>
            <div className="space-y-3">
              {confirmed.length === 0 && (
                <p className="text-white/20 text-xs text-center py-8">
                  No new orders
                </p>
              )}
              {confirmed.map((o) => (
                <OrderCard key={o.id} order={o} onUpdate={updateStatus} />
              ))}
            </div>
          </div>

          {/* PREPARING column */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-500/20">
              <Flame size={14} className="text-orange-400" />
              <h2 className="text-orange-400 font-bold text-sm uppercase tracking-wider">
                Preparing ({preparing.length})
              </h2>
            </div>
            <div className="space-y-3">
              {preparing.length === 0 && (
                <p className="text-white/20 text-xs text-center py-8">
                  Nothing cooking
                </p>
              )}
              {preparing.map((o) => (
                <OrderCard key={o.id} order={o} onUpdate={updateStatus} />
              ))}
            </div>
          </div>

          {/* READY column */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-500/20">
              <CheckCircle2 size={14} className="text-green-400" />
              <h2 className="text-green-400 font-bold text-sm uppercase tracking-wider">
                Ready ({ready.length})
              </h2>
            </div>
            <div className="space-y-3">
              {ready.length === 0 && (
                <p className="text-white/20 text-xs text-center py-8">
                  Nothing ready yet
                </p>
              )}
              {ready.map((o) => (
                <OrderCard key={o.id} order={o} onUpdate={updateStatus} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
