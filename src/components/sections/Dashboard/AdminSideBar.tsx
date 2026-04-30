"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  ChefHat,
  Settings,
  LogOut,
} from "lucide-react";
import type { SidebarItem, UserRole } from "@/types/auth";

type Props = {
  role: UserRole;
};

export default function AdminSidebar({ role }: Props) {
  const pathname = usePathname();

  const items: SidebarItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Orders",
      href: "/dashboard/admin/orders",
      icon: <ShoppingCart size={18} />,
    },
    {
      label: "Customers",
      href: "/dashboard/admin/customers",
      icon: <Users size={18} />,
      roles: ["manager", "superadmin"],
    },
    {
      label: "Kitchen",
      href: "/dashboard/kitchen",
      icon: <ChefHat size={18} />,
      roles: ["kitchen", "manager"],
    },
    {
      label: "Settings",
      href: "/dashboard/admin/settings",
      icon: <Settings size={18} />,
      roles: ["superadmin"],
    },
  ];

  // filter based on role
  const filteredItems = items.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });

  return (
    <aside className="w-[260px] h-screen bg-black text-white flex flex-col justify-between p-5">

      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Tastyc</h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>

        {/* NAV ITEMS */}
        <nav className="space-y-2">
          {filteredItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-yellow-500 text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <button
        onClick={() => {
          document.cookie = "token=; path=/; max-age=0";
          document.cookie = "role=; path=/; max-age=0";
          localStorage.removeItem("user");
          window.location.href = "/auth/login";
        }}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}