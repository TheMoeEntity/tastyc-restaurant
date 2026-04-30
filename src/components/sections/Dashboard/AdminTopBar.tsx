"use client";

import { Bell, Search } from "lucide-react";

export default function AdminTopbar() {
  return (
    <header className="h-[70px] bg-white border-b flex items-center justify-between px-6">

      {/* SEARCH */}
      <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg w-[300px]">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        <button className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
          <div className="text-sm">
            <p className="font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-400">Manager</p>
          </div>
        </div>

      </div>
    </header>
  );
}