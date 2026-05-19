import apiFetch from "@/lib/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  loyaltyPoints: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: AuthUser;
  };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiFetch("/api/auth/login", {
    method: "POST",
    data: { email, password },
  });
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  phone?: string,
): Promise<AuthResponse> {
  return apiFetch("/api/auth/register", {
    method: "POST",
    data: { name, email, password, phone },
  });
}

export async function logoutUser(): Promise<void> {
  await apiFetch("/api/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<AuthResponse> {
  return apiFetch("/api/auth/me");
}

export async function refreshToken(): Promise<AuthResponse> {
  return apiFetch("/api/auth/refresh", { method: "POST" });
}

export async function forgotPassword(email: string): Promise<AuthResponse> {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    data: { email },
  });
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<AuthResponse> {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    data: { token, newPassword },
  });
}
