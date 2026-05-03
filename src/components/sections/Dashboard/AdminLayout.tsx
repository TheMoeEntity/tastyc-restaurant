"use client";

import { ReactNode } from "react";
import AdminSidebar from "./SideBar";
import AdminTopbar from "./TopBar";

type Props = {
  children: ReactNode;
  role: "customer" | "staff" | "kitchen" | "manager" | "superadmin";
};

export default function AdminLayout({ children, role }: Props) {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <AdminSidebar role={role} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <AdminTopbar />

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}