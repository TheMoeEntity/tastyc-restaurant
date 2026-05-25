"use client";

import { useState } from "react";
import { ShieldAlert, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerificationBanner() {
    const [dismissed, setDismissed] = useState(false);
    const router = useRouter();

    if (dismissed) return null;

    return (
        <div className="mx-4 mt-4 md:mx-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-yellow-400 shrink-0" />
                <div>
                    <p className="text-yellow-300 text-sm font-semibold">
                        Please verify your email address
                    </p>
                    <p className="text-yellow-300/60 text-xs mt-0.5">
                        Some features are limited until you verify. Check your inbox for
                        the code.
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={() => router.push("/auth/verify")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-lg transition"
                >
                    Verify now <ArrowRight className="w-3 h-3" />
                </button>
                <button
                    onClick={() => setDismissed(true)}
                    className="p-1.5 text-yellow-400/60 hover:text-yellow-400 transition"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}