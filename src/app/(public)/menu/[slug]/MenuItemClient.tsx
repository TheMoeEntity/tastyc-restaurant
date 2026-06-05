/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Flame,
  Leaf,
  ShoppingCart,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import apiFetch from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";
import type { ApiResponse } from "@/types/api.types";
import type { MenuItem, MenuVariant as Variant } from "@/types/menu.types";
import type {
  MenuItemReview as Review,
  ReviewAggregates,
} from "@/types/review.types";
import { Stars, StarPicker, RatingBar } from "@/components/ui/Stars";

export default function MenuItemClient({ slug }: { slug: string }) {
  const { user, isAuthenticated } = useAuth();
  const { addMenuItem } = useCartStore();

  // Item state
  const [item, setItem] = useState<MenuItem | null>(null);
  const [itemLoading, setItemLoading] = useState(true);
  const [itemError, setItemError] = useState("");

  // Variant selection
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aggregates, setAggregates] = useState<ReviewAggregates | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);

  // Similar items
  const [similarItems, setSimilarItems] = useState<MenuItem[]>([]);

  // Review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reviewError, setReviewError] = useState("");

  // ── Fetch item ──────────────────────────────────────────────
  useEffect(() => {
    apiFetch<ApiResponse<{ item: MenuItem }>>(`/api/menu/slug/${slug}`)
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        setItem(r.data.item ?? (r.data as any));
      })
      .catch((err) =>
        setItemError(err instanceof Error ? err.message : "Item not found"),
      )
      .finally(() => setItemLoading(false));
  }, [slug]);

  // ── Fetch reviews ───────────────────────────────────────────
  const fetchReviews = (page = 1) => {
    if (!item) return;
    setReviewsLoading(true);
    apiFetch<
      ApiResponse<{
        reviews: Review[];
        aggregates: ReviewAggregates;
        pagination: { totalPages: number };
      }>
    >(`/api/reviews?menuItemId=${item.id}&page=${page}&limit=5`)
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        setReviews(r.data.reviews);
        setAggregates(r.data.aggregates);
        setReviewTotalPages(r.data.pagination.totalPages);
        setReviewPage(page);

        // Check if logged-in user already reviewed
        if (user) {
          const mine = r.data.reviews.find(
            (rv: Review) => rv.user.id === user.id,
          );
          if (mine) setUserReview(mine);
        }
      })
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  };

  // ── Fetch similar items ─────────────────────────────────────
  useEffect(() => {
    if (!item) return;
    fetchReviews(1);

    // Fetch similar items from same category
    apiFetch<ApiResponse<{ items: MenuItem[] }>>(
      `/api/menu?categoryId=${item.category.id}&limit=4`,
    )
      .then((r) => {
        if (!r.success) return;
        const all = r.data.items ?? [];
        setSimilarItems(
          all.filter((i: MenuItem) => i.slug !== slug).slice(0, 3),
        );
      })
      .catch(() => {});
  }, [item]);

  // ── Add to cart ─────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!item) return;
    addMenuItem(item as any, selectedVariant?.id, selectedVariant?.name);
    toast.success(
      `${item.name}${selectedVariant ? ` (${selectedVariant.name})` : ""} added to cart`,
    );
  };

  // ── Submit review ───────────────────────────────────────────
  const handleSubmitReview = async () => {
    if (!item || rating === 0) {
      setReviewError("Please select a rating");
      return;
    }
    if (comment && comment.length < 10) {
      setReviewError("Comment must be at least 10 characters");
      return;
    }

    setReviewError("");
    setSubmittingReview(true);

    try {
      const res = await apiFetch<ApiResponse>("/api/reviews", {
        method: "POST",
        data: {
          menuItemId: item.id,
          rating,
          comment: comment.trim() || undefined,
        },
      });

      if (!res.success) throw new Error(res.message);
      toast.success("Review submitted! It will appear after manager approval.");
      setRating(0);
      setComment("");
    } catch (err) {
      setReviewError(
        err instanceof Error ? err.message : "Failed to submit review",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // ── Computed price ──────────────────────────────────────────
  const displayPrice = item
    ? item.price + (selectedVariant?.priceDelta ?? 0)
    : 0;

  // ── Loading ─────────────────────────────────────────────────
  if (itemLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-gray-500">{itemError || "Item not found"}</p>
        <Link
          href="/menu"
          className="flex items-center gap-2 text-yellow-600 font-semibold"
        >
          <ArrowLeft size={16} /> Back to Menu
        </Link>
      </div>
    );
  }

  const isSpicy = item.tags.includes("spicy");
  const isVeg = item.tags.includes("vegan") || item.tags.includes("vegetarian");

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/menu" className="hover:text-gray-600 transition">
            Menu
          </Link>
          <span>/</span>
          <Link
            href={`/menu?category=${item.category.id}`}
            className="hover:text-gray-600 transition"
          >
            {item.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{item.name}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-12">
        {/* ── Hero section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-gray-200 shadow-xl">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  Currently Unavailable
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                  {item.category.name}
                </span>
                {isSpicy && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                    <Flame size={11} /> Spicy
                  </span>
                )}
                {isVeg && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Leaf size={11} /> Vegetarian
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900">
                {item.name}
              </h1>
              {item.description && (
                <p className="text-gray-500 mt-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            {/* Rating summary */}
            {aggregates && aggregates.totalReviews > 0 && (
              <div className="flex items-center gap-3">
                <Stars rating={aggregates.averageRating} />
                <span className="text-gray-700 font-semibold">
                  {aggregates.averageRating}
                </span>
                <span className="text-gray-400 text-sm">
                  ({aggregates.totalReviews}{" "}
                  {aggregates.totalReviews === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{item.preparationTime} mins</span>
              </div>
              {item.calories && <span>{item.calories} kcal</span>}
            </div>

            {/* Variants */}
            {item.variants.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Choose variant
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedVariant(null)}
                    className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${
                      !selectedVariant
                        ? "bg-yellow-500 border-yellow-500 text-black"
                        : "border-gray-200 text-gray-600 hover:border-yellow-400"
                    }`}
                  >
                    Regular — ₦{item.price.toLocaleString()}
                  </button>
                  {item.variants.map((v) => (
                    <button
                      key={v.id}
                      disabled={!v.isAvailable}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${
                        selectedVariant?.id === v.id
                          ? "bg-yellow-500 border-yellow-500 text-black"
                          : !v.isAvailable
                            ? "border-gray-100 text-gray-300 cursor-not-allowed"
                            : "border-gray-200 text-gray-600 hover:border-yellow-400"
                      }`}
                    >
                      {v.name}
                      {v.priceDelta > 0 &&
                        ` +₦${v.priceDelta.toLocaleString()}`}
                      {v.priceDelta < 0 &&
                        ` -₦${Math.abs(v.priceDelta).toLocaleString()}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price + CTA */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-3xl font-black text-gray-900">
                ₦{displayPrice.toLocaleString()}
              </span>
              <button
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* ── Reviews section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-4">
                Customer Reviews
              </h2>

              {aggregates && aggregates.totalReviews > 0 ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-5xl font-black text-gray-900">
                      {aggregates.averageRating}
                    </p>
                    <Stars rating={aggregates.averageRating} size={20} />
                    <p className="text-gray-400 text-sm mt-1">
                      {aggregates.totalReviews} reviews
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <RatingBar
                        key={star}
                        star={star}
                        count={aggregates.distribution[star] ?? 0}
                        total={aggregates.totalReviews}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No reviews yet.</p>
              )}

              {/* Leave review form */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                {!isAuthenticated ? (
                  <div className="text-center space-y-2">
                    <p className="text-gray-500 text-sm">
                      Ordered this item? Share your experience.
                    </p>
                    <Link
                      href={`/auth/login?reason=required&redirect=/menu/${slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition"
                    >
                      Log in to review
                    </Link>
                  </div>
                ) : userReview ? (
                  <div className="text-center">
                    <CheckCircle
                      size={20}
                      className="text-green-500 mx-auto mb-2"
                    />
                    <p className="text-gray-500 text-sm">
                      You reviewed this item
                    </p>
                    <Stars rating={userReview.rating} size={16} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Leave a Review
                    </p>
                    <StarPicker value={rating} onChange={setRating} />
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience (optional, min 10 chars)"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 resize-none transition"
                    />
                    {reviewError && (
                      <p className="text-red-500 text-xs">{reviewError}</p>
                    )}
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview || rating === 0}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
                    >
                      {submittingReview ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      Submit Review
                    </button>
                    <p className="text-gray-400 text-xs text-center">
                      Reviews appear after manager approval
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">What People Say</h2>

            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <Star size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">
                  No approved reviews yet. Be the first!
                </p>
              </div>
            ) : (
              <>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 font-bold text-yellow-700">
                        {review.user.name[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900 text-sm">
                            {review.user.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-NG",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <Stars rating={review.rating} size={14} />
                        {review.comment && (
                          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {reviewTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => fetchReviews(reviewPage - 1)}
                      disabled={reviewPage === 1}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-30 transition"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-gray-400 text-sm">
                      {reviewPage} / {reviewTotalPages}
                    </span>
                    <button
                      onClick={() => fetchReviews(reviewPage + 1)}
                      disabled={reviewPage === reviewTotalPages}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-30 transition"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Similar items ── */}
        {similarItems.length > 0 && (
          <div>
            <h2 className="font-bold font-serif text-gray-900 text-2xl mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similarItems.map((similar) => (
                <Link
                  key={similar.id}
                  href={`/menu/${similar.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition"
                >
                  <div className="relative h-44 bg-gray-100">
                    {similar.image && (
                      <Image
                        src={similar.image}
                        alt={similar.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-gray-900 group-hover:text-yellow-600 transition">
                      {similar.name}
                    </p>
                    <p className="text-yellow-600 font-semibold text-sm mt-1">
                      ₦{similar.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold transition"
        >
          <ArrowLeft size={16} />
          Back to Menu
        </Link>
      </div>
    </main>
  );
}
