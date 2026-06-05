"use client";

import { useEffect, useState } from "react";
import { Loader2, Flame, CheckCircle2 } from "lucide-react";
import type { KitchenOrder, KitchenOrderStatus } from "@/types/order.types";
import { timeAgo } from "@/lib/Helper";
import { useTimeTicker } from "@/hooks/useTimeTicker";

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onUpdate: (id: string, status: KitchenOrderStatus) => Promise<void>;
}

export default function KitchenOrderCard({ order, onUpdate }: KitchenOrderCardProps) {
  useTimeTicker();
  const [updating, setUpdating] = useState(false);
  const [flash, setFlash] = useState(order.isNew ?? false);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 3000);
    return () => clearTimeout(t);
  }, [flash]);

  const handleAction = async () => {
    const next: KitchenOrderStatus =
      order.status === "CONFIRMED" ? "PREPARING" : "READY";
    setUpdating(true);
    await onUpdate(order.id, next);
    setUpdating(false);
  };

  const actionLabel = order.status === "CONFIRMED" ? "Start Cooking" : "Mark Ready";
  const locationLabel =
    order.type === "DINE_IN"
      ? `Table ${order.tableNumber ?? "?"} · Pay on delivery`
      : order.type === "DELIVERY"
        ? "Delivery · Prepaid"
        : "Pickup · Prepaid";

  return (
    <div
      className={`rounded-2xl p-4 space-y-3 border transition-all duration-500 ${
        flash ? "ring-2 ring-yellow-400 border-yellow-400/60" : ""
      } ${
        order.status === "CONFIRMED"
          ? "border-yellow-500/40 bg-yellow-500/5"
          : order.status === "PREPARING"
            ? "border-orange-500/40 bg-orange-500/5"
            : "border-green-500/40 bg-green-500/5"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white font-bold text-lg leading-none">{order.orderNumber}</p>
          <p className="text-white/40 text-xs mt-0.5">{locationLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-[10px]">{timeAgo(order.createdAt)}</p>
          {flash && (
            <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/20 px-1.5 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-1.5">
        {order.items.map((item) => (
          <li key={item.id} className="text-white/70 text-sm flex items-start gap-2">
            <span className="text-white/30 shrink-0">×{item.quantity}</span>
            <div>
              <span>{item.menuItem.name}</span>
              {item.variant && (
                <span className="text-white/30 text-xs ml-1">({item.variant.name})</span>
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
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50 ${
            order.status === "CONFIRMED"
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
