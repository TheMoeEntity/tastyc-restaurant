"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Wifi, WifiOff, Clock } from "lucide-react";
import { CheckCircle2, Flame } from "lucide-react";
import { io, Socket } from "socket.io-client";
import apiFetch from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { KitchenOrder, KitchenOrderStatus } from "@/types/order.types";
import { getCookieToken, playNotification } from "@/lib/Helper";
import KitchenOrderCard from "@/components/ui/KitchenOrderCard";
import Clock12 from "@/components/ui/Clock";

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function KitchenOrdersBoard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        type OrdersResponse = ApiResponse<{ orders: KitchenOrder[] }>;
        const [r1, r2, r3] = await Promise.all([
          apiFetch<OrdersResponse>(`/api/orders?status=CONFIRMED&limit=50`),
          apiFetch<OrdersResponse>(`/api/orders?status=PREPARING&limit=50`),
          apiFetch<OrdersResponse>(`/api/orders?status=READY&limit=50`),
        ]);
        const confirmed = r1.success ? r1.data.orders ?? [] : [];
        const preparing = r2.success ? r2.data.orders ?? [] : [];
        const ready = r3.success ? r3.data.orders ?? [] : [];
        setOrders([...confirmed, ...preparing, ...ready]);
      } finally {
        setLoading(false);
      }
    };

    fetchActive();

    const token = getCookieToken();
    const socket = io(API, { auth: { token }, transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => { setConnected(true); socket.emit("join-kitchen"); });
    socket.on("disconnect", () => setConnected(false));

    socket.on("new-order", (payload: {
      orderId: string;
      orderNumber: string;
      type: string;
      tableNumber?: string;
      notes?: string;
      receivedAt: string;
      items: Array<{ quantity: number; name: string; variant?: string }>;
    }) => {
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
        items: payload.items.map((item, index) => ({
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

    socket.on("order-status-updated", (payload: { orderId: string; status: string }) => {
      const s = payload.status as KitchenOrderStatus;
      if (["CONFIRMED", "PREPARING", "READY"].includes(s)) {
        setOrders((prev) =>
          prev.map((o) => o.id === payload.orderId ? { ...o, status: s } : o),
        );
      } else {
        setOrders((prev) => prev.filter((o) => o.id !== payload.orderId));
      }
    });

    return () => { socket.disconnect(); };
  }, []);

  const updateStatus = async (orderId: string, status: KitchenOrderStatus) => {
    const r = await apiFetch<ApiResponse<{ order: KitchenOrder }>>(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      data: { status },
    });
    if (r.success) {
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status } : o),
      );
    }
  };

  const confirmed = orders.filter((o) => o.status === "CONFIRMED");
  const preparing = orders.filter((o) => o.status === "PREPARING");
  const ready = orders.filter((o) => o.status === "READY");

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
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
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-yellow-500/20">
              <Clock size={14} className="text-yellow-400" />
              <h2 className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                New ({confirmed.length})
              </h2>
            </div>
            <div className="space-y-3">
              {confirmed.length === 0 && (
                <p className="text-white/20 text-xs text-center py-8">No new orders</p>
              )}
              {confirmed.map((o) => (
                <KitchenOrderCard key={o.id} order={o} onUpdate={updateStatus} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-500/20">
              <Flame size={14} className="text-orange-400" />
              <h2 className="text-orange-400 font-bold text-sm uppercase tracking-wider">
                Preparing ({preparing.length})
              </h2>
            </div>
            <div className="space-y-3">
              {preparing.length === 0 && (
                <p className="text-white/20 text-xs text-center py-8">Nothing cooking</p>
              )}
              {preparing.map((o) => (
                <KitchenOrderCard key={o.id} order={o} onUpdate={updateStatus} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-500/20">
              <CheckCircle2 size={14} className="text-green-400" />
              <h2 className="text-green-400 font-bold text-sm uppercase tracking-wider">
                Ready ({ready.length})
              </h2>
            </div>
            <div className="space-y-3">
              {ready.length === 0 && (
                <p className="text-white/20 text-xs text-center py-8">Nothing ready yet</p>
              )}
              {ready.map((o) => (
                <KitchenOrderCard key={o.id} order={o} onUpdate={updateStatus} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
