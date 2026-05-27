"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import LoginForm from "@/components/sections/Auth/LoginForm";
import { loginUser } from "@/lib/api/auth";
import { getRoleDefaultPath } from "@/lib/Helper";
import { useAuth } from "@/context/AuthContext";
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const DEMO_ACCOUNTS = [
  { label: "Customer", email: "demo.customer@tastyc.com", password: "Demo@123456" },
  { label: "Kitchen", email: "demo.kitchen@tastyc.com", password: "Demo@123456" },
  { label: "Admin", email: "demo.admin@tastyc.com", password: "Demo@123456" },
];

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

      const { role, } = res.data.user;
      const isOnboarded = res.data.isOnboarded
      const defaultPath = getRoleDefaultPath(role);

      toast.success("Login successful");

      const safePath = (() => {
        // Onboarding check runs first — before anything else
        if (["MANAGER", "SUPERADMIN"].includes(role)) {
          return isOnboarded ? "/dashboard/admin" : "/setup";
        }
        if (role === "KITCHEN") return "/dashboard/kitchen";
        if (role === "CUSTOMER") {
          // Honor redirect if it's a customer-safe path
          if (redirectPath && !redirectPath.startsWith("/dashboard/admin")) {
            return redirectPath;
          }
          return defaultPath;
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
      if (!res.success || !res.data) throw new Error(res.message || "Login failed");

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
  return <>
    <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />;
    {isDemoMode && (
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-white/30 text-xs font-medium">Try Demo</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.label}
              type="button"
              onClick={() => handleDemoLogin(account.email, account.password)}
              className="py-2.5 px-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-yellow-500/40 hover:bg-yellow-500/5 text-xs font-medium transition"
            >
              {account.label}
            </button>
          ))}
        </div>
        <p className="text-white/20 text-[10px] text-center">
          Demo accounts have limited actions
        </p>
      </div>
    )}
  </>
}
