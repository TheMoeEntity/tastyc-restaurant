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
      await registerUser({ name, email, password });

      // ✅ success toast
      toast.success("Account created successfully");

      router.push("/");
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