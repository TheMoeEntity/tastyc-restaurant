"use client";

import { useEffect, useState } from "react";
import {
  UserPlus,
  Loader2,
  Mail,
  Trash2,
  Clock,
  Shield,
  Send,
  AlertCircle,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import apiFetch from "@/lib/api";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import type { ApiResponse } from "@/types/api.types";

// ── Types ─────────────────────────────────────────────────────

type InviteRole = "KITCHEN" | "STAFF" | "MANAGER";

interface PendingInvite {
  email: string;
  role: InviteRole;
  invitedBy: string;
  expiresInHours: number;
}

const ROLE_COLORS: Record<InviteRole, string> = {
  KITCHEN: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  STAFF: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  MANAGER: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
};

const ROLE_DESCRIPTIONS: Record<InviteRole, string> = {
  KITCHEN: "Can view and update kitchen orders",
  STAFF: "Can manage orders and reservations",
  MANAGER: "Full dashboard access except user role assignment",
};

// ── Main page ─────────────────────────────────────────────────

export default function AdminStaffPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("KITCHEN");
  const [sending, setSending] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [revokingEmail, setRevokingEmail] = useState<string | null>(null);
  const { confirm, modal } = useConfirmModal();

  const fetchInvites = async () => {
    try {
      const r = await apiFetch<ApiResponse<{ invites: PendingInvite[] }>>("/api/invite/pending");
      if (r.success) setPendingInvites(r.data.invites ?? []);
    } catch {
      // silent
    } finally {
      setLoadingInvites(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleSendInvite = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSending(true);
    try {
      const r = await apiFetch<ApiResponse>(
        "/api/invite",
        {
          method: "POST",
          data: { email: email.trim(), role },
        },
      );
      if (!r.success) throw new Error(r.message);
      toast.success(`Invite sent to ${email}`);
      setEmail("");
      fetchInvites();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send invite");
    } finally {
      setSending(false);
    }
  };

  const handleRevoke = async (inviteEmail: string) => {
    const ok = await confirm({
      title: "Revoke invite?",
      message: `The invite sent to ${inviteEmail} will be cancelled and the link will no longer work.`,
      confirmLabel: "Revoke",
      danger: true,
    });
    if (!ok) return;

    setRevokingEmail(inviteEmail);
    try {
      const r = await apiFetch<ApiResponse>(
        "/api/invite/revoke",
        {
          method: "DELETE",
          data: { email: inviteEmail },
        },
      );
      if (!r.success) throw new Error(r.message);
      toast.success("Invite revoked");
      setPendingInvites((prev) => prev.filter((i) => i.email !== inviteEmail));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to revoke");
    } finally {
      setRevokingEmail(null);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {modal}

      <div>
        <h1 className="text-white font-bold text-xl mb-1">Staff Management</h1>
        <p className="text-white/40 text-sm">
          Invite team members to join your restaurant dashboard
        </p>
      </div>

      {/* ── Invite form ── */}
      <div
        className="rounded-2xl border border-white/5 p-6 space-y-5"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <UserPlus size={16} className="text-yellow-400" />
          </div>
          <h2 className="text-white font-semibold text-sm">
            Invite Staff Member
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendInvite()}
              placeholder="kitchen@restaurant.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider">
              Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["KITCHEN", "STAFF", "MANAGER"] as InviteRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-3 rounded-xl border text-left transition ${
                    role === r
                      ? "border-yellow-500/50 bg-yellow-500/10"
                      : "border-white/10 bg-white/3 hover:border-white/20"
                  }`}
                >
                  <p
                    className={`text-xs font-bold mb-1 ${role === r ? "text-yellow-400" : "text-white/60"}`}
                  >
                    {r}
                  </p>
                  <p className="text-white/30 text-[10px] leading-relaxed">
                    {ROLE_DESCRIPTIONS[r]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSendInvite}
            disabled={sending || !email.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
          >
            {sending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {sending ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>

      {/* ── Pending invites ── */}
      <div
        className="rounded-2xl border border-white/5 p-6 space-y-4"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <Mail size={16} className="text-yellow-400" />
          </div>
          <h2 className="text-white font-semibold text-sm">Pending Invites</h2>
          {pendingInvites.length > 0 && (
            <span className="ml-auto text-xs text-white/30">
              {pendingInvites.length} pending
            </span>
          )}
        </div>

        {loadingInvites ? (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="text-yellow-400 animate-spin" />
          </div>
        ) : pendingInvites.length === 0 ? (
          <div className="text-center py-8">
            <Users size={28} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No pending invites</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingInvites.map((invite) => (
              <div
                key={invite.email}
                className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Mail size={14} className="text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">
                      {invite.email}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_COLORS[invite.role]}`}
                      >
                        {invite.role}
                      </span>
                      <span className="flex items-center gap-1 text-white/30 text-[10px]">
                        <Clock size={10} />
                        Expires in {invite.expiresInHours}h
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(invite.email)}
                  disabled={revokingEmail === invite.email}
                  className="text-red-400/60 hover:text-red-400 transition disabled:opacity-30"
                >
                  {revokingEmail === invite.email ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Info box ── */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={16} className="text-blue-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-blue-400 text-xs font-semibold">
              How invites work
            </p>
            <p className="text-white/40 text-xs leading-relaxed">
              An email is sent to the staff member with a secure link. They
              click the link, set their name and password, and their account is
              created with the role you selected. Invite links expire after 48
              hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
