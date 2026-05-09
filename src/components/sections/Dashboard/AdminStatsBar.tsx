"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;
const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

interface Overview {
  today: { revenue: number; orders: number };
  thisMonth: { revenue: number; orders: number; newCustomers: number; averageOrderValue: number };
  changes: { revenue: number; orders: number };
  totals: { customers: number; pendingOrders: number };
}

function ChangeIndicator({ pct }: { pct: number }) {
  if (pct === 0) return null;
  const up = pct > 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-semibold ${
        up ? "text-green-400" : "text-red-400"
      }`}
    >
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

export default function AdminStatsBar() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const runFetch = () =>
    fetch(`${API}/api/dashboard/overview`, { credentials: "include" })
      .then(async (r) => {
        const json = await r.json();
        if (!json.success) throw new Error(json.message ?? "Failed to load");
        setData(json.data);
        setError("");
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      })
      .finally(() => setLoading(false));

  useEffect(() => { runFetch(); }, []);

  const retry = () => { setLoading(true); setError(""); runFetch(); };

  if (loading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 p-4 h-24 animate-pulse"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={16} />
          {error || "Failed to load stats"}
        </div>
        <button
          onClick={retry}
          className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: "Today's Revenue",
      value: fmt(data.today.revenue),
      change: data.changes.revenue,
      gradient: "from-green-400 to-emerald-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      icon: DollarSign,
    },
    {
      label: "Today's Orders",
      value: data.today.orders.toString(),
      change: data.changes.orders,
      gradient: "from-purple-400 to-violet-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      icon: ShoppingBag,
    },
    {
      label: "Month Revenue",
      value: fmt(data.thisMonth.revenue),
      change: null as number | null,
      gradient: "from-blue-400 to-cyan-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: DollarSign,
      attention: false,
    },
    {
      label: "Pending Orders",
      value: data.totals.pendingOrders.toString(),
      change: null as number | null,
      gradient: "from-yellow-400 to-orange-400",
      bg: "bg-yellow-500/10",
      border: data.totals.pendingOrders > 0 ? "border-yellow-400/60" : "border-yellow-500/20",
      icon: Clock,
      attention: data.totals.pendingOrders > 0,
    },
    {
      label: "Total Customers",
      value: data.totals.customers.toLocaleString("en-NG"),
      change: null as number | null,
      gradient: "from-pink-400 to-rose-500",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      icon: Users,
      attention: false,
    },
    {
      label: "Avg Order Value",
      value: fmt(data.thisMonth.averageOrderValue),
      change: null as number | null,
      gradient: "from-indigo-400 to-blue-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      icon: TrendingUp,
      attention: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
      {stats.map(({ label, value, change, attention, gradient, bg, border, icon: Icon }) => (
        <div
          key={label}
          className={`relative rounded-2xl p-4 border ${border} ${bg} overflow-hidden`}
        >
          <div className="flex items-start justify-between mb-2">
            <div
              className={`w-9 h-9 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center`}
            >
              <Icon size={16} className="text-white" />
            </div>
            {change !== null && <ChangeIndicator pct={change} />}
            {attention && (
              <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full">
                Needs attention
              </span>
            )}
          </div>
          <p className="text-white font-bold text-xl">{value}</p>
          <p className="text-white/40 text-xs mt-0.5">{label}</p>
          <div
            className={`absolute -right-4 -top-4 w-20 h-20 bg-linear-to-br ${gradient} opacity-10 rounded-full blur-2xl`}
          />
        </div>
      ))}
    </div>
  );
}
