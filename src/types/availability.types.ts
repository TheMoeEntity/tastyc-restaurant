export interface BlockedSlot {
  id: string;
  date: string;
  time: string | null;
  reason: string | null;
  createdAt: string;
}

export interface AdminSlotData {
  time: string;
  available: boolean;
  blocked: boolean;
  seatsRemaining: number;
  bookedGuests: number;
}
