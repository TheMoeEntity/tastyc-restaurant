import { cookies } from "next/headers";
import Sidebar from "@/components/sections/Dashboard/SideBar";
import DashboardTopbar from "@/components/sections/Dashboard/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value ?? "customer";

  return (
    <div className="min-h-screen bg-[#0f0f0f]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar role={role} />
      {/* On mobile: no left margin. On desktop: push right of sidebar */}
      <div className="flex flex-col min-h-screen md:ml-[220px]">
        <DashboardTopbar role={role} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}