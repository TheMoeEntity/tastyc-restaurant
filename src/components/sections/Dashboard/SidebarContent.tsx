import { LogOut, UtensilsCrossed, X } from "lucide-react";
import Link from "next/link";

export const SidebarContent: React.FC<{
  role: string;
  pathname: string;
  links: Array<{
    label: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }>;
  handleLogout: () => void;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ pathname, links, handleLogout, setMobileOpen }) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-yellow-500 rounded-md flex items-center justify-center">
          <UtensilsCrossed size={14} className="text-black" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">
          Tastyc
        </span>
      </div>
      {/* Close button — mobile only */}
      <button
        onClick={() => setMobileOpen(false)}
        className="md:hidden text-white/40 hover:text-white transition"
      >
        <X size={18} />
      </button>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {links.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
              active
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <Icon
              size={16}
              className={
                active
                  ? "text-yellow-400"
                  : "text-white/30 group-hover:text-white/60 transition-colors"
              }
            />
            {label}
            {active && (
              <span className="ml-auto w-1 h-4 bg-yellow-400 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>

    {/* Logout */}
    <div className="px-3 py-4 border-t border-white/5">
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
      >
        <LogOut size={16} />
        Log out
      </button>
    </div>
  </div>
);
