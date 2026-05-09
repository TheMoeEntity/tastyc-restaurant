"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Receipt,
  ArrowLeft,
  ShoppingBag,
  Calendar,
  Hash,
  CreditCard,
} from "lucide-react";

interface VerifyResult {
  status: "success" | "failed";
  data?: {
    reference: string;
    amount: number;
    currency: string;
    paid_at: string;
    gateway_response: string;
    channel: string;
  };
  message?: string;
}

function ConfirmContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref") ?? "";
  const orderId = params.id as string;

  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [result, setResult] = useState<VerifyResult | null>(null);

  useEffect(() => {
    if (!reference) {
      setState("error");
      setResult({ status: "failed", message: "No payment reference found in URL." });
      return;
    }

    fetch(`/api/payments/verify/${reference}`)
      .then((r) => r.json())
      .then((data: VerifyResult) => {
        setResult(data);
        setState(data.status === "success" ? "success" : "error");
      })
      .catch(() => {
        setState("error");
        setResult({ status: "failed", message: "Could not verify payment. Please contact support." });
      });
  }, [reference]);

  const amountFormatted =
    result?.data
      ? `₦${(result.data.amount / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
      : null;

  const paidAt = result?.data
    ? new Date(result.data.paid_at).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ── Loading ── */}
        {state === "loading" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">
              Verifying Payment
            </h1>
            <p className="text-gray-500 text-sm">
              Confirming your transaction with Paystack&hellip;
            </p>
          </div>
        )}

        {/* ── Success ── */}
        {state === "success" && result?.data && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold font-serif text-gray-900 mb-1">
                Payment Successful!
              </h1>
              <p className="text-gray-500 text-sm">
                Your order has been paid and confirmed.
              </p>
            </div>

            {/* Transaction details */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Hash className="w-3.5 h-3.5" />
                  Reference
                </div>
                <span className="text-sm font-mono font-bold text-gray-800 break-all text-right max-w-[200px]">
                  {result.data.reference}
                </span>
              </div>

              {amountFormatted && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CreditCard className="w-3.5 h-3.5" />
                    Amount
                  </div>
                  <span className="text-sm font-black text-yellow-600">
                    {amountFormatted}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Paid at
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {paidAt}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-gray-200 pt-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Receipt className="w-3.5 h-3.5" />
                  Gateway
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  {result.data.gateway_response}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/order/track/${orderId}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-md"
              >
                <Receipt className="w-4 h-4" />
                Track My Order
              </Link>
              <Link
                href="/menu"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 hover:border-yellow-400 text-gray-600 hover:text-yellow-600 font-semibold rounded-xl transition"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {state === "error" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {result?.message ?? "Something went wrong while verifying your payment."}
            </p>
            <div className="space-y-3">
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
              >
                Try Again
              </Link>
              <Link
                href="/contact/support"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 hover:border-yellow-400 text-gray-600 hover:text-yellow-600 font-semibold rounded-xl transition"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            href="/order"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 transition text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
