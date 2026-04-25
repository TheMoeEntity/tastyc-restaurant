/* eslint-disable react-hooks/set-state-in-effect */
// src/app/blog/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Search,
  User,
  MessageCircle,
  ChevronRight,
  Mail,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
} from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import { blogPosts, blogCategories } from "@/lib/data/blogData";
import { BlogPost, BlogCategory } from "@/types/blog.types";
import {
  formatDate,
  getReadTimeDisplay,
  getRelativeTime,
  filterPosts,
  paginatePosts,
  getTotalPages,
  getFeaturedPosts,
} from "@/lib/utils/blogUtils";
import Image from "next/image";

const POSTS_PER_PAGE = 6;

export default function BlogLatestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);

  const featuredPosts = getFeaturedPosts(blogPosts, 2);

  useEffect(() => {
    const filtered = filterPosts(blogPosts, searchQuery, selectedCategory);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

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

  // Get category link based on category slug
  const getCategoryLink = (categorySlug: string): string => {
    switch (categorySlug) {
      case "recipes":
        return "/blog/recipes";
      case "chef-corner":
        return "/blog/chef-corner";
      case "events":
        return "/blog/events";
      default:
        return `/blog/category/${categorySlug}`;
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative py-20 md:py-24 px-6 md:px-16 lg:px-20 bg-white">
        <div className="pointer-events-none absolute inset-0 flex justify-center items-center opacity-40">
          <div className="w-80 h-80 bg-yellow-400/10 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <MotionWrapper variant="fade-up" duration={700}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                Latest Updates
              </p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-6">
              Latest <span className="text-yellow-500">Stories</span> & Updates
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Discover recipes, chef stories, and the latest news from Tastyc.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* FEATURED POSTS SECTION */}
      {featuredPosts.length > 0 && (
        <section className="py-12 px-6 md:px-16 lg:px-20 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, idx) => (
                <MotionWrapper
                  key={post.id}
                  variant="fade-up"
                  delay={idx * 150}
                >
                  <div className="group block">
                    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-3">
                          Featured
                        </span>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-200 text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-gray-300 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {getRelativeTime(post.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getReadTimeDisplay(post.readTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {post.likes} likes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEARCH & FILTER BAR */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 py-4 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {blogCategories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat.slug
                      ? "bg-yellow-500 text-black shadow-md scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="py-16 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {displayedPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No posts found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filter to find what you&#39;re
                looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-yellow-600 hover:text-yellow-700 font-semibold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedPosts.map((post, idx) => (
                  <MotionWrapper
                    key={post.id}
                    variant="fade-up"
                    delay={idx * 100}
                  >
                    <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden block">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {post.featured && (
                          <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          {/* Category Badge - Links to category page */}
                          <Link
                            href={getCategoryLink(post.categorySlug)}
                            className="text-xs font-semibold text-yellow-600 uppercase tracking-wider hover:text-yellow-700 transition"
                          >
                            {post.category}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{getRelativeTime(post.publishedAt)}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold font-serif text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2 mb-3">
                          {post.title}
                        </h3>

                        <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getReadTimeDisplay(post.readTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.comments} comments
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* No Read More button - just category links */}
                      </div>
                    </article>
                  </MotionWrapper>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-semibold transition ${
                        currentPage === i + 1
                          ? "bg-yellow-500 text-black"
                          : "border border-gray-200 hover:border-yellow-400 text-gray-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
            backgroundImage:
              "linear-gradient(rgba(8,31,34,0.88), rgba(8,31,34,0.92)), url(/assets/homeImg3.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <MotionWrapper variant="fade-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-2xl mb-4">
              <Mail className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-3">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-6">
              Get the latest recipes, chef tips, and exclusive offers delivered
              to your inbox.
            </p>

            {isNewsletterSubmitted ? (
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white">
                  Thanks for subscribing! Check your email for confirmation.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
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
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl transition whitespace-nowrap disabled:opacity-50"
                >
                  {isNewsletterLoading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
            <p className="text-gray-400 text-xs mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </MotionWrapper>
        </div>
      </section>
    </main>
  );
}
