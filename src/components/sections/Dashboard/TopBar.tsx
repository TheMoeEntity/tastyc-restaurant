import { Bell, Search } from "lucide-react";

export default async function DashboardTopbar({ role }: { role: string }) {
  const greeting =
    role === "customer"
      ? "Welcome back 👋"
      : role === "kitchen"
      ? "Kitchen Dashboard 🍳"
      : "Admin Panel ⚡";

  return (
    <header className="h-14 md:h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#0f0f0f]/80 backdrop-blur-sm sticky top-0 z-20">
      {/* On mobile leave space for hamburger button (44px) */}
      <p className="text-white/70 text-sm font-medium pl-10 md:pl-0">{greeting}</p>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search — hidden on mobile, shown on md+ */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-48">
          <Search size={14} className="text-white/30" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white/60 placeholder-white/20 outline-none w-full"
          />
        </div>

        {/* Bell */}
        <button className="relative w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
          {role[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}