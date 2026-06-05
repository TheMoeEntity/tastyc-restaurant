"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MotionWrapper from "@/components/ui/MotionWrapper";
import { Calendar, Clock, Search, User, MessageCircle, ChevronRight, Star, ArrowLeft, ArrowRight, TrendingUp, Flame, Eye, Mail, CheckCircle } from "lucide-react";
import { BlogPost } from "@/types/blog.types";
import { getReadTimeDisplay, getRelativeTime, paginatePosts, getTotalPages, getDateFilter } from "@/lib/utils/blogUtils";
import { BlogPagination } from "./BlogPagination";

const POSTS_PER_PAGE = 9;

interface BlogPopularClientProps {
  initialPosts: BlogPost[];
}

export function BlogPopularClient({ initialPosts }: BlogPopularClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<"views" | "likes" | "comments">("views");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("all");
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);

  useEffect(() => {
    let filtered = [...initialPosts];

    const dateFilter = getDateFilter(timeRange);
    if (dateFilter) {
      filtered = filtered.filter((post) => new Date(post.publishedAt) >= dateFilter!);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (sortBy === "views") {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === "likes") {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "comments") {
      filtered.sort((a, b) => b.comments - a.comments);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [searchQuery, sortBy, timeRange, initialPosts]);

  useEffect(() => {
    const paginated = paginatePosts(filteredPosts, currentPage, POSTS_PER_PAGE);
    setDisplayedPosts(paginated);
    setTotalPages(getTotalPages(filteredPosts.length, POSTS_PER_PAGE));
  }, [filteredPosts, currentPage]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsNewsletterLoading(true);
    setTimeout(() => {
      setIsNewsletterLoading(false);
      setIsNewsletterSubmitted(true);
      setNewsletterEmail("");
      setTimeout(() => setIsNewsletterSubmitted(false), 3000);
    }, 1000);
  };

  const topThreePosts = filteredPosts.slice(0, 3);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("views");
    setTimeRange("all");
  };

  return (
    <>
      {/* TOP 3 FEATURED SECTION */}
      {topThreePosts.length > 0 && (
        <section className="py-12 px-6 md:px-16 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-5 h-5 text-yellow-500" />
              <h2 className="text-2xl font-bold font-serif text-gray-900">
                Top 3 This{" "}
                {timeRange === "week" ? "Week" : timeRange === "month" ? "Month" : "All Time"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topThreePosts.map((post, idx) => (
                <MotionWrapper key={post.id} variant="fade-up" delay={idx * 100}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="relative h-64 rounded-xl overflow-hidden">
                      <div className="absolute top-3 left-3 z-10">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                          #{idx + 1}
                        </div>
                      </div>
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-gray-200 text-xs">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {post.likes} likes
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.comments} comments
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </MotionWrapper>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FILTERS & SEARCH */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 py-4 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search popular posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "views" | "likes" | "comments")}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
              >
                <option value="views">Most Views</option>
                <option value="likes">Most Likes</option>
                <option value="comments">Most Comments</option>
              </select>

              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as "week" | "month" | "all")}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>

              <Link href="/blog" className="text-sm text-gray-500 hover:text-yellow-600 transition flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR POSTS GRID */}
      <section className="py-16 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {displayedPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No posts found</h3>
              <p className="text-gray-400">Try adjusting your filters.</p>
              <button onClick={handleResetFilters} className="mt-4 text-yellow-600 hover:text-yellow-700 font-semibold text-sm">
                Reset all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPosts.map((post, idx) => (
                  <MotionWrapper key={post.id} variant="fade-up" delay={(idx % 9) * 50}>
                    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                      <Link href={`/blog/post/${post.slug}`} className="relative h-48 overflow-hidden block">
                        <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3" /> Popular
                        </div>
                      </Link>

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <Link
                            href={
                              post.categorySlug === "recipes"
                                ? "/blog/recipes"
                                : post.categorySlug === "chef-corner"
                                ? "/blog/chef-corner"
                                : post.categorySlug === "events"
                                ? "/blog/events"
                                : `/blog/category/${post.categorySlug}`
                            }
                            className="text-xs font-semibold text-yellow-600 uppercase tracking-wider hover:text-yellow-700 transition"
                          >
                            {post.category}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{getRelativeTime(post.publishedAt)}</span>
                          </div>
                        </div>

                        <Link href={`/blog/post/${post.slug}`} className="block mb-2">
                          <h3 className="font-bold text-gray-800 group-hover:text-yellow-600 transition-colors line-clamp-2 text-base">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="text-gray-500 text-sm line-clamp-2 mb-3 flex-1">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {post.comments}
                            </span>
                          </div>
                          <Link href={`/blog/post/${post.slug}`} className="text-yellow-600 text-sm font-medium hover:text-yellow-700 transition">
                            Read →
                          </Link>
                        </div>
                      </div>
                    </article>
                  </MotionWrapper>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-yellow-400 disabled:opacity-50 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg font-medium text-sm transition ${
                        currentPage === i + 1
                          ? "bg-yellow-500 text-black"
                          : "border border-gray-200 hover:border-yellow-400 text-gray-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="text-gray-400 text-sm">...</span>}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-yellow-400 disabled:opacity-50 transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="relative py-16 px-6 md:px-16 lg:px-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(8,31,34,0.88), rgba(8,31,34,0.92)), url(/assets/homeImg2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <MotionWrapper variant="fade-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-2xl mb-4">
              <Mail className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-3">Never Miss a Popular Post</h2>
            <p className="text-gray-300 text-base md:text-lg mb-6">Subscribe to get the most popular articles delivered to your inbox.</p>
            {isNewsletterSubmitted ? (
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white">Thanks for subscribing!</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition"
                />
                <button
                  type="submit"
                  disabled={isNewsletterLoading}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition whitespace-nowrap disabled:opacity-50"
                >
                  {isNewsletterLoading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
            <p className="text-gray-400 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </MotionWrapper>
        </div>
      </section>
    </>
  );
}