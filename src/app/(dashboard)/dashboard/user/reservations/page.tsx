"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, RefreshCw, Calendar } from "lucide-react";
import { toast } from "sonner";
import apiFetch from "@/lib/api";
import Link from "next/link";
import { useConfirmModal } from "@/hooks/useConfirmModal";

//

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

interface Reservation {
  id: string;
  date: string;
  time: string;
  partySize: number;
  status: ReservationStatus;
  tableNumber?: string | null;
  notes?: string | null;
}

const STATUS_COLORS: Record<ReservationStatus, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  CONFIRMED: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  CANCELLED: "text-red-400 bg-red-500/10 border-red-500/30",
  COMPLETED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

export default function UserReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { confirm, modal } = useConfirmModal();
  const runFetch = () =>
    apiFetch<any>(`/api/reservations`)
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        setReservations(r.data?.reservations ?? r.data ?? []);
        setError("");
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));

  useEffect(() => {
    runFetch();
  }, []); // eslint-disable-line

  const cancel = async (id: string) => {
    const ok = await confirm({
      title: "Cancel reservation?",
      message: "Are you sure you want to cancel this reservation?",
      confirmLabel: "Cancel",
      cancelLabel: "No",
      danger: true,
    });
    if (!ok) return;
    setCancellingId(id);
    try {
      const r = await apiFetch<any>(`api/reservations/${id}`, {
        method: "PATCH",
        data: { status: "CANCELLED" },
      });
      if (!r.success) throw new Error(r.message);
      setReservations((prev) =>
        prev.map((rv) => (rv.id === id ? { ...rv, status: "CANCELLED" } : rv)),
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      {modal}
      <div className="space-y-6">
        <div>
          <h1 className="text-white font-bold text-xl mb-1">Reservations</h1>
          <p className="text-white/40 text-sm">
            Your upcoming and past table reservations
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="text-yellow-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle size={24} className="text-red-400" />
            <p className="text-white/40 text-sm">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                runFetch();
              }}
              className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Calendar size={32} className="text-white/10 mx-auto" />
            <p className="text-white/30 text-sm">No reservations yet.</p>
            <Link
              href="/reservation"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition"
            >
              <Calendar size={12} />
              Book a Table
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((rv) => (
              <div
                key={rv.id}
                className="rounded-2xl border border-white/5 p-4"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">
                        {new Date(rv.date).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        at {rv.time}
                      </span>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[rv.status]}`}
                      >
                        {rv.status}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs">
                      Party of {rv.partySize}
                    </p>
                    {rv.tableNumber && (
                      <p className="text-white/30 text-xs">
                        Table #{rv.tableNumber}
                      </p>
                    )}
                    {rv.notes && (
                      <p className="text-white/20 text-xs italic">{rv.notes}</p>
                    )}
                  </div>
                  {(rv.status === "PENDING" || rv.status === "CONFIRMED") && (
                    <button
                      onClick={() => cancel(rv.id)}
                      disabled={cancellingId === rv.id}
                      className="shrink-0 text-xs px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition disabled:opacity-50"
                    >
                      {cancellingId === rv.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        "Cancel"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
