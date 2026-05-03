import AdminStatsBar from "@/components/sections/Dashboard/AdminStatsBar";
import AdminOrdersTable from "@/components/sections/Dashboard/AdminOdersTable";
import { TrendingUp, ShoppingBag } from "lucide-react";
import Image from "next/image";

const trendingOrders = [
  { name: "Chicken Pot Pie", price: "$299", img: "/assets/homeImg1.jpg" },
  { name: "Massed Salad", price: "$245", img: "/assets/homeImg2.jpg" },
  { name: "Rice Toppings", price: "$225", img: "/assets/homeImg3.jpg" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">

      {/* Live stats from order store */}
      <AdminStatsBar />

      {/* Orders table */}
      <div className="rounded-2xl border border-white/5 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
        <h2 className="text-white font-semibold text-sm mb-4">All Orders</h2>
        <AdminOrdersTable />
      </div>

      {/* Trending — static for now */}
      <div className="rounded-2xl border border-white/5 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-sm">Trending Items</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {trendingOrders.map(({ name, price, img }) => (
            <div key={name} className="rounded-xl overflow-hidden border border-white/5 group cursor-pointer">
              <div className="relative h-28 overflow-hidden">
                <Image src={img} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-white text-xs font-medium">{name}</span>
                <span className="text-yellow-400 text-xs font-bold">{price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}