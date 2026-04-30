"use client";

import AdminLayout from "@/components/sections/Dashboard/AdminLayout";

export default function AdminDashboardPage() {
  return (
    <AdminLayout role="manager">
      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard Overview
      </h1>
    </AdminLayout>
  );
}