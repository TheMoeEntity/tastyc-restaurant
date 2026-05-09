"use client";

import { ReactNode } from "react";
import AdminSidebar from "./SideBar";
import AdminTopbar from "./TopBar";

type Props = {
  children: ReactNode;
  role: string;
};

export default function AdminLayout({ children, role }: Props) {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar role={role} />
      <div className="flex flex-col min-h-screen md:ml-[220px]">
        <AdminTopbar role={role} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
