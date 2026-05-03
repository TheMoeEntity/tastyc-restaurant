"use client";

import { useOrderStore } from "@/store/useOrderStore";
import { Order, OrderStatus } from "@/types";
import { useState } from "react";
import { CheckCircle2, Clock, Flame, XCircle, ChevronDown } from "lucide-react";

const statusColors: Record<OrderStatus, string> = {
  pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  confirmed: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  preparing: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  ready: "text-green-400 bg-green-500/10 border-green-500/30",
  delivered: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  cancelled: "text-red-400 bg-red-500/10 border-red-500/30",
};

const allStatuses: OrderStatus[] = [
  "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"
];

export default function AdminOrdersTable() {
  const { orders, updateStatus, cancelOrder } = useOrderStore();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", ...allStatuses] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition border ${
              filter === s
                ? "bg-yellow-500 text-black border-yellow-500"
                : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
            }`}
          >
            {s} {s === "all" ? `(${orders.length})` : `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-white/30 text-sm">
          No orders yet. Orders placed from the menu will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <AdminOrderRow
              key={order.id}
              order={order}
              onUpdateStatus={updateStatus}
              onCancel={cancelOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AdminOrderRow({
  order,
  onUpdateStatus,
  onCancel,
}: {
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onCancel: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl border border-white/5 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      {/* Row header */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm">{order.orderNumber}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${statusColors[order.status]}`}>
              {order.status}
            </span>
            <span className="text-white/20 text-xs capitalize">· {order.orderType}</span>
          </div>
          <p className="text-white/40 text-xs mt-0.5">
            {order.customerName} · {order.date} {order.time}
          </p>
        </div>

        <span className="text-yellow-400 font-bold text-sm shrink-0">${order.total.toFixed(2)}</span>

        {/* Status updater */}
        <select
          value={order.status}
          onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
          disabled={order.status === "cancelled" || order.status === "delivered"}
          className="text-xs bg-white/5 border border-white/10 text-white/60 rounded-lg px-2 py-1.5 outline-none disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {allStatuses.map((s) => (
            <option key={s} value={s} className="bg-[#1a1a1a]">{s}</option>
          ))}
        </select>

        <button
          onClick={() => setExpanded(!expanded)}
          className={`text-white/30 hover:text-white transition ${expanded ? "rotate-180" : ""}`}
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Expanded items */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-xs">
              <span className="text-white/50">{item.quantity}× {item.name}</span>
              <span className="text-white/30">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-white/5 pt-2 flex justify-between text-xs font-bold">
            <span className="text-white/40">Total</span>
            <span className="text-yellow-400">${order.total.toFixed(2)}</span>
          </div>
          {order.specialInstructions && (
            <p className="text-white/30 text-xs italic mt-1">Note: {order.specialInstructions}</p>
          )}
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <button
              onClick={() => onCancel(order.id)}
              className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition"
            >
              <XCircle size={12} /> Cancel Order
            </button>
          )}
        </div>
      )}
    </div>
  );
}