"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, RefreshCw, Star } from "lucide-react";
import apiFetch from "@/lib/api";

//
const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

interface SalesTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}
interface OrderByType {
  type: string;
  count: number;
}
interface BestSeller {
  menuItem: { name: string };
  totalQuantitySold: number;
}
interface TopRated {
  menuItem: { name: string };
  averageRating: number;
  totalReviews: number;
}
interface TopCustomer {
  name: string;
  email: string;
  totalOrders: number;
  loyaltyPoints: number;
}

interface Analytics {
  salesTrend: { trend: SalesTrendPoint[]; ordersByType: OrderByType[] };
  menuPerformance: { bestSellers: BestSeller[]; topRated: TopRated[] };
  customerInsights: { topCustomers: TopCustomer[] };
}

function LineChart({ data }: { data: SalesTrendPoint[] }) {
  if (data.length < 2)
    return (
      <div className="text-white/30 text-xs text-center py-8">
        Not enough data
      </div>
    );
  const revenues = data.map((d) => d.revenue);
  const min = Math.min(...revenues);
  const max = Math.max(...revenues);
  const range = max - min || 1;
  const W = 1000;
  const H = 180;
  const pad = 10;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((d.revenue - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  });
  const area = [`${pad},${H - pad}`, ...points, `${W - pad},${H - pad}`].join(
    " ",
  );

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#chartGrad)" />
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#eab308"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {data.map((d, i) => {
          const x = pad + (i / (data.length - 1)) * (W - pad * 2);
          const y = H - pad - ((d.revenue - min) / range) * (H - pad * 2);
          return <circle key={i} cx={x} cy={y} r="3.5" fill="#eab308" />;
        })}
      </svg>
      <div className="flex justify-between text-[10px] text-white/20 mt-1 px-1">
        <span>{data[0]?.date?.slice(5)}</span>
        <span>{data[Math.floor(data.length / 2)]?.date?.slice(5)}</span>
        <span>{data[data.length - 1]?.date?.slice(5)}</span>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const runFetch = () =>
    apiFetch<any>(`/api/dashboard`)
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        setData(r.data);
        setError("");
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));

  useEffect(() => {
    runFetch();
  }, []); // eslint-disable-line

  const retry = () => {
    setLoading(true);
    runFetch();
  };

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
          onClick={retry}
          className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  const { salesTrend, menuPerformance, customerInsights } = data;
  const totalByType =
    salesTrend.ordersByType.reduce((s, o) => s + o.count, 0) || 1;
  const maxSold = Math.max(
    ...(menuPerformance.bestSellers.map((b) => b.totalQuantitySold) || [1]),
    1,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl mb-1">Analytics</h1>
        <p className="text-white/40 text-sm">Performance overview</p>
      </div>

      {/* Sales Trend */}
      <div
        className="rounded-2xl border border-white/5 p-5"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <h2 className="text-white font-semibold text-sm mb-4">
          Sales Trend (last 30 days)
        </h2>
        <LineChart data={salesTrend.trend} />
        <div className="flex justify-between text-xs text-white/30 mt-3">
          <span>
            Total revenue:{" "}
            <span className="text-yellow-400 font-bold">
              {fmt(salesTrend.trend.reduce((s, d) => s + d.revenue, 0))}
            </span>
          </span>
          <span>
            Total orders:{" "}
            <span className="text-white/60 font-bold">
              {salesTrend.trend.reduce((s, d) => s + d.orders, 0)}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Type */}
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
                    className="h-full bg-yellow-500 rounded-full transition-all"
                    style={{ width: `${(count / totalByType) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Sellers */}
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

        {/* Top Rated */}
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
                      {totalReviews} reviews
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Customers */}
        <div
          className="rounded-2xl border border-white/5 p-5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h2 className="text-white font-semibold text-sm mb-4">
            Top Customers
          </h2>
          <div className="space-y-3">
            {customerInsights.topCustomers.slice(0, 6).map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-medium truncate">
                    {c.name}
                  </p>
                  <p className="text-white/30 text-[10px] truncate">
                    {c.email}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white/60 text-xs">
                    {c.totalOrders} orders
                  </p>
                  <p className="text-yellow-400/60 text-[10px]">
                    {c.loyaltyPoints} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
