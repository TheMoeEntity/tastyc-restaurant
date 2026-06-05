"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import apiFetch from "@/lib/api";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import type { ApiResponse } from "@/types/api.types";

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  isDefault: boolean;
}

const emptyForm = {
  label: "",
  street: "",
  city: "",
  state: "",
  isDefault: false,
};

export default function UserAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { confirm: confirmDel, modal } = useConfirmModal();

  const runFetch = () =>
    apiFetch<ApiResponse<{ addresses: Address[] }>>(`/api/users/addresses`)
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        setAddresses(r.data?.addresses ?? []);
        setError("");
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));

  useEffect(() => {
    runFetch();
  }, []); // eslint-disable-line

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.label || !form.street || !form.city || !form.state) return;
    setSaving(true);
    try {
      const url = editingId
        ? `/api/users/addresses/${editingId}` // ← add leading slash
        : `/api/users/addresses`; // ← add leading slash
      const method = editingId ? "PATCH" : "POST";
      const r = await apiFetch<ApiResponse<{ addresses: Address[] }>>(url, {
        method,
        data: form,
      });
      if (!r.success) throw new Error(r.message);
      setShowForm(false);
      setEditingId(null);
      runFetch();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save address",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirmDel({
      title: "Delete address?",
      message: `This will delete this address. This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    setDeletingId(id);
    try {
      const r = await apiFetch<ApiResponse<{ addresses: Address[] }>>(`/api/users/addresses/${id}`, {
        method: "DELETE",
      });
      if (!r.success) throw new Error(r.message);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {modal}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl mb-1">Addresses</h1>
            <p className="text-white/40 text-sm">
              Manage your saved delivery addresses
            </p>
          </div>
          {!showForm && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition"
            >
              <Plus size={14} /> Add Address
            </button>
          )}
        </div>

        {/* Inline form */}
        {showForm && (
          <div
            className="rounded-2xl border border-white/10 p-5 space-y-4"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold text-sm">
                {editingId ? "Edit Address" : "New Address"}
              </p>
              <button
                onClick={() => setShowForm(false)}
                className="text-white/30 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="Label (e.g. Home, Work) *"
                value={form.label}
                onChange={(e) =>
                  setForm((p) => ({ ...p, label: e.target.value }))
                }
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
              />
              <input
                placeholder="Street address *"
                value={form.street}
                onChange={(e) =>
                  setForm((p) => ({ ...p, street: e.target.value }))
                }
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
              />
              <input
                placeholder="City *"
                value={form.city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, city: e.target.value }))
                }
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
              />
              <input
                placeholder="State *"
                value={form.state}
                onChange={(e) =>
                  setForm((p) => ({ ...p, state: e.target.value }))
                }
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isDefault: e.target.checked }))
                }
                className="rounded accent-yellow-500"
              />
              Set as default address
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-white/10 rounded-xl text-white/60 hover:text-white text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  saving ||
                  !form.label ||
                  !form.street ||
                  !form.city ||
                  !form.state
                }
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle size={14} />
                )}
                Save
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="text-yellow-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 text-red-400 text-sm py-8">
            <AlertCircle size={16} /> {error}
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <MapPin size={32} className="text-white/10 mx-auto" />
            <p className="text-white/30 text-sm">No saved addresses yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`rounded-2xl border p-4 ${
                  addr.isDefault
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "border-white/5"
                }`}
                style={
                  addr.isDefault ? {} : { background: "rgba(255,255,255,0.03)" }
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-white/40 shrink-0" />
                      <span className="text-white font-semibold text-sm">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-white/50 text-xs pl-5">
                      {addr.street}, {addr.city}, {addr.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(addr)}
                      className="text-white/30 hover:text-white transition"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      disabled={deletingId === addr.id}
                      className="text-red-400/50 hover:text-red-400 transition disabled:opacity-50"
                    >
                      {deletingId === addr.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
