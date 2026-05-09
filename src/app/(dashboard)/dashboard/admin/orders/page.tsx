import AdminOrdersTable from "@/components/sections/Dashboard/AdminOdersTable";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl mb-1">Orders</h1>
        <p className="text-white/40 text-sm">Manage and update all orders</p>
      </div>
      <div
        className="rounded-2xl border border-white/5 p-5"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <AdminOrdersTable />
      </div>
    </div>
  );
}
