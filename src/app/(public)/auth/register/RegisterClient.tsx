"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RegisterForm from "@/components/sections/Auth/RegisterForm";
import { registerUser } from "@/lib/api/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await registerUser({ name, email, password });

      // ✅ store for middleware
      document.cookie = `token=${res.token}; path=/`;
      document.cookie = `role=${res.user.role}; path=/`;

      // optional (UI usage)
      localStorage.setItem("user", JSON.stringify(res.user));

      // ✅ success toast
      toast.success("Account created successfully");

      // ✅ correct redirect
      if (res.user.role === "customer") {
        router.push("/dashboard/user");
      } else if (res.user.role === "kitchen") {
        router.push("/dashboard/kitchen");
      } else {
        router.push("/dashboard/admin");
      }

    } catch {
      const message = "Something went wrong. Please try again.";
      setError(message);

      // ❌ error toast
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}