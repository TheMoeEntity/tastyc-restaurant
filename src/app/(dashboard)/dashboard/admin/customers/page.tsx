"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  X,
} from "lucide-react";
import Image from "next/image";
import apiFetch from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// ── Types ─────────────────────────────────────────────────────

type Role = "CUSTOMER" | "STAFF" | "KITCHEN" | "MANAGER" | "SUPERADMIN";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  loyaltyPoints: number;
  createdAt: string;
  _count: { orders: number; reservations: number };
}

interface Pagination {
  total: number;
  page: number;
  totalPages: number;
}

// ── Constants ─────────────────────────────────────────────────

const ROLES: Role[] = ["CUSTOMER", "STAFF", "KITCHEN", "MANAGER", "SUPERADMIN"];

const ROLE_COLORS: Record<Role, string> = {
  CUSTOMER: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  STAFF: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  KITCHEN: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  MANAGER: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  SUPERADMIN: "text-red-400 bg-red-500/10 border-red-500/30",
};

// ── Role badge ────────────────────────────────────────────────

function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_COLORS[role]}`}
    >
      {role}
    </span>
  );
}

// ── User actions dropdown ─────────────────────────────────────

function UserActions({
  user,
  currentUserRole,
  onRoleChange,
  onStatusChange,
}: {
  user: User;
  currentUserRole: Role;
  onRoleChange: (userId: string, role: Role) => Promise<void>;
  onStatusChange: (userId: string, isActive: boolean) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (role: Role) => {
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
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <MoreVertical size={12} />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-8 z-20 w-48 rounded-xl border border-white/10 shadow-xl overflow-hidden"
            style={{ background: "rgba(20,20,20,0.98)" }}
          >
            {/* Role assignment — SUPERADMIN only */}
            {currentUserRole === "SUPERADMIN" && (
              <div className="p-2 border-b border-white/10">
                <p className="text-white/30 text-[10px] font-semibold uppercase px-2 mb-1">
                  Assign Role
                </p>
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    disabled={user.role === role}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition flex items-center gap-2 ${user.role === role
                      ? "text-white/20 cursor-not-allowed"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <Shield size={10} />
                    {role}
                    {user.role === role && (
                      <span className="ml-auto text-[10px] text-white/20">
                        current
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Activate / Deactivate */}
            <div className="p-2">
              <button
                onClick={handleStatusChange}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition flex items-center gap-2 ${user.isActive
                  ? "text-red-400 hover:bg-red-500/10"
                  : "text-green-400 hover:bg-green-500/10"
                  }`}
              >
                {user.isActive ? (
                  <>
                    <UserX size={10} /> Deactivate Account
                  </>
                ) : (
                  <>
                    <UserCheck size={10} /> Activate Account
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [statusFilter, setStatusFilter] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [currentUserRole, setCurrentUserRole] = useState<Role>("MANAGER");
  const [currentUserId, setCurrentUserID] = useState<string>("")

  // Get current user role from auth/me
  useEffect(() => {
    apiFetch<any>("/api/auth/me")
      .then((r) => {
        setCurrentUserRole(r.data?.user?.role ?? "MANAGER");
        setCurrentUserID(r.data?.user?.id ?? "")
      })
      .catch(() => { });
  }, []);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    if (statusFilter !== "") params.set("isActive", statusFilter);

    apiFetch<any>(`/api/admin/users?${params}`)
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        setUsers(r.data.users);
        setPagination({
          total: r.data.pagination.total,
          page: r.data.pagination.page,
          totalPages: r.data.pagination.totalPages,
        });
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load users"),
      )
      .finally(() => setLoading(false));
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleRoleChange = async (userId: string, role: Role) => {
    try {
      await apiFetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        data: { role },
      });
      toast.success(`Role updated to ${role}`);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      await apiFetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        data: { isActive },
      });
      toast.success(isActive ? "User activated" : "User deactivated");
      fetchUsers();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white font-bold text-xl mb-1">User Management</h1>
        <p className="text-white/40 text-sm">{pagination.total} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 outline-none focus:border-yellow-500/50 transition"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as Role | "");
            setPage(1);
          }}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 outline-none focus:border-yellow-500/50 transition"
        >
          <option value="">All Roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as "" | "true" | "false");
            setPage(1);
          }}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 outline-none focus:border-yellow-500/50 transition"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <button
          onClick={fetchUsers}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={24} className="text-yellow-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <AlertCircle size={24} className="text-red-400" />
          <p className="text-white/40 text-sm">{error}</p>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-1.5 text-xs text-yellow-400"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/30 text-sm">No users found.</p>
        </div>
      ) : (
        <div
          className="rounded-2xl border border-white/5 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    "User",
                    "Role",
                    "Status",
                    "Orders",
                    "Loyalty",
                    "Joined",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-white/30 text-xs font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-white/3 transition-colors ${!user.isActive ? "opacity-50" : ""}`}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden shrink-0">
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              width={32}
                              height={32}
                              sizes={"100vw"}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/40 text-xs font-bold">
                              {user.name[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white/80 text-xs font-semibold">
                            {user.name} {user.id === currentUserId && "(You)"}
                          </p>
                          <p className="text-white/30 text-[10px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${user.isActive
                          ? "text-green-400 bg-green-500/10 border-green-500/30"
                          : "text-red-400 bg-red-500/10 border-red-500/30"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-green-400" : "bg-red-400"}`}
                        />
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Orders */}
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {user._count.orders}
                    </td>

                    {/* Loyalty */}
                    <td className="px-4 py-3 text-yellow-400 text-xs font-semibold">
                      {user.loyaltyPoints} pts
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3 text-white/30 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <UserActions
                        user={user}
                        currentUserRole={currentUserRole}
                        onRoleChange={handleRoleChange}
                        onStatusChange={handleStatusChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-xs">
            {pagination.total} users total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-white/40 text-xs">
              {page} / {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
