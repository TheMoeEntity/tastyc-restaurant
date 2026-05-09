"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, SendHorizonal, CheckCircle, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        {!sent ? (
          <>
            {/* Heading */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-0.5 w-6 bg-yellow-500" />
                <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                  Password Reset
                </p>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 leading-tight">
                Forgot your <br />
                <span className="text-yellow-500">password?</span>
              </h1>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                No worries — enter the email address linked to your account and
                we&apos;ll send you a reset link.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <SendHorizonal className="w-4 h-4" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Remember it?{" "}
              <Link
                href="/auth/login"
                className="text-yellow-600 font-semibold hover:text-yellow-700 transition"
              >
                Sign in
              </Link>
            </p>
          </>
        ) : (
          /* ── Success state ── */
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">
              Check your inbox
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-2">
              We&apos;ve sent a password reset link to
            </p>
            <p className="font-bold text-gray-800 mb-6">{email}</p>
            <p className="text-gray-400 text-xs mb-8">
              Didn&apos;t receive it? Check your spam folder, or{" "}
              <button
                onClick={() => setSent(false)}
                className="text-yellow-600 font-semibold hover:underline"
              >
                try again
              </button>
              .
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
