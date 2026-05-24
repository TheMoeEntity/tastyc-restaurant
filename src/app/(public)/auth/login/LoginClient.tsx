"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import LoginForm from "@/components/sections/Auth/LoginForm";
import { loginUser } from "@/lib/api/auth";
import { getRoleDefaultPath } from "@/lib/Helper";
import { useAuth } from "@/context/AuthContext";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const { refresh } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const reason = params.get("reason");
    const redirect = params.get("redirect");

    if (redirect) {
      setRedirectPath(redirect);
    }

    if (reason === "expired") {
      setError("Your session has expired. Please log in again.");
    } else if (reason === "required") {
      setError("Please log in to continue.");
    }
  }, [searchParams]);

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(email, password);

      if (!res.success || !res.data) {
        throw new Error(res.message || "Login failed");
      }

      const { role } = res.data.user;
      const defaultPath = getRoleDefaultPath(role);

      toast.success("Login successful");

      const safePath = (() => {
        if (!redirectPath) return defaultPath;
        if (
          role === "KITCHEN" &&
          !redirectPath.startsWith("/dashboard/kitchen")
        )
          return defaultPath;
        if (role === "CUSTOMER" && redirectPath.startsWith("/dashboard/admin"))
          return defaultPath;
        return redirectPath;
      })();
      router.push(decodeURIComponent(safePath));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />;
}
