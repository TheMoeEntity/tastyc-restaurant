"use client";

import { useOrderStore } from "@/store/useOrderStore";
import { useCartStore } from "@/store/useCartStore";
import { Order, OrderStatus } from "@/types";
import { CheckCircle2, Clock, XCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const statusConfig = {
  pending: { label: "Pending", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: Clock },
  preparing: { label: "Preparing", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", icon: Clock },
  ready: { label: "Ready", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle2 },
  delivered: { label: "Delivered", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: XCircle },
};

export default function UserOrderHistory() {
  const { orders, cancelOrder } = useOrderStore();
  const { items: cartItems } = useCartStore();

  const totalSpent = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Total Orders", value: orders.length, color: "from-yellow-400 to-orange-400" },
    { label: "Delivered", value: orders.filter(o => o.status === "delivered").length, color: "from-green-400 to-emerald-400" },
    { label: "Cancelled", value: orders.filter(o => o.status === "cancelled").length, color: "from-red-400 to-rose-400" },
    { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, color: "from-blue-400 to-cyan-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-white/5 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Cart reminder */}
      {cartItems.length > 0 && (
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <ShoppingBag size={16} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">You have {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart</p>
              <p className="text-white/30 text-xs">Complete your order</p>
            </div>
          </div>
          <Link
            href="/cart"
            className="shrink-0 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-lg transition flex items-center gap-1.5"
          >
            View Cart <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Order history */}
      <div className="rounded-2xl border border-white/5 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
        <h2 className="text-white font-semibold text-sm mb-4">Order History</h2>

        {orders.length === 0 ? (
          <div className="text-center py-10 space-y-4">
            <p className="text-white/30 text-sm">You haven't placed any orders yet.</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition"
            >
              Browse Menu <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <UserOrderRow key={order.id} order={order} onCancel={cancelOrder} />
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      {orders.length > 0 && (
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">Hungry again?</p>
            <p className="text-white/40 text-xs mt-0.5">Browse our full menu and place a new order</p>
          </div>
          <Link
            href="/menu"
            className="shrink-0 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-lg transition"
          >
            Order Now
          </Link>
        </div>
      )}
    </div>
  );
}

function UserOrderRow({ order, onCancel }: { order: Order; onCancel: (id: string) => void }) {
  const config = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  const canCancel = order.status === "pending" || order.status === "confirmed";

  return (
    <div
      className="flex items-center gap-4 p-3 rounded-xl border border-white/5 hover:bg-white/3 transition-colors"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      {/* Image — first item's image */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5">
        {order.items[0]?.image ? (
          <Image src={order.items[0].image} alt={order.items[0].name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={16} className="text-white/20" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium">{order.orderNumber}</p>
        <p className="text-white/30 text-xs truncate">
          {order.items.map(i => `${i.quantity}× ${i.name}`).join(", ")}
        </p>
        <p className="text-white/20 text-[10px] mt-0.5">{order.date} · {order.time}</p>
      </div>

      {/* Total */}
      <p className="text-yellow-400 font-bold text-sm shrink-0">${order.total.toFixed(2)}</p>

      {/* Status + cancel */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-medium ${config.bg} ${config.color}`}>
          <StatusIcon size={10} />
          {config.label}
        </div>
        {canCancel && (
          <button
            onClick={() => onCancel(order.id)}
            className="text-[10px] text-red-400/60 hover:text-red-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}