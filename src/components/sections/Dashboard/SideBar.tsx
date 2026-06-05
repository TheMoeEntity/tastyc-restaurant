"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  BarChart2,
  Users,
  Settings,
  ChefHat,
  ShoppingBag,
  Calendar,
  QrCode,
  Star,
  MapPin,
  User,
  Truck,
  Mail,
  CalendarX,
  MessageSquare,
} from "lucide-react";
import { SidebarContent } from "./SidebarContent";
import { useLogout } from "@/hooks/useLogout";

// ── Link definitions ──────────────────────────────────────────

type NavLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export type NavSection = {
  label: string;
  links: NavLink[];
};

const adminLinks: NavLink[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/admin/orders", icon: ClipboardList },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
  {
    label: "Menu Management",
    href: "/dashboard/admin/menu",
    icon: UtensilsCrossed,
  },
  {
    label: "Reservations",
    href: "/dashboard/admin/reservations",
    icon: Calendar,
  },
  { label: "Reviews", href: "/dashboard/admin/reviews", icon: MessageSquare },
  { label: "Users", href: "/dashboard/admin/customers", icon: Users },
  { label: "Newsletter", href: "/dashboard/admin/newsletter", icon: Mail },
  {
    label: "Availability",
    href: "/dashboard/admin/availability",
    icon: CalendarX,
  },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart2 },
  { label: "QR Codes", href: "/dashboard/admin/qr", icon: QrCode },
  { href: "/dashboard/admin/staff", label: "Staff", icon: Users },
  { label: "Profile", href: "/dashboard/user/profile", icon: User },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

const kitchenLinks: NavLink[] = [
  { label: "Kitchen Board", href: "/dashboard/kitchen", icon: ChefHat },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/kitchen/settings", icon: Settings },
];

const userLinks: NavLink[] = [
  { label: "My Orders", href: "/dashboard/user", icon: ShoppingBag },
  {
    label: "Reservations",
    href: "/dashboard/user/reservations",
    icon: Calendar,
  },
  { label: "Profile", href: "/dashboard/user/profile", icon: User },
  { label: "Loyalty Points", href: "/dashboard/user/loyalty", icon: Star },
  { label: "Addresses", href: "/dashboard/user/addresses", icon: MapPin },
];

// STAFF: front-of-house — orders and reservations only
const staffLinks: NavLink[] = [
  { label: "Orders", href: "/dashboard/admin/orders", icon: ClipboardList },
  {
    label: "Reservations",
    href: "/dashboard/admin/reservations",
    icon: Calendar,
  },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
  // { label: "Deliveries", href: "/dashboard/admin/orders", icon: Truck },
];

// ── Sections per role ─────────────────────────────────────────

function getSections(role: string): NavSection[] {
  switch (role) {
    case "SUPERADMIN":
      return [
        { label: "Admin Panel", links: adminLinks },
        { label: "Kitchen", links: [kitchenLinks[0]] },
      ];
    case "MANAGER":
      return [
        { label: "Management", links: adminLinks },
        { label: "Kitchen", links: [kitchenLinks[0]] },
      ];
    case "STAFF":
      return [{ label: "Staff", links: staffLinks }];
    case "KITCHEN":
      return [{ label: "Kitchen", links: kitchenLinks }];
    case "CUSTOMER":
    default:
      return [{ label: "My Account", links: userLinks }];
  }
}

// ── Sidebar ───────────────────────────────────────────────────

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const sections = getSections(role);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { handleLogout, modal } = useLogout(() => setMobileOpen(false));

  return (
    <>
      {modal}
      <aside
        className="hidden no-scrollbar md:flex flex-col fixed left-0 top-0 h-full w-[220px] z-40 border-r border-white/5"
        style={{
          background: "rgba(15,15,15,0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <SidebarContent
          role={role}
          pathname={pathname}
          sections={sections}
          handleLogout={handleLogout}
          setMobileOpen={setMobileOpen}
        />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
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
                sections={sections}
                handleLogout={handleLogout}
                setMobileOpen={setMobileOpen}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

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
