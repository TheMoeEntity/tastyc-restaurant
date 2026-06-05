"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  UtensilsCrossed,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import apiFetch from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";

type PageState = "loading" | "ready" | "submitting" | "success" | "error";

interface InviteData {
  email: string;
  role: string;
}

export default function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [state, setState] = useState<PageState>("loading");
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    apiFetch<ApiResponse<{ invite: InviteData }>>(`/api/invite/validate/${token}`)
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        setInvite(r.data.invite);
        setState("ready");
      })
      .catch((err) => {
        setErrorMsg(err instanceof Error ? err.message : "Invalid invite link");
        setState("error");
      });
  }, [token]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setState("submitting");

    try {
      const r = await apiFetch<ApiResponse>(
        `/api/invite/accept/${token}`,
        {
          method: "POST",
          data: { name: name.trim(), password },
        },
      );
      if (!r.success) throw new Error(r.message);
      setState("success");

      // Redirect to login after 3 seconds
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to create account",
      );
      setState("error");
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition ${
      fieldErrors[field]
        ? "border-red-500/50 focus:border-red-400"
        : "border-white/10 focus:border-yellow-400/50"
    }`;

  // ── Loading ──
  if (state === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="text-yellow-400 animate-spin mx-auto mb-4"
          />
          <p className="text-white/40 text-sm">Validating invite link...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (state === "error") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-2xl border border-white/5 p-8 text-center"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={28} className="text-red-400" />
          </div>
          <h1 className="text-white font-bold text-xl mb-2">Invalid Invite</h1>
          <p className="text-white/40 text-sm mb-6">{errorMsg}</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (state === "success") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-2xl border border-white/5 p-8 text-center"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-green-400" />
          </div>
          <h1 className="text-white font-bold text-xl mb-2">
            Account Created!
          </h1>
          <p className="text-white/40 text-sm mb-2">
            Welcome to Tastyc. Redirecting you to login...
          </p>
          <Loader2 size={16} className="text-yellow-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // ── Ready — show form ──
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
            <UtensilsCrossed size={24} className="text-yellow-400" />
          </div>
          <h1 className="text-white font-bold text-2xl mb-1">Join Tastyc</h1>
          <p className="text-white/40 text-sm">
            {`You've`} been invited as{" "}
            <span className="text-yellow-400 font-semibold">
              {invite?.role}
            </span>
          </p>
          <p className="text-white/30 text-xs mt-1">{invite?.email}</p>
        </div>

        {/* Form */}
        <div
          className="rounded-2xl border border-white/5 p-6 space-y-4"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <Shield size={14} className="text-yellow-400 shrink-0" />
            <p className="text-yellow-400/80 text-xs">
              Set up your account to access the dashboard
            </p>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider">
              Full Name
            </label>
            <input
              className={inputClass("name")}
              placeholder="Your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((p) => ({ ...p, name: "" }));
              }}
            />
            {fieldErrors.name && (
              <p className="text-red-400 text-xs">{fieldErrors.name}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={inputClass("password")}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((p) => ({ ...p, password: "" }));
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-red-400 text-xs">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className={inputClass("confirmPassword")}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFieldErrors((p) => ({ ...p, confirmPassword: "" }));
              }}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-400 text-xs">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={state === "submitting"}
            className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
          >
            {state === "submitting" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-white/20 text-xs text-center">
            This invite link expires 48 hours after it was sent
          </p>
        </div>
      </div>
    </div>
  );
}
