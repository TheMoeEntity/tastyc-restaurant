import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
} from "@/types/auth";

// 🔐 LOGIN
export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  console.log("API CALL → /api/auth/login", payload);

  return new Promise<AuthResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        token: "fake-jwt",
        user: {
          name: "Test User",
          email: payload.email,
          role: payload.email.includes("admin") ? "manager" : "customer",
        },
      });
    }, 800);
  });
};

// 📝 REGISTER
export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  console.log("API CALL → /api/auth/register", payload);

  return new Promise<AuthResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        token: "fake-jwt",
        user: {
          name: payload.name,
          email: payload.email,
          role: "customer", // 🔥 always customer
        },
      });
    }, 800);
  });
};