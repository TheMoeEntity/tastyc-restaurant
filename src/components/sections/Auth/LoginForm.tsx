"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, Eye, EyeOff, Mail, Lock, Zap, ChefHat, ShoppingBag, Shield } from "lucide-react";

export type DemoAccount = {
  label: string;
  email: string;
  password: string;
};

type Props = {
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  error: string;
  demoAccounts?: DemoAccount[];
  onDemoLogin?: (email: string, password: string) => void;
};

const ROLE_META: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  Customer: {
    icon: <ShoppingBag className="w-3.5 h-3.5" />,
    color: "text-emerald-700",
    bg: "bg-emerald-50 hover:bg-emerald-100",
    border: "border-emerald-200 hover:border-emerald-300",
  },
  Kitchen: {
    icon: <ChefHat className="w-3.5 h-3.5" />,
    color: "text-orange-700",
    bg: "bg-orange-50 hover:bg-orange-100",
    border: "border-orange-200 hover:border-orange-300",
  },
  Admin: {
    icon: <Shield className="w-3.5 h-3.5" />,
    color: "text-violet-700",
    bg: "bg-violet-50 hover:bg-violet-100",
    border: "border-violet-200 hover:border-violet-300",
  },
};

export default function LoginForm({ onSubmit, loading, error, demoAccounts, onDemoLogin }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <main className="min-h-[500px] bg-white md:min-h-screen flex">
      {/* Form */}
      <div className="w-full flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* heading */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                Welcome Back
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 leading-tight">
              Sign in to <br />
              <span className="text-yellow-500">your account</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-yellow-600 font-semibold hover:text-yellow-700 transition"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* error */}
          {error && (
            <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition text-sm"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-yellow-600 hover:text-yellow-700 font-medium transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="w-full pl-10 pr-11 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Section */}
          {demoAccounts && demoAccounts.length > 0 && onDemoLogin && (
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-100" />
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Try Demo</span>
                </div>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-3 text-center">
                  Explore the app instantly — no sign-up needed
                </p>
                <div className="flex flex-col gap-2">
                  {demoAccounts.map((account) => {
                    const meta = ROLE_META[account.label];
                    return (
                      <button
                        key={account.label}
                        type="button"
                        onClick={() => onDemoLogin(account.email, account.password)}
                        disabled={loading}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                          meta
                            ? `${meta.bg} ${meta.border} ${meta.color}`
                            : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                        }`}
                      >
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white shadow-sm border border-current/10">
                          {meta?.icon}
                        </span>
                        <span className="flex-1 text-left">
                          {account.label} View
                        </span>
                        <span className="text-[10px] opacity-60 font-normal">Click to enter →</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-center text-gray-400 mt-3">
                  ⚠️ Demo accounts have limited write access
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-sm text-gray-400">
            <Link
              href="/"
              className="hover:text-yellow-600 transition font-medium"
            >
              ← Back to Tastyc
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}