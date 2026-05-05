"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  BarChart2,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChefHat,
  ShoppingBag,
  X,
} from "lucide-react";
import { SidebarContent } from "./SidebarContent";

const adminLinks = [
  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Menu", href: "/dashboard/admin/menu", icon: UtensilsCrossed },
  { label: "Order List", href: "/dashboard/admin/orders", icon: ClipboardList },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart2 },
  { label: "Teams", href: "/dashboard/admin/teams", icon: Users },
  { label: "Message", href: "/dashboard/admin/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

const kitchenLinks = [
  { label: "Orders", href: "/dashboard/kitchen", icon: ChefHat },
  {
    label: "Menu Items",
    href: "/dashboard/kitchen/menu",
    icon: UtensilsCrossed,
  },
  { label: "Settings", href: "/dashboard/kitchen/settings", icon: Settings },
];

const userLinks = [
  { label: "My Orders", href: "/dashboard/user", icon: ShoppingBag },
  { label: "Browse Menu", href: "/menu", icon: UtensilsCrossed },
  { label: "Messages", href: "/dashboard/user/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/user/settings", icon: Settings },
];

function getLinks(role: string) {
  if (role === "kitchen") return kitchenLinks;
  if (role === "customer") return userLinks;
  return adminLinks;
}

// Exported so DashboardTopbar can trigger it
export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const links = getLinks(role);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <>
      {/* ── DESKTOP: fixed sidebar ── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[220px] z-40 border-r border-white/5"
        style={{
          background: "rgba(15,15,15,0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <SidebarContent
          role={role}
          pathname={pathname}
          links={links}
          handleLogout={handleLogout}
          setMobileOpen={setMobileOpen}
        />
      </aside>

      {/* ── MOBILE: hamburger trigger (rendered inside topbar via data attr) ── */}
      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[260px] z-50 md:hidden border-r border-white/5"
              style={{
                background: "rgba(15,15,15,0.98)",
                backdropFilter: "blur(20px)",
              }}
            >
              <SidebarContent
                role={role}
                pathname={pathname}
                links={links}
                handleLogout={handleLogout}
                setMobileOpen={setMobileOpen}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Hamburger button — floats in top-left on mobile, hidden on desktop */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition"
      >
        <span className="flex flex-col gap-1">
          <span className="w-4 h-0.5 bg-current rounded" />
          <span className="w-4 h-0.5 bg-current rounded" />
          <span className="w-4 h-0.5 bg-current rounded" />
        </span>
      </button>
    </>
  );
}
