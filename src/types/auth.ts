export type Role =
  | "customer"
  | "staff"
  | "kitchen"
  | "manager"
  | "superadmin";

export interface User {
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}