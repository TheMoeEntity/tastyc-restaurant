"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import apiFetch from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getRoleDefaultPath } from "@/lib/Helper";

export default function VerifyClient() {
    const router = useRouter();
    const { user, refresh } = useAuth();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Cooldown timer for resend button
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    // Auto-send OTP on mount
    useEffect(() => {
        handleResend();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // digits only
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // one digit per box
        setOtp(newOtp);

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits filled
        if (newOtp.every(d => d !== "") && value) {
            handleVerify(newOtp.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            handleVerify(pasted);
        }
    };

    const handleVerify = async (code?: string) => {
        const finalOtp = code ?? otp.join("");
        if (finalOtp.length !== 6) {
            setError("Please enter the full 6-digit code");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await apiFetch("/api/auth/verify-otp", {
                method: "POST",
                data: { otp: finalOtp },
            });

            toast.success("Email verified! Welcome to Tastyc 🎉");
            await refresh();
            router.push(getRoleDefaultPath(user?.role ?? "CUSTOMER"));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Invalid code";
            setError(message);
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setResending(true);
        setError("");

        try {
            await apiFetch("/api/auth/send-otp", { method: "POST" });
            toast.success("New code sent to your email");
            setCooldown(60); // 60 second cooldown
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to send code";
            setError(message);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-yellow-50 border-2 border-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h1 className="text-2xl font-bold font-serif text-gray-900">
                        Verify your email
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        We sent a 6-digit code to{" "}
                        <span className="font-semibold text-gray-700">
                            {user?.email ?? "your email"}
                        </span>
                    </p>
                </div>

                {/* OTP inputs */}
                <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => { inputRefs.current[index] = el }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(index, e.target.value)}
                            onKeyDown={e => handleKeyDown(index, e)}
                            className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition
                ${error ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-yellow-400"}
                ${digit ? "bg-yellow-50 border-yellow-400" : "bg-white"}`}
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">{error}</p>
                )}

                {/* Verify button */}
                <button
                    onClick={() => handleVerify()}
                    disabled={loading || otp.some(d => d === "")}
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                    ) : (
                        "Verify Email"
                    )}
                </button>

                {/* Resend */}
                <div className="text-center mt-4">
                    <button
                        onClick={handleResend}
                        disabled={resending || cooldown > 0}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition disabled:opacity-40 mx-auto"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                        {cooldown > 0
                            ? `Resend in ${cooldown}s`
                            : resending
                                ? "Sending..."
                                : "Resend code"}
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Wrong account?{" "}
                    <a href="/auth/login" className="text-yellow-600 font-semibold hover:underline">
                        Sign in with a different account
                    </a>
                </p>
            </div>
        </div>
    );
}