"use client";

import { useOrderStore } from "@/store/useOrderStore";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, DollarSign, Clock, CheckCircle2 } from "lucide-react";

export default function AdminStatsBar() {
  const { orders } = useOrderStore();

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter((o) => o.date === todayStr);
  const todayRevenue = todayOrders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const pending = orders.filter((o) => o.status === "pending").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;

  const stats = [
    {
      label: "Today's Revenue",
      value: `$${todayRevenue.toFixed(2)}`,
      gradient: "from-green-400 to-emerald-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      icon: DollarSign,
    },
    {
      label: "Today's Orders",
      value: todayOrders.length.toString(),
      gradient: "from-purple-400 to-violet-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      icon: ShoppingBag,
    },
    {
      label: "Pending",
      value: pending.toString(),
      gradient: "from-yellow-400 to-orange-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      icon: Clock,
    },
    {
      label: "Total Delivered",
      value: delivered.toString(),
      gradient: "from-blue-400 to-cyan-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map(({ label, value, gradient, bg, border, icon: Icon }) => (
        <div
          key={label}
          className={`relative rounded-2xl p-4 border ${border} ${bg} overflow-hidden`}
        >
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
            <Icon size={16} className="text-white" />
          </div>
          <p className="text-white font-bold text-xl">{value}</p>
          <p className="text-white/40 text-xs mt-0.5">{label}</p>
          <div className={`absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl`} />
        </div>
      ))}
    </div>
  );
}