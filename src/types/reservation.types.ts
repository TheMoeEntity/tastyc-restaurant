export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export interface Reservation {
  id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
  time: string;
  partySize: number;
  status: ReservationStatus;
  tableNumber?: string | null;
  notes?: string | null;
  user?: { id: string; name: string; email: string } | null;
}

export interface UserReservation {
  id: string;
  date: string;
  time: string;
  partySize: number;
  status: ReservationStatus;
  tableNumber?: string | null;
  notes?: string | null;
}

export const RESERVATION_STATUS_COLORS: Record<ReservationStatus, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  CONFIRMED: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  CANCELLED: "text-red-400 bg-red-500/10 border-red-500/30",
  COMPLETED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  NO_SHOW: "text-gray-400 bg-gray-500/10 border-gray-500/30",
};

export interface SlotData {
  date: string;
  slots: Array<{
    time: string;
    available: boolean;
    remainingCapacity: number;
  }>;
}
