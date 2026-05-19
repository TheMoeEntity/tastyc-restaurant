"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import LoginForm from "@/components/sections/Auth/LoginForm";
import { loginUser } from "@/lib/api/auth";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectPath, setRedirectPath] = useState<string | null>(
    "/dashboard/user",
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const unauthenticated = params.get("unauthenticated");
    const redirect = params.get("redirect");

    if (redirect) {
      setRedirectPath(redirect);
    }

    if (unauthenticated) {
      setError("Your session has expired. Please login");
      // toast.error("You're not authenticated to access this page. Please login");
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

      toast.success("Login successful");

      // Backend sets httpOnly cookies automatically
      // We only use the role from the response to redirect
      if (role === "CUSTOMER") {
        router.push(decodeURIComponent(redirectPath || "/dashboard/user"));
      } else if (role === "KITCHEN") {
        router.push(decodeURIComponent(redirectPath || "/dashboard/kitchen"));
      } else {
        // MANAGER, SUPERADMIN, STAFF
        router.push(decodeURIComponent(redirectPath || "/dashboard/admin"));
      }
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
