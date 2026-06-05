import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StatColor = "yellow" | "blue" | "green" | "purple";

const COLOR_MAP: Record<StatColor, string> = {
  yellow: "text-yellow-400 bg-yellow-500/10",
  blue: "text-blue-400 bg-blue-500/10",
  green: "text-green-400 bg-green-500/10",
  purple: "text-purple-400 bg-purple-500/10",
};

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  change?: number;
  icon: LucideIcon;
  color?: StatColor;
}

export default function StatCard({
  label,
  value,
  sub,
  change,
  icon: Icon,
  color = "yellow",
}: StatCardProps) {
  return (
    <div
      className="rounded-2xl border border-white/5 p-5"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 text-xs mb-1">{label}</p>
          <p className="text-white font-bold text-2xl">{value}</p>
          {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${COLOR_MAP[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      {change !== undefined && (
        <div
          className={`flex items-center gap-1 mt-3 text-xs font-semibold ${change >= 0 ? "text-green-400" : "text-red-400"}`}
        >
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}% vs last month
        </div>
      )}
    </div>
  );
}
