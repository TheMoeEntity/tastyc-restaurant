"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;
const fmt = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

type Status = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
type TabFilter = "ALL" | "ACTIVE" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: string;
  quantity: number;
  menuItem: { id: string; name: string; image?: string };
}

interface Order {
  id: string;
  orderNumber: string;
  type: string;
  status: Status;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_COLORS: Record<Status, string> = {
  PENDING:   "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  CONFIRMED: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  PREPARING: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  READY:     "text-green-400 bg-green-500/10 border-green-500/30",
  DELIVERED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  CANCELLED: "text-red-400 bg-red-500/10 border-red-500/30",
};

const ACTIVE_STATUSES: Status[] = ["PENDING", "CONFIRMED", "PREPARING", "READY"];

const TABS: { key: TabFilter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "ACTIVE", label: "Active" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function UserOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<TabFilter>("ALL");
  const [page, setPage] = useState(1);

  const fetchOrders = (currentPage: number, currentTab: TabFilter) => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ page: String(currentPage), limit: "10" });
    if (currentTab === "ACTIVE") ACTIVE_STATUSES.forEach((s) => params.append("status", s));
    else if (currentTab === "DELIVERED") params.set("status", "DELIVERED");
    else if (currentTab === "CANCELLED") params.set("status", "CANCELLED");

    fetch(`${API}/api/orders?${params}`, { credentials: "include" })
      .then(async (r) => {
        const json = await r.json();
        if (!json.success) throw new Error(json.message);
        setOrders(json.data.orders ?? []);
        setPagination(json.data.pagination ?? { total: 0, page: 1, totalPages: 1 });
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(page, tab); }, [page, tab]); // eslint-disable-line

  const handleTabChange = (t: TabFilter) => {
    setTab(t);
    setPage(1);
  };

  const timeStr = (iso: string) =>
    new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl mb-1">My Orders</h1>
        <p className="text-white/40 text-sm">Track and manage your order history</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
              tab === key ? "bg-yellow-500 text-black" : "text-white/40 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="text-yellow-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertCircle size={24} className="text-red-400" />
          <p className="text-white/40 text-sm">{error}</p>
          <button
            onClick={() => fetchOrders(page, tab)}
            className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <ShoppingBag size={32} className="text-white/10 mx-auto" />
          <p className="text-white/30 text-sm">No orders found.</p>
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
            <div
              key={order.id}
              className="rounded-2xl border border-white/5 p-4"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-mono text-sm font-semibold">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-white/20 text-xs capitalize">
                      {order.type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs">
                    {order.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(", ")}
                  </p>
                  <p className="text-white/20 text-[10px] mt-1">{timeStr(order.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-yellow-400 font-bold text-sm">{fmt(order.total)}</span>
                  {ACTIVE_STATUSES.includes(order.status) && (
                    <Link
                      href={`/order/track/${order.id}`}
                      className="flex items-center gap-1.5 text-xs text-white/40 hover:text-yellow-400 transition"
                    >
                      <ExternalLink size={11} /> Track
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-xs">{pagination.total} orders total</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-white/40 text-xs">{page} / {pagination.totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
