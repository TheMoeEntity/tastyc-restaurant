import { LoginPayload, RegisterPayload, AuthResponse } from "@/types/auth";

// Fake users — swap these out when your real backend is ready
const fakeUsers = [
  { email: "admin@tastyc.com", password: "admin123", role: "superadmin", name: "Admin" },
  { email: "kitchen@tastyc.com", password: "kitchen123", role: "kitchen", name: "Chef" },
  { email: "user@tastyc.com", password: "user123", role: "customer", name: "Kingsley" },
];

export async function loginUser({ email, password }: LoginPayload): Promise<AuthResponse> {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 600));

  const match = fakeUsers.find((u) => u.email === email && u.password === password);

  if (!match) throw new Error("Invalid credentials");

  return {
    token: "mock-token-" + match.role,
    user: {
      role: match.role,
      name: match.name,
      email: match.email,
    },
  };
}

export async function registerUser({ name, email, password }: RegisterPayload): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 600));

  // registration always creates a customer for now
  return {
    token: "mock-token-customer",
    user: {
      role: "customer",
      name,
      email,
    },
  };
}