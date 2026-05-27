import { cookies } from "next/headers";
import Sidebar from "@/components/sections/Dashboard/SideBar";
import DashboardTopbar from "@/components/sections/Dashboard/TopBar";
import { Toaster } from "sonner";
import VerificationBanner from "@/components/sections/Dashboard/VerificationBanner";
import { PushNotificationInit } from "@/components/sections/Dashboard/PushNotificationInit";

function getRoleFromToken(token: string): string {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );
    return (payload.role as string) ?? "CUSTOMER";
  } catch {
    return "CUSTOMER";
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tastyc_access_token")?.value ?? "";
  const role = accessToken ? getRoleFromToken(accessToken) : "CUSTOMER";
  const isVerified = cookieStore.get("tastyc_is_verified")?.value === "true";

  return (
    <div
      className="min-h-screen bg-[#0f0f0f]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <PushNotificationInit />
      <Sidebar role={role} />
      <Toaster />
      {/* On mobile: no left margin. On desktop: push right of sidebar */}
      <div className="flex flex-col min-h-screen md:ml-[220px]">
        {!isVerified && <VerificationBanner />}
        <DashboardTopbar role={role} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
