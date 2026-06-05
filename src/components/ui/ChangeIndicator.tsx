import { TrendingUp, TrendingDown } from "lucide-react";

export default function ChangeIndicator({ pct }: { pct: number }) {
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
