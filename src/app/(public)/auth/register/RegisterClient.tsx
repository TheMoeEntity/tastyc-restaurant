"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RegisterForm from "@/components/sections/Auth/RegisterForm";
import { registerUser } from "@/lib/api/auth";

export default function RegisterClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { push } = useRouter();
  const handleSubmit = async (
    name: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    setError("");

    try {
      const res = await registerUser(name, email, password);

      if (!res.success || !res.data) {
        throw new Error(res.message || "Registration failed");
      }

      toast.success("Account created successfully! Login to continue");

      push("/auth/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterForm onSubmit={handleSubmit} loading={loading} error={error} />
  );
}
