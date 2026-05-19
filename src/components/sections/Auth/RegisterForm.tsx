"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

type Props = {
  onSubmit: (name: string, email: string, password: string) => void;
  loading: boolean;
  error: string;
};

export default function RegisterForm({ onSubmit, loading, error }: Props) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score, label: "", color: "bg-gray-200" };
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    let label = "";
    let color = "";
    switch (score) {
      case 1:
      case 2:
        label = "Weak";
        color = "bg-red-500";
        break;
      case 3:
        label = "Fair";
        color = "bg-yellow-500";
        break;
      case 4:
        label = "Good";
        color = "bg-green-400";
        break;
      case 5:
        label = "Strong";
        color = "bg-green-600";
        break;
      default:
        label = "Very Weak";
        color = "bg-red-500";
    }
    return { score, label, color };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("sent over", name, email, password);
    onSubmit(name, email, password);
  };

  return (
    <main className="min-h-screen flex">
      {/* Form */}
      <div className="w-full flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* heading */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                Get Started
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 leading-tight">
              Create your <br />
              <span className="text-yellow-500">Tastyc account</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-yellow-600 font-semibold hover:text-yellow-700 transition"
              >
                Sign in
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
            {/* name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition text-sm"
                />
              </div>
            </div>

            {/* email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  minLength={8}
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
              
              <div className="mt-2 space-y-1.5">
                <div className="flex gap-1 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-full flex-1 transition-colors duration-300 ${
                        password && strength.score >= level ? strength.color : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                {password ? (
                  <p className="text-xs text-gray-500 flex justify-between">
                    <span>Password strength: <span className="font-medium text-gray-700">{strength.label}</span></span>
                    <span className={strength.score >= 4 ? "text-green-600" : "text-gray-400"}>
                      {strength.score >= 4 ? "✓ Looks good" : "Use 8+ chars, mix case & symbols"}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">Minimum 8 characters</p>
                )}
              </div>
            </div>

            {/* terms */}
            <p className="text-xs text-gray-400 leading-relaxed">
              By registering, you agree to our{" "}
              <Link
                href="/terms"
                className="text-yellow-600 hover:underline font-medium"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-yellow-600 hover:underline font-medium"
              >
                Privacy Policy
              </Link>
              .
            </p>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

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
