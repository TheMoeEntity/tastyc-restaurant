import { Loader2 } from "lucide-react";
export interface SlotData {
  time: string;
  available: boolean;
  blocked: boolean;
  seatsRemaining: number;
  bookedGuests: number;
}
export // ── Visual slot picker ────────────────────────────────────────
function SlotPicker({
  slots,
  selected,
  onSelect,
  loading,
}: {
  slots: SlotData[];
  selected: string;
  onSelect: (time: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
        <span className="ml-2 text-gray-500 text-sm">
          Checking availability...
        </span>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-4 text-center">
        Select a date to see available times
      </p>
    );
  }

  const allUnavailable = slots.every((s) => !s.available);

  if (allUnavailable) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
        <p className="text-red-600 text-sm font-semibold">
          No availability on this date
        </p>
        <p className="text-red-400 text-xs mt-1">
          Please select a different date
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isSelected = selected === slot.time;
        const unavailable = !slot.available;

        return (
          <button
            key={slot.time}
            type="button"
            disabled={unavailable}
            onClick={() => onSelect(slot.time)}
            title={
              slot.blocked
                ? "This slot is unavailable"
                : unavailable
                  ? `Only ${slot.seatsRemaining} seats remaining`
                  : `${slot.seatsRemaining} seats available`
            }
            className={`
              relative py-2.5 px-2 rounded-xl border text-sm font-semibold transition-all
              ${
                isSelected
                  ? "bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-200"
                  : unavailable
                    ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                    : "bg-white border-gray-200 text-gray-700 hover:border-yellow-400 hover:bg-yellow-50"
              }
            `}
          >
            {slot.time}
            {!unavailable && !isSelected && slot.seatsRemaining <= 10 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-400 text-white text-[9px] font-bold px-1 rounded-full">
                {slot.seatsRemaining}
              </span>
            )}
            {slot.blocked && (
              <span className="block text-[9px] font-normal text-gray-400 mt-0.5">
                Unavailable
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
