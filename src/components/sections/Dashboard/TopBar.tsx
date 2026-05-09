"use client";

import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Me {
  name: string;
  role: string;
}

export default function DashboardTopbar({ role }: { role: string }) {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setMe({ name: json.data.name, role: json.data.role });
      })
      .catch(() => {});
  }, []);

  const initials = me?.name
    ? me.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : role[0].toUpperCase();

  const greeting =
    role === "customer"
      ? "Welcome back"
      : role === "kitchen"
      ? "Kitchen Dashboard"
      : "Admin Panel";

  return (
    <header className="h-14 md:h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#0f0f0f]/80 backdrop-blur-sm sticky top-0 z-20">
      <p className="text-white/70 text-sm font-medium pl-10 md:pl-0">
        {me ? `Hello, ${me.name.split(" ")[0]}` : greeting}
      </p>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-48">
          <Search size={14} className="text-white/30" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white/60 placeholder-white/20 outline-none w-full"
          />
        </div>

        <button className="relative w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
        </button>

        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}
