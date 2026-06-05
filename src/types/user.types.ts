export type UserRole =
  | "CUSTOMER"
  | "STAFF"
  | "KITCHEN"
  | "MANAGER"
  | "SUPERADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  loyaltyPoints: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  loyaltyPoints: number;
  createdAt: string;
  _count: { orders: number; reservations: number };
}

export const USER_ROLES: UserRole[] = [
  "CUSTOMER",
  "STAFF",
  "KITCHEN",
  "MANAGER",
  "SUPERADMIN",
];

export const ROLE_COLORS: Record<UserRole, string> = {
  CUSTOMER: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  STAFF: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  KITCHEN: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  MANAGER: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  SUPERADMIN: "text-red-400 bg-red-500/10 border-red-500/30",
};
