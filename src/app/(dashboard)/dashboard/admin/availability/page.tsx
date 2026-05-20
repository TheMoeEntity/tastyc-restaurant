"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  CalendarX,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import apiFetch from "@/lib/api";
import { useConfirmModal } from "@/hooks/useConfirmModal";

// ── Types ─────────────────────────────────────────────────────

interface BlockedSlot {
  id: string;
  date: string;
  time: string | null;
  reason: string | null;
  createdAt: string;
}

interface SlotData {
  time: string;
  available: boolean;
  blocked: boolean;
  seatsRemaining: number;
  bookedGuests: number;
}

// ── Helpers ───────────────────────────────────────────────────

function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Main page ─────────────────────────────────────────────────

export default function AdminAvailabilityPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Slots for selected date
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Blocked slots for current month
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [blockedLoading, setBlockedLoading] = useState(false);

  // Block form
  const [blockReason, setBlockReason] = useState("");
  const [blockTime, setBlockTime] = useState(""); // empty = entire day
  const [blocking, setBlocking] = useState(false);

  const { confirm, modal } = useConfirmModal();

  // Fetch blocked slots for current month
  const fetchBlockedSlots = useCallback(() => {
    setBlockedLoading(true);
    const month = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    apiFetch<any>(`/api/availability/blocked?month=${month}`)
      .then((r) => {
        if (r.success) setBlockedSlots(r.data.slots);
      })
      .catch(() => {})
      .finally(() => setBlockedLoading(false));
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchBlockedSlots();
  }, [fetchBlockedSlots]);

  // Fetch slots when date selected
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    apiFetch<any>(`/api/availability?date=${selectedDate}`)
      .then((r) => {
        if (r.success) setSlots(r.data.slots);
      })
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate]);

  const handleBlock = async () => {
    if (!selectedDate) return;

    const ok = await confirm({
      title: blockTime
        ? `Block ${blockTime} on ${selectedDate}?`
        : `Block entire day ${selectedDate}?`,
      message: blockTime
        ? "This slot will be unavailable for bookings."
        : "All slots on this day will be unavailable for bookings.",
      confirmLabel: "Block",
      danger: true,
    });

    if (!ok) return;

    setBlocking(true);
    try {
      const res = await apiFetch<any>("/api/availability/block", {
        method: "POST",
        data: {
          date: selectedDate,
          time: blockTime || undefined,
          reason: blockReason.trim() || undefined,
        },
      });
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      setBlockReason("");
      setBlockTime("");
      fetchBlockedSlots();
      // Refresh slots for this date
      setSlotsLoading(true);
      apiFetch<any>(`/api/availability?date=${selectedDate}`)
        .then((r) => {
          if (r.success) setSlots(r.data.slots);
        })
        .finally(() => setSlotsLoading(false));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to block slot");
    } finally {
      setBlocking(false);
    }
  };

  const handleUnblock = async (slot: BlockedSlot) => {
    const ok = await confirm({
      title: slot.time
        ? `Unblock ${slot.time} on ${slot.date}?`
        : `Unblock entire day ${slot.date}?`,
      message: "This will make the slot available for bookings again.",
      confirmLabel: "Unblock",
    });

    if (!ok) return;

    try {
      await apiFetch(`/api/availability/block/${slot.id}`, {
        method: "DELETE",
      });
      toast.success("Slot unblocked");
      fetchBlockedSlots();
      if (selectedDate === slot.date) {
        setSlotsLoading(true);
        apiFetch<any>(`/api/availability?date=${selectedDate}`)
          .then((r) => {
            if (r.success) setSlots(r.data.slots);
          })
          .finally(() => setSlotsLoading(false));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unblock");
    }
  };

  // Calendar helpers
  const days = getMonthDays(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  const blockedDates = new Set(
    blockedSlots.filter((s) => s.time === null).map((s) => s.date),
  );
  const partiallyBlockedDates = new Set(
    blockedSlots.filter((s) => s.time !== null).map((s) => s.date),
  );

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  const selectedDateBlocks = blockedSlots.filter(
    (s) => s.date === selectedDate,
  );
  const isDayBlocked = selectedDateBlocks.some((s) => s.time === null);

  return (
    <div className="space-y-6">
      {modal}
      <div>
        <h1 className="text-white font-bold text-xl mb-1">
          Availability Management
        </h1>
        <p className="text-white/40 text-sm">
          Block dates and time slots to manage restaurant capacity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Calendar ── */}
        <div
          className="rounded-2xl border border-white/5 p-5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition"
            >
              <ChevronLeft size={14} />
            </button>
            <p className="text-white font-semibold text-sm">{monthName}</p>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center text-white/20 text-xs py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map((day) => {
              const dateStr = formatDate(day);
              const isToday = dateStr === formatDate(today);
              const isSelected = dateStr === selectedDate;
              const isPast = day < new Date(today.toDateString());
              const isFullyBlocked = blockedDates.has(dateStr);
              const isPartiallyBlocked = partiallyBlockedDates.has(dateStr);

              return (
                <button
                  key={dateStr}
                  onClick={() => !isPast && setSelectedDate(dateStr)}
                  disabled={isPast}
                  className={`
                    relative aspect-square rounded-lg text-xs font-semibold transition flex items-center justify-center
                    ${isPast ? "text-white/10 cursor-not-allowed" : "cursor-pointer"}
                    ${isSelected ? "bg-yellow-500 text-black" : ""}
                    ${!isSelected && isFullyBlocked ? "bg-red-500/20 text-red-400 border border-red-500/30" : ""}
                    ${!isSelected && isPartiallyBlocked ? "bg-orange-500/10 text-orange-400" : ""}
                    ${!isSelected && !isFullyBlocked && !isPartiallyBlocked && !isPast ? "text-white/60 hover:bg-white/5 hover:text-white" : ""}
                    ${isToday && !isSelected ? "ring-1 ring-yellow-500/50" : ""}
                  `}
                >
                  {day.getDate()}
                  {isPartiallyBlocked && !isFullyBlocked && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" />
              <span className="text-white/30 text-xs">Fully blocked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-orange-500/10 relative">
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-400" />
              </div>
              <span className="text-white/30 text-xs">Partially blocked</span>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="space-y-4">
          {!selectedDate ? (
            <div
              className="rounded-2xl border border-white/5 p-8 text-center"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <CalendarX size={32} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">
                Select a date to manage availability
              </p>
            </div>
          ) : (
            <>
              {/* Selected date header */}
              <div
                className="rounded-2xl border border-white/5 p-4"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <p className="text-white font-semibold text-sm">
                  {formatDisplayDate(selectedDate)}
                </p>
                {isDayBlocked && (
                  <p className="text-red-400 text-xs mt-1">
                    ⚠ Entire day is blocked
                  </p>
                )}
              </div>

              {/* Block form */}
              {!isDayBlocked && (
                <div
                  className="rounded-2xl border border-white/5 p-4 space-y-3"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <p className="text-white font-semibold text-sm">
                    Block a Slot
                  </p>

                  <div>
                    <label className="block text-white/40 text-xs mb-1.5">
                      Time (leave empty to block entire day)
                    </label>
                    <select
                      value={blockTime}
                      onChange={(e) => setBlockTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/50 transition"
                    >
                      <option value="">Entire Day</option>
                      {slots.map((s) => (
                        <option
                          key={s.time}
                          value={s.time}
                          disabled={s.blocked}
                          className="bg-gray-900"
                        >
                          {s.time}{" "}
                          {s.blocked
                            ? "(already blocked)"
                            : `— ${s.seatsRemaining} seats`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/40 text-xs mb-1.5">
                      Reason (optional)
                    </label>
                    <input
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="e.g. Private event, Staff training..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50 transition"
                    />
                  </div>

                  <button
                    onClick={handleBlock}
                    disabled={blocking}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-semibold text-sm rounded-xl transition disabled:opacity-50"
                  >
                    {blocking ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    {blockTime ? `Block ${blockTime}` : "Block Entire Day"}
                  </button>
                </div>
              )}

              {/* Slot overview */}
              {slotsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={20} className="text-yellow-400 animate-spin" />
                </div>
              ) : (
                <div
                  className="rounded-2xl border border-white/5 p-4"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <p className="text-white font-semibold text-sm mb-3">
                    Time Slots
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((slot) => (
                      <div
                        key={slot.time}
                        className={`px-2 py-2 rounded-lg text-xs text-center border ${
                          slot.blocked
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : slot.seatsRemaining <= 10
                              ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                              : "bg-white/3 border-white/5 text-white/40"
                        }`}
                      >
                        <p className="font-semibold">{slot.time}</p>
                        <p className="text-[10px] mt-0.5">
                          {slot.blocked
                            ? "Blocked"
                            : `${slot.seatsRemaining} left`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blocks for this date */}
              {selectedDateBlocks.length > 0 && (
                <div
                  className="rounded-2xl border border-white/5 p-4"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <p className="text-white font-semibold text-sm mb-3">
                    Active Blocks
                  </p>
                  <div className="space-y-2">
                    {selectedDateBlocks.map((block) => (
                      <div
                        key={block.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10"
                      >
                        <div>
                          <p className="text-red-400 text-xs font-semibold">
                            {block.time ?? "Entire Day"}
                          </p>
                          {block.reason && (
                            <p className="text-white/30 text-[10px] mt-0.5">
                              {block.reason}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleUnblock(block)}
                          className="text-white/30 hover:text-red-400 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
