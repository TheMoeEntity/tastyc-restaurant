import AdminStatsBar from "@/components/sections/Dashboard/AdminStatsBar";
import AdminOrdersTable from "@/components/sections/Dashboard/AdminOdersTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl mb-1">Overview</h1>
        <p className="text-white/40 text-sm">Today&apos;s snapshot of your restaurant</p>
      </div>

      <AdminStatsBar />

      <div
        className="rounded-2xl border border-white/5 p-5"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <h2 className="text-white font-semibold text-sm mb-4">Recent Orders</h2>
        <AdminOrdersTable limit={10} showFilters={false} showPagination={false} />
      </div>
    </div>
  );
}
