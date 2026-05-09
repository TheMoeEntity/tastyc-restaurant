"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, RefreshCw, Star } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

type TxType = "EARN" | "REDEEM" | "EXPIRE";

interface LoyaltyTransaction {
  id: string;
  type: TxType;
  points: number;
  description: string;
  createdAt: string;
}

interface LoyaltyData {
  currentBalance: number;
  canRedeem: boolean;
  transactions: LoyaltyTransaction[];
}

const TX_COLORS: Record<TxType, string> = {
  EARN:   "text-green-400 bg-green-500/10 border-green-500/20",
  REDEEM: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  EXPIRE: "text-red-400 bg-red-500/10 border-red-500/20",
};

const MIN_REDEEM = 10;

export default function UserLoyaltyPage() {
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const runFetch = () =>
    fetch(`${API}/api/users/loyalty`, { credentials: "include" })
      .then(async (r) => {
        const json = await r.json();
        if (!json.success) throw new Error(json.message);
        setData(json.data);
        setError("");
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));

  useEffect(() => { runFetch(); }, []); // eslint-disable-line

  const retry = () => { setLoading(true); runFetch(); };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={24} className="text-yellow-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertCircle size={24} className="text-red-400" />
        <p className="text-white/40 text-sm">{error}</p>
        <button onClick={retry} className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300">
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  const { currentBalance, canRedeem, transactions } = data;
  const progress = Math.min((currentBalance / MIN_REDEEM) * 100, 100);
  const potentialDiscount = currentBalance * 50;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl mb-1">Loyalty Points</h1>
        <p className="text-white/40 text-sm">Earn points on every order and redeem for discounts</p>
      </div>

      {/* Balance card */}
      <div
        className="rounded-2xl border border-yellow-500/20 p-6 space-y-4"
        style={{ background: "rgba(234,179,8,0.05)" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Star size={18} className="text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <p className="text-white/40 text-xs">Current Balance</p>
            <p className="text-yellow-400 font-bold text-4xl leading-none">{currentBalance}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white/30">
            <span>{currentBalance} / {MIN_REDEEM} points to redeem</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-white/40 text-xs">Potential discount</p>
            <p className="text-white font-bold text-lg">
              ₦{potentialDiscount.toLocaleString("en-NG")}
            </p>
          </div>
          <div
            className={`px-3 py-1.5 rounded-xl text-sm font-bold border ${
              canRedeem
                ? "bg-green-500/15 border-green-500/30 text-green-400"
                : "bg-white/5 border-white/10 text-white/30"
            }`}
          >
            {canRedeem ? "Can Redeem" : "Not eligible yet"}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div
        className="rounded-2xl border border-white/5 p-5"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <h2 className="text-white font-semibold text-sm mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-8">No transactions yet.</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl border border-white/5"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${TX_COLORS[tx.type]}`}
                  >
                    {tx.type}
                  </span>
                  <p className="text-white/60 text-xs">{tx.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-bold ${
                      tx.type === "EARN" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {tx.type === "EARN" ? "+" : "-"}{Math.abs(tx.points)} pts
                  </p>
                  <p className="text-white/20 text-[10px]">
                    {new Date(tx.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
