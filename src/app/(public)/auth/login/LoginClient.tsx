"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import LoginForm from "@/components/sections/Auth/LoginForm";
import { loginUser } from "@/lib/api/auth";
import { getRoleDefaultPath } from "@/lib/Helper";
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const DEMO_ACCOUNTS = [
  {
    label: "Customer",
    email: "demo.customer@tastyc.com",
    password: "Demo@123456",
  },
  {
    label: "Kitchen",
    email: "demo.kitchen@tastyc.com",
    password: "Demo@123456",
  },
  { label: "Admin", email: "demo.admin@tastyc.com", password: "Demo@123456" },
];

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const reason = params.get("reason");
    const redirect = params.get("redirect");
    const reasonMessage =
      {
        checkout: "Please log in to complete your order",
        expired: "Your session expired. Please log in again",
        required: "Please log in to continue",
      }[reason ?? "required"] ?? "Please log in to continue";

    if (redirect) {
      setRedirectPath(redirect);
    }

    // if (reason === "expired") {
    //   setError("Your session has expired. Please log in again.");
    // } else if (reason === "required") {
    //   setError("Please log in to continue.");
    // }
    setError(reasonMessage);
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
      const isOnboarded = res.data.isOnboarded;
      const defaultPath = getRoleDefaultPath(role);

      toast.success("Login successful");

      const safePath = (() => {
        if (["MANAGER", "SUPERADMIN"].includes(role) && !isOnboarded) {
          return "/setup";
        }
        if (redirectPath) {
          if (
            role === "CUSTOMER" &&
            redirectPath.startsWith("/dashboard/admin")
          ) {
            return defaultPath;
          }
          if (
            role === "KITCHEN" &&
            (redirectPath.startsWith("/dashboard/admin") ||
              redirectPath.startsWith("/dashboard/user"))
          ) {
            return defaultPath;
          }
          return redirectPath;
        }
        return defaultPath;
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
  const handleDemoLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(email, password);
      if (!res.success || !res.data)
        throw new Error(res.message || "Login failed");

      const { user, isOnboarded } = res.data;
      toast.success(`Logged in as ${user.name}`);

      if (["MANAGER", "SUPERADMIN"].includes(user.role)) {
        router.push(isOnboarded ? "/dashboard/admin" : "/setup");
      } else if (user.role === "KITCHEN") {
        router.push("/dashboard/kitchen");
      } else {
        router.push("/dashboard/user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <LoginForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      demoAccounts={isDemoMode ? DEMO_ACCOUNTS : undefined}
      onDemoLogin={isDemoMode ? handleDemoLogin : undefined}
    />
  );
}
