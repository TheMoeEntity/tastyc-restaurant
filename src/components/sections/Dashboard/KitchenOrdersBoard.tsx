"use client";

import { useOrderStore } from "@/store/useOrderStore";
import { Order, OrderStatus } from "@/types";
import { Clock, Flame, CheckCircle2, AlertCircle } from "lucide-react";

const kitchenStatuses: OrderStatus[] = ["pending", "confirmed", "preparing", "ready"];

const statusConfig = {
  pending: {
    label: "New",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    icon: AlertCircle,
    next: "preparing" as OrderStatus,
    nextLabel: "Start Preparing",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    icon: Clock,
    next: "preparing" as OrderStatus,
    nextLabel: "Start Preparing",
  },
  preparing: {
    label: "Preparing",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/30",
    icon: Flame,
    next: "ready" as OrderStatus,
    nextLabel: "Mark Ready",
  },
  ready: {
    label: "Ready",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
    icon: CheckCircle2,
    next: "delivered" as OrderStatus,
    nextLabel: "Mark Delivered",
  },
};

export default function KitchenOrdersBoard() {
  const { orders, updateStatus } = useOrderStore();

  const activeOrders = orders.filter((o) =>
    kitchenStatuses.includes(o.status)
  );

  const stats = [
    { label: "New Orders", value: orders.filter(o => o.status === "pending").length, color: "from-yellow-400 to-orange-400" },
    { label: "Preparing", value: orders.filter(o => o.status === "preparing").length, color: "from-orange-400 to-red-400" },
    { label: "Ready", value: orders.filter(o => o.status === "ready").length, color: "from-green-400 to-emerald-400" },
    { label: "Done Today", value: orders.filter(o => o.status === "delivered" && o.date === new Date().toISOString().split("T")[0]).length, color: "from-blue-400 to-cyan-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-white/5 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Board header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold">Live Order Queue</h2>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <Clock size={12} />
          <span>{activeOrders.length} active order{activeOrders.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="text-center py-16 text-white/20 text-sm rounded-2xl border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
          No active orders right now. New orders from customers will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeOrders.map((order) => (
            <KitchenOrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}

function KitchenOrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}) {
  const config = statusConfig[order.status as keyof typeof statusConfig];
  if (!config) return null;
  const StatusIcon = config.icon;

  return (
    <div
      className={`rounded-2xl border p-4 space-y-3 ${config.bg}`}
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white font-semibold text-sm">{order.orderNumber}</p>
          <p className="text-white/40 text-xs capitalize">
            {order.orderType === "dine-in"
              ? `Table ${order.tableNumber ?? "?"}`
              : order.orderType}
          </p>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${config.color}`}>
          <StatusIcon size={12} />
          {config.label}
        </div>
      </div>

      <ul className="space-y-1">
        {order.items.map((item) => (
          <li key={item.id} className="text-white/60 text-xs flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
            {item.quantity}× {item.name}
          </li>
        ))}
      </ul>

      {order.specialInstructions && (
        <p className="text-yellow-400/60 text-xs italic border-t border-white/5 pt-2">
          "{order.specialInstructions}"
        </p>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <span className="text-white/20 text-[10px]">{order.time}</span>
        <button
          onClick={() => onUpdateStatus(order.id, config.next)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition"
        >
          {config.nextLabel}
        </button>
      </div>
    </div>
  );
}