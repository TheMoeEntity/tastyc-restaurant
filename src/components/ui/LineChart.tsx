import type { SalesTrendPoint } from "@/types/analytics.types";

interface LineChartProps {
  data: SalesTrendPoint[];
}

export default function LineChart({ data }: LineChartProps) {
  if (data.length < 2) {
    return (
      <div className="text-white/30 text-xs text-center py-8">
        Not enough data
      </div>
    );
  }

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
  const area = [`${pad},${H - pad}`, ...points, `${W - pad},${H - pad}`].join(" ");

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
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
