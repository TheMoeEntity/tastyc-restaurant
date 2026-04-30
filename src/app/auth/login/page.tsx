"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoginForm from "@/components/sections/Auth/LoginForm";
import { loginUser } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await loginUser({ email, password });

      // ✅ success toast
      toast.success("Login successful");

      // redirect based on role
      if (res.user.role === "manager" || res.user.role === "superadmin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch {
      const message = "Invalid email or password. Please try again.";
      setError(message);

      // ❌ error toast
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}