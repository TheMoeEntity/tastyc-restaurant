"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, RefreshCw, Calendar } from "lucide-react";
import apiFetch from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import {
  type Reservation,
  type ReservationStatus,
  RESERVATION_STATUS_COLORS as STATUS_COLORS,
} from "@/types/reservation.types";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [tableInput, setTableInput] = useState<Record<string, string>>({});

  const fetchReservations = (d: string) => {
    setLoading(true);
    setError("");
    apiFetch<ApiResponse<{ reservations: Reservation[] }>>(`/api/reservations?date=${d}`)
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        setReservations(r.data?.reservations ?? []);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations(date);
  }, [date]);

  const updateStatus = async (id: string, status: ReservationStatus) => {
    setUpdatingId(id);
    try {
      const r = await apiFetch<ApiResponse<{ reservation: Reservation }>>(`/api/reservations/${id}`, {
        method: "PATCH",
        data: { status },
      });
      if (!r.success) throw new Error(r.message);
      setReservations((prev) =>
        prev.map((rv) => (rv.id === id ? { ...rv, status } : rv)),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const assignTable = async (id: string) => {
    const tableNumber = tableInput[id]?.trim();
    if (!tableNumber) return;
    setUpdatingId(id);
    try {
      const r = await apiFetch<ApiResponse<{ reservation: Reservation }>>(`/api/reservations/${id}`, {
        method: "PATCH",
        data: { tableNumber },
      });
      if (!r.success) throw new Error(r.message);
      setReservations((prev) =>
        prev.map((rv) => (rv.id === id ? { ...rv, tableNumber } : rv)),
      );
      setTableInput((prev) => ({ ...prev, [id]: "" }));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl mb-1">Reservations</h1>
        <p className="text-white/40 text-sm">
          Manage table reservations by date
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Calendar size={16} className="text-white/40" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-yellow-400/50"
        />
        <button
          onClick={() => fetchReservations(date)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="text-yellow-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 text-red-400 text-sm py-8">
          <AlertCircle size={16} /> {error}
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-sm">
          No reservations for {date}.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  "Customer",
                  "Date & Time",
                  "Party",
                  "Status",
                  "Table",
                  "Actions",
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
              {reservations.map((rv) => {
                const name = rv.user?.name ?? rv.customerName ?? "Guest";
                const email = rv.user?.email ?? rv.customerEmail ?? "";
                return (
                  <tr
                    key={rv.id}
                    className="hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-white/80 text-xs font-medium">
                        {name}
                      </p>
                      <p className="text-white/30 text-[10px]">{email}</p>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">
                      {rv.date} {rv.time}
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">
                      {rv.partySize}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[rv.status]}`}
                      >
                        {rv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {rv.tableNumber ? (
                        <span className="text-white/60 text-xs">
                          #{rv.tableNumber}
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input
                            placeholder="#"
                            value={tableInput[rv.id] ?? ""}
                            onChange={(e) =>
                              setTableInput((p) => ({
                                ...p,
                                [rv.id]: e.target.value,
                              }))
                            }
                            className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none"
                          />
                          <button
                            onClick={() => assignTable(rv.id)}
                            disabled={updatingId === rv.id}
                            className="text-xs text-yellow-400 hover:text-yellow-300 transition disabled:opacity-50"
                          >
                            Assign
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {rv.status === "PENDING" && (
                          <button
                            onClick={() => updateStatus(rv.id, "CONFIRMED")}
                            disabled={updatingId === rv.id}
                            className="text-[10px] px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition disabled:opacity-50"
                          >
                            Confirm
                          </button>
                        )}
                        {(rv.status === "PENDING" ||
                          rv.status === "CONFIRMED") && (
                          <>
                            <button
                              onClick={() => updateStatus(rv.id, "COMPLETED")}
                              disabled={updatingId === rv.id}
                              className="text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition disabled:opacity-50"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateStatus(rv.id, "CANCELLED")}
                              disabled={updatingId === rv.id}
                              className="text-[10px] px-2 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {updatingId === rv.id && (
                          <Loader2
                            size={12}
                            className="text-yellow-400 animate-spin"
                          />
                        )}
                        {rv.status === "CONFIRMED" && (
                          <button
                            onClick={() => updateStatus(rv.id, "NO_SHOW")}
                            disabled={updatingId === rv.id}
                            className="text-[10px] px-2 py-1 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition disabled:opacity-50"
                          >
                            No Show
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
