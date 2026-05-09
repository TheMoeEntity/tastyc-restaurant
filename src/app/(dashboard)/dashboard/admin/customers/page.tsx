"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface TopCustomer {
  name: string;
  email: string;
  totalOrders: number;
  loyaltyPoints: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const runFetch = () =>
    fetch(`${API}/api/dashboard`, { credentials: "include" })
      .then(async (r) => {
        const json = await r.json();
        if (!json.success) throw new Error(json.message);
        setCustomers(json.data?.customerInsights?.topCustomers ?? []);
        setError("");
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));

  useEffect(() => { runFetch(); }, []); // eslint-disable-line

  const retry = () => { setLoading(true); runFetch(); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl mb-1">Customers</h1>
        <p className="text-white/40 text-sm">Top customers by order volume</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={24} className="text-yellow-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <AlertCircle size={24} className="text-red-400" />
          <p className="text-white/40 text-sm">{error}</p>
          <button onClick={retry} className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Rank", "Name", "Email", "Total Orders", "Loyalty Points"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-white/30 text-xs font-semibold uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((c, i) => (
                <tr key={c.email} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold">
                      {i + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/80 text-xs font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-white/40 text-xs">{c.email}</td>
                  <td className="px-4 py-3 text-white/60 text-xs">{c.totalOrders}</td>
                  <td className="px-4 py-3 text-yellow-400 text-xs font-semibold">{c.loyaltyPoints} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
