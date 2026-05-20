"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import apiFetch from "@/lib/api";

//
const fmt = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

type BackendStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";
type BackendType = "DELIVERY" | "PICKUP" | "DINE_IN";

export interface BackendOrder {
  id: string;
  orderNumber: string;
  type: BackendType;
  status: BackendStatus;
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  tableNumber?: string | null;
  notes?: string | null;
  items: Array<{
    id: string;
    menuItemId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    menuItem: { id: string; name: string; image?: string };
    variant?: { name: string } | null;
  }>;
  user?: { id: string; name: string; email: string; phone?: string } | null;
  payment?: { status: string; amount: number } | null;
}

const STATUS_COLORS: Record<BackendStatus, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  CONFIRMED: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  PREPARING: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  READY: "text-green-400 bg-green-500/10 border-green-500/30",
  DELIVERED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  CANCELLED: "text-red-400 bg-red-500/10 border-red-500/30",
};

const ALL_STATUSES: BackendStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED",
];
const ALL_TYPES: BackendType[] = ["DELIVERY", "PICKUP", "DINE_IN"];

interface Props {
  limit?: number;
  showFilters?: boolean;
  showPagination?: boolean;
}

export default function AdminOrdersTable({
  limit = 20,
  showFilters = true,
  showPagination = true,
}: Props) {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<BackendStatus | "ALL">(
    "ALL",
  );
  const [typeFilter, setTypeFilter] = useState<BackendType | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (typeFilter !== "ALL") params.set("type", typeFilter);
      const r = await apiFetch<any>(`/api/orders?${params}`);
      if (!r.success) throw new Error(r.message ?? "Failed to load");
      setOrders(r.data.orders ?? []);
      setPagination(r.data.pagination ?? { total: 0, page: 1, totalPages: 1 });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, typeFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: BackendStatus) => {
    setUpdatingId(orderId);
    try {
      const r = await apiFetch<any>(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!r.success) throw new Error(r.message);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
      if (selectedOrder?.id === orderId)
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
    } finally {
      setUpdatingId(null);
    }
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(["ALL", ...ALL_STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition border ${
                  statusFilter === s
                    ? "bg-yellow-500 text-black border-yellow-500"
                    : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
                }`}
              >
                {s.toLowerCase()}
              </button>
            ))}
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as BackendType | "ALL");
              setPage(1);
            }}
            className="ml-auto text-xs bg-white/5 border border-white/10 text-white/60 rounded-lg px-3 py-1.5 outline-none"
          >
            <option value="ALL" className="bg-[#1a1a1a]">
              All types
            </option>
            {ALL_TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#1a1a1a]">
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="text-yellow-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertCircle size={24} className="text-red-400" />
          <p className="text-white/40 text-sm">{error}</p>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-white/30 text-sm">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  "Order #",
                  "Customer",
                  "Items",
                  "Total",
                  "Status",
                  "Time",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-white/30 text-xs font-semibold uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-white/3 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono text-white/80 text-xs">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white/80 text-xs font-medium">
                      {order.user?.name ?? "Guest"}
                    </p>
                    <p className="text-white/30 text-[10px]">
                      {order.user?.email ?? ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs max-w-[180px] truncate">
                    {order.items
                      .map((i) => `${i.quantity}× ${i.menuItem.name}`)
                      .join(", ")}
                  </td>
                  <td className="px-4 py-3 text-yellow-400 font-bold text-xs">
                    {fmt(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/30 text-xs">
                    {timeAgo(order.createdAt)}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value as BackendStatus)
                      }
                      disabled={
                        !!updatingId ||
                        order.status === "DELIVERED" ||
                        order.status === "CANCELLED"
                      }
                      className="text-[10px] bg-white/5 border border-white/10 text-white/60 rounded-lg px-2 py-1 outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-[#1a1a1a]">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-xs">
            {pagination.total} total orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-white/40 text-xs">
              {page} / {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="w-full max-w-md bg-[#0f0f0f] border-l border-white/10 h-full overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">
                {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white/40 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/40">Status</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-semibold border ${STATUS_COLORS[selectedOrder.status]}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/40">Type</span>
                <span className="text-white/80">
                  {selectedOrder.type.replace("_", " ")}
                </span>
              </div>
              {selectedOrder.tableNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Table</span>
                  <span className="text-white/80">
                    #{selectedOrder.tableNumber}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-white/40">Customer</span>
                <div className="text-right">
                  <p className="text-white/80">
                    {selectedOrder.user?.name ?? "Guest"}
                  </p>
                  <p className="text-white/30 text-[10px]">
                    {selectedOrder.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/40">Time</span>
                <span className="text-white/80" suppressHydrationWarning>
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-2">
              <p className="text-white/40 text-xs mb-3">Items</p>
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="text-white/80">
                      {item.quantity}× {item.menuItem.name}
                    </p>
                    {item.variant && (
                      <p className="text-white/30 text-[10px]">
                        {item.variant.name}
                      </p>
                    )}
                  </div>
                  <span className="text-white/50">{fmt(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-white/40">
                <span>Subtotal</span>
                <span>{fmt(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.deliveryFee > 0 && (
                <div className="flex justify-between text-white/40">
                  <span>Delivery fee</span>
                  <span>{fmt(selectedOrder.deliveryFee)}</span>
                </div>
              )}
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-{fmt(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-2">
                <span className="text-white">Total</span>
                <span className="text-yellow-400">
                  {fmt(selectedOrder.total)}
                </span>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
                <p className="text-yellow-400/60 text-xs italic">
                  {selectedOrder.notes}
                </p>
              </div>
            )}

            {selectedOrder.status !== "DELIVERED" &&
              selectedOrder.status !== "CANCELLED" && (
                <div className="border-t border-white/5 pt-4">
                  <p className="text-white/40 text-xs mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_STATUSES.filter((s) => s !== selectedOrder.status).map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(selectedOrder.id, s)}
                          disabled={!!updatingId}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition disabled:opacity-30"
                        >
                          → {s}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

            <Link
              href={`/order/track/${selectedOrder.id}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 border border-white/10 rounded-xl text-white/40 hover:text-white hover:border-white/20 text-xs transition"
            >
              <ExternalLink size={12} />
              Track Order
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
