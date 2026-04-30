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

      //  store for middleware (IMPORTANT)
      document.cookie = `token=${res.token}; path=/`;
      document.cookie = `role=${res.user.role}; path=/`;

      

      //  success toast
      toast.success("Login successful");

      //  correct routing (matches the folder structure)
      if (res.user.role === "customer") {
        router.push("/dashboard/user");
      } else if (res.user.role === "kitchen") {
        router.push("/dashboard/kitchen");
      } else {
        router.push("/dashboard/admin");
      }

    } catch {
      const message = "Invalid email or password. Please try again.";
      setError(message);

      // error toast
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