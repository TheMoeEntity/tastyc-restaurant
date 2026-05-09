import api from "@/lib/api";

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
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  phone?: string,
): Promise<AuthResponse> {
  const res = await api.post("/api/auth/register", {
    name,
    email,
    password,
    phone,
  });
  return res.data;
}

export async function logoutUser(): Promise<void> {
  await api.post("/api/auth/logout");
}

export async function getMe(): Promise<AuthResponse> {
  const res = await api.get("/api/auth/me");
  return res.data;
}

export async function forgotPassword(email: string): Promise<AuthResponse> {
  const res = await api.post("/api/auth/forgot-password", { email });
  return res.data;
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<AuthResponse> {
  const res = await api.post("/api/auth/reset-password", {
    token,
    newPassword,
  });
  return res.data;
}
