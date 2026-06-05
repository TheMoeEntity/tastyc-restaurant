"use client";

import { useState } from "react";
import { Loader2, MoreVertical, Shield, UserCheck, UserX } from "lucide-react";
import type { AdminUser, UserRole } from "@/types/user.types";
import { USER_ROLES } from "@/types/user.types";

interface UserActionsProps {
  user: AdminUser;
  currentUserRole: UserRole;
  onRoleChange: (userId: string, role: UserRole) => Promise<void>;
  onStatusChange: (userId: string, isActive: boolean) => Promise<void>;
}

export default function UserActions({
  user,
  currentUserRole,
  onRoleChange,
  onStatusChange,
}: UserActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (role: UserRole) => {
    setLoading(true);
    setOpen(false);
    await onRoleChange(user.id, role);
    setLoading(false);
  };

  const handleStatusChange = async () => {
    setLoading(true);
    setOpen(false);
    await onStatusChange(user.id, !user.isActive);
    setLoading(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition disabled:opacity-30"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <MoreVertical size={12} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-8 z-20 w-48 rounded-xl border border-white/10 shadow-xl overflow-hidden"
            style={{ background: "rgba(20,20,20,0.98)" }}
          >
            {currentUserRole === "SUPERADMIN" && (
              <div className="p-2 border-b border-white/10">
                <p className="text-white/30 text-[10px] font-semibold uppercase px-2 mb-1">
                  Assign Role
                </p>
                {USER_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    disabled={user.role === role}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition flex items-center gap-2 ${
                      user.role === role
                        ? "text-white/20 cursor-not-allowed"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Shield size={10} />
                    {role}
                    {user.role === role && (
                      <span className="ml-auto text-[10px] text-white/20">current</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="p-2">
              <button
                onClick={handleStatusChange}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition flex items-center gap-2 ${
                  user.isActive
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-green-400 hover:bg-green-500/10"
                }`}
              >
                {user.isActive ? (
                  <><UserX size={10} /> Deactivate Account</>
                ) : (
                  <><UserCheck size={10} /> Activate Account</>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
