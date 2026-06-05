"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Star,
  TrendingUp,
  ShoppingBag,
  Users,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import apiFetch from "@/lib/api";
import { fmt } from "@/lib/Helper";
import type { ApiResponse } from "@/types/api.types";
import type { Analytics } from "@/types/analytics.types";
import LineChart from "@/components/ui/LineChart";
import StatCard from "@/components/ui/StatCard";

// ── Status badge ──────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10",
  CONFIRMED: "text-blue-400 bg-blue-500/10",
  PREPARING: "text-orange-400 bg-orange-500/10",
  READY: "text-green-400 bg-green-500/10",
  DELIVERED: "text-emerald-400 bg-emerald-500/10",
  CANCELLED: "text-red-400 bg-red-500/10",
  NO_SHOW: "text-gray-400 bg-gray-500/10",
  SUCCESS: "text-emerald-400 bg-emerald-500/10",
  FAILED: "text-red-400 bg-red-500/10",
};

// ── Main page ─────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 29))
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [dateApplied, setDateApplied] = useState({
    start: thirtyDaysAgo,
    end: today,
  });

  const runFetch = () => {
    setLoading(true);
    apiFetch<ApiResponse<Analytics>>(
      `/api/dashboard?startDate=${dateApplied.start}&endDate=${dateApplied.end}`,
    )
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        setData(r.data);
        setError("");
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    runFetch();
  }, [dateApplied]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="text-yellow-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertCircle size={24} className="text-red-400" />
        <p className="text-white/40 text-sm">{error}</p>
        <button
          onClick={runFetch}
          className="flex items-center gap-1.5 text-xs text-yellow-400"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  const {
    overview,
    salesTrend,
    menuPerformance,
    customerInsights,
    reservationInsights,
    recentActivity,
  } = data;
  const totalByType =
    salesTrend.ordersByType.reduce((s, o) => s + o.count, 0) || 1;
  const maxSold = Math.max(
    ...(menuPerformance.bestSellers.map((b) => b.totalQuantitySold) || [1]),
    1,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-white font-bold text-xl mb-1">Analytics</h1>
          <p className="text-white/40 text-sm">Performance overview</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick presets */}
          {[
            { label: "7d", days: 7 },
            { label: "30d", days: 30 },
            { label: "90d", days: 90 },
          ].map(({ label, days }) => (
            <button
              key={label}
              onClick={() => {
                const end = new Date().toISOString().split("T")[0];
                const start = new Date(
                  new Date().setDate(new Date().getDate() - (days - 1)),
                )
                  .toISOString()
                  .split("T")[0];
                setStartDate(start);
                setEndDate(end);
                setDateApplied({ start, end });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                dateApplied.start ===
                new Date(new Date().setDate(new Date().getDate() - (days - 1)))
                  .toISOString()
                  .split("T")[0]
                  ? "bg-yellow-500 text-black border-yellow-500"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}

          {/* Custom range */}
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-yellow-400/50"
          />
          <span className="text-white/20 text-xs">to</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={today}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-yellow-400/50"
          />
          <button
            onClick={() => setDateApplied({ start: startDate, end: endDate })}
            className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs rounded-lg transition"
          >
            Apply
          </button>

          <button
            onClick={runFetch}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Revenue"
          value={fmt(overview.thisMonth.revenue)}
          sub={`Today: ${fmt(overview.today.revenue)}`}
          change={overview.changes.revenue}
          icon={TrendingUp}
          color="yellow"
        />
        <StatCard
          label="Monthly Orders"
          value={String(overview.thisMonth.orders)}
          sub={`${overview.totals.pendingOrders} pending`}
          change={overview.changes.orders}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          label="Avg Order Value"
          value={fmt(overview.thisMonth.averageOrderValue)}
          sub="This month"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          label="Total Customers"
          value={String(overview.totals.customers)}
          sub={`${customerInsights.activeCustomersThisMonth} active this month`}
          icon={Users}
          color="purple"
        />
      </div>

      {/* ── Sales trend ── */}
      <div
        className="rounded-2xl border border-white/5 p-5"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <h2 className="text-white font-semibold text-sm mb-4">
          Revenue Trend (last 30 days)
        </h2>
        <LineChart data={salesTrend.trend} />
        <div className="flex justify-between text-xs text-white/30 mt-3">
          <span>
            Total:{" "}
            <span className="text-yellow-400 font-bold">
              {fmt(salesTrend.trend.reduce((s, d) => s + d.revenue, 0))}
            </span>
          </span>
          <span>
            Orders:{" "}
            <span className="text-white/60 font-bold">
              {salesTrend.trend.reduce((s, d) => s + d.orders, 0)}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by type */}
        <div
          className="rounded-2xl border border-white/5 p-5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h2 className="text-white font-semibold text-sm mb-4">
            Orders by Type
          </h2>
          <div className="space-y-3">
            {salesTrend.ordersByType.map(({ type, count }) => (
              <div key={type}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">
                    {type.replace("_", " ")}
                  </span>
                  <span className="text-white/40">
                    {count} ({Math.round((count / totalByType) * 100)}%)
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${(count / totalByType) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reservation insights */}
        <div
          className="rounded-2xl border border-white/5 p-5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h2 className="text-white font-semibold text-sm mb-4">
            Reservation Insights
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 rounded-xl bg-white/5">
              <p className="text-white font-bold text-2xl">
                {reservationInsights.thisMonth.total}
              </p>
              <p className="text-white/30 text-xs mt-1">This month</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <p
                className={`font-bold text-2xl ${reservationInsights.thisMonth.noShowRate > 20 ? "text-red-400" : "text-green-400"}`}
              >
                {reservationInsights.thisMonth.noShowRate}%
              </p>
              <p className="text-white/30 text-xs mt-1">No-show rate</p>
            </div>
          </div>
          <div className="space-y-2">
            {reservationInsights.thisMonth.byStatus.map(({ status, count }) => (
              <div
                key={status}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-white/50">
                  {status.replace("_", " ")}
                </span>
                <span className="text-white/70 font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Best sellers */}
        <div
          className="rounded-2xl border border-white/5 p-5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h2 className="text-white font-semibold text-sm mb-4">
            Best Sellers
          </h2>
          <div className="space-y-3">
            {menuPerformance.bestSellers
              .slice(0, 8)
              .map(({ menuItem, totalQuantitySold }, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">{menuItem.name}</span>
                    <span className="text-white/40">
                      {totalQuantitySold} sold
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full"
                      style={{
                        width: `${(totalQuantitySold / maxSold) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top rated */}
        <div
          className="rounded-2xl border border-white/5 p-5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h2 className="text-white font-semibold text-sm mb-4">Top Rated</h2>
          <div className="space-y-3">
            {menuPerformance.topRated
              .slice(0, 6)
              .map(({ menuItem, averageRating, totalReviews }, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">{menuItem.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          size={10}
                          className={
                            s < Math.round(averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-white/10"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-white/30 text-[10px]">
                      {totalReviews}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div
          className="rounded-2xl border border-white/5 p-5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Recent Orders</h2>
            <Link
              href="/dashboard/admin/orders"
              className="text-yellow-400 text-xs flex items-center gap-1 hover:text-yellow-300 transition"
            >
              View all <ArrowRight size={10} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.recentOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-semibold">
                    {order.orderNumber}
                  </p>
                  <p className="text-white/30 text-[10px] truncate">
                    {order.user.name} · {order.items[0]?.menuItem.name}
                    {order.items.length > 1 && ` +${order.items.length - 1}`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-yellow-400 text-xs font-bold">
                    {fmt(order.total)}
                  </p>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${STATUS_COLORS[order.status] ?? "text-white/40 bg-white/5"}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reservations */}
        <div
          className="rounded-2xl border border-white/5 p-5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">
              Recent Reservations
            </h2>
            <Link
              href="/dashboard/admin/reservations"
              className="text-yellow-400 text-xs flex items-center gap-1 hover:text-yellow-300 transition"
            >
              View all <ArrowRight size={10} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.recentReservations.slice(0, 5).map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-semibold">
                    {res.user.name}
                  </p>
                  <p className="text-white/30 text-[10px]">
                    {res.date.slice(0, 10)} at {res.time} · {res.partySize}{" "}
                    guests
                  </p>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${STATUS_COLORS[res.status] ?? "text-white/40 bg-white/5"}`}
                >
                  {res.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top customers ── */}
      <div
        className="rounded-2xl border border-white/5 p-5"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <h2 className="text-white font-semibold text-sm mb-4">Top Customers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {customerInsights.topCustomers.slice(0, 6).map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-xs font-semibold truncate">
                  {c.name}
                </p>
                <p className="text-white/30 text-[10px] truncate">{c.email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-white/60 text-xs">{c.totalOrders} orders</p>
                <p className="text-yellow-400/60 text-[10px]">
                  {c.loyaltyPoints} pts
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
