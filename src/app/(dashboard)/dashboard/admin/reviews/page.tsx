"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Trash2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import apiFetch from "@/lib/api";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import type { ApiResponse } from "@/types/api.types";
import type { Review } from "@/types/review.types";
import { DarkStars as Stars } from "@/components/ui/Stars";

type Tab = "pending" | "approved";

// ── Main page ─────────────────────────────────────────────────

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { confirm, modal } = useConfirmModal();

  const fetchReviews = useCallback(() => {
    setLoading(true);
    setError("");

    const endpoint =
      tab === "pending"
        ? `/api/reviews/pending?page=${page}&limit=10`
        : `/api/reviews?page=${page}&limit=10`;

    apiFetch<ApiResponse<{ reviews: Review[]; pagination: { totalPages: number; total: number } }>>(endpoint)
      .then((r) => {
        if (!r.success) throw new Error(r.message);

        setReviews(r.data.reviews);
        setTotalPages(r.data.pagination.totalPages);
        setTotal(r.data.pagination.total);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, [tab, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [tab]);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await apiFetch<ApiResponse>(`/api/reviews/${id}/approve`, {
        method: "PATCH",
      });
      if (!res.success) throw new Error(res.message);
      toast.success("Review approved and published");
      fetchReviews();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete review?",
      message: "This review will be permanently deleted.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;

    setDeletingId(id);
    try {
      const res = await apiFetch<ApiResponse>(`/api/reviews/${id}`, {
        method: "DELETE",
      });
      if (!res.success) throw new Error(res.message);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {modal}

      <div>
        <h1 className="text-white font-bold text-xl mb-1">Reviews</h1>
        <p className="text-white/40 text-sm">
          Moderate customer reviews before they go live
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
        {(["pending", "approved"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition ${
              tab === t
                ? "bg-yellow-500 text-black"
                : "text-white/40 hover:text-white"
            }`}
          >
            {t === "pending" && (
              <span className="w-2 h-2 rounded-full bg-orange-400" />
            )}
            {t === "pending" ? "Pending Approval" : "Approved"}
            {tab === t && total > 0 && (
              <span className="bg-black/20 text-xs px-1.5 py-0.5 rounded-full">
                {total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="text-yellow-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <AlertCircle size={24} className="text-red-400" />
          <p className="text-white/40 text-sm">{error}</p>
          <button
            onClick={fetchReviews}
            className="flex items-center gap-1.5 text-xs text-yellow-400"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">
            {tab === "pending"
              ? "No reviews pending approval."
              : "No approved reviews yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-white/5 p-4"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-start gap-4">
                {/* Menu item image */}
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0">
                  {review.menuItem.image ? (
                    <Image
                      src={review.menuItem.image}
                      alt={review.menuItem.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                      No img
                    </div>
                  )}
                </div>

                {/* Review content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {review.menuItem?.name || "Unknown Item"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Stars rating={review.rating} />
                        <span className="text-white/30 text-xs">
                          by {review.user.name}
                        </span>
                        <span className="text-white/20 text-xs">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-NG",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {tab === "pending" && (
                        <button
                          onClick={() => handleApprove(review.id)}
                          disabled={approvingId === review.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                        >
                          {approvingId === review.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <CheckCircle size={12} />
                          )}
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                      >
                        {deletingId === review.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-white/50 text-sm mt-2 leading-relaxed">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-xs">{total} reviews total</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-white/40 text-xs">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
