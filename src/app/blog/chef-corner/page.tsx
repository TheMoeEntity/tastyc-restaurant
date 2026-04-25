/* eslint-disable react-hooks/set-state-in-effect */
// app/blog/chef-corner/page.tsx

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
  ChefHat,
  Quote,
  Briefcase,
} from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import { blogPosts } from "@/lib/data/blogData";
import { BlogPost, BlogAuthor } from "@/types/blog.types";
import {
  formatDate,
  getReadTimeDisplay,
  getRelativeTime,
  paginatePosts,
  getTotalPages,
} from "@/lib/utils/blogUtils";
import Image from "next/image";

const POSTS_PER_PAGE = 6;
const CHEF_CORNER_SLUG = "chef-corner";

const getChefAuthors = (posts: BlogPost[]): BlogAuthor[] => {
  const chefPosts = posts.filter(
    (post) => post.categorySlug === CHEF_CORNER_SLUG,
  );
  const uniqueAuthors = new Map();

  chefPosts.forEach((post) => {
    if (!uniqueAuthors.has(post.author.id)) {
      uniqueAuthors.set(post.author.id, post.author);
    }
  });

  return Array.from(uniqueAuthors.values());
};

export default function BlogChefCornerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedChef, setSelectedChef] = useState("all");
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);

  const allChefPosts: BlogPost[] = blogPosts.filter(
    (post) => post.categorySlug === CHEF_CORNER_SLUG,
  );

  const featuredStory: BlogPost | undefined = allChefPosts.find(
    (post) => post.featured,
  );
  const chefs: BlogAuthor[] = getChefAuthors(blogPosts);

  useEffect(() => {
    let filtered = allChefPosts;

    if (searchQuery) {
      filtered = allChefPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    if (selectedChef !== "all") {
      filtered = filtered.filter((post) => post.author.id === selectedChef);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedChef]);

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

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative py-20 md:py-24 px-6 md:px-16 lg:px-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <MotionWrapper variant="fade-up" duration={700}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                Meet Our Team
              </p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-4">
              Chef&apos;s <span className="text-yellow-500">Corner</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Get to know the talented chefs behind your favorite dishes.
              Stories, tips, and behind-the-scenes moments.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* FEATURED STORY */}
      {featuredStory && (
        <section className="py-8 px-6 md:px-16 lg:px-20 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500 text-sm font-semibold">
                ⭐ Featured Story
              </span>
            </div>
            <Link
              href={`/blog/post/${featuredStory.slug}`}
              className="group block"
            >
              <div className="relative h-64 rounded-xl overflow-hidden">
                <Image
                  src={featuredStory.featuredImage}
                  alt={featuredStory.title}
                  fill
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-yellow-400 text-sm font-semibold">
                      {featuredStory.author.name}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">
                    {featuredStory.title}
                  </h2>
                  <div className="flex items-center gap-3 text-gray-200 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {getRelativeTime(featuredStory.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getReadTimeDisplay(featuredStory.readTime)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* MEET OUR CHEFS */}
      {chefs.length > 0 && (
        <section className="py-8 px-6 md:px-16 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              👨‍🍳 Meet Our Chefs
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedChef("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedChef === "all"
                    ? "bg-yellow-500 text-black shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {chefs.map((chef) => (
                <button
                  key={chef.id}
                  onClick={() =>
                    setSelectedChef(selectedChef === chef.id ? "all" : chef.id)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedChef === chef.id
                      ? "bg-yellow-500 text-black shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {chef.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEARCH BAR */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 py-4 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search chef stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition"
              />
            </div>
            <Link
              href="/blog"
              className="text-sm text-gray-500 hover:text-yellow-600 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all posts
            </Link>
          </div>
        </div>
      </section>

      {/* CHEF STORIES GRID */}
      <section className="py-16 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {displayedPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No stories found
              </h3>
              <p className="text-gray-400">Try a different search or filter.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedChef("all");
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
                      <Link
                        href={`/blog/post/${post.slug}`}
                        className="relative h-56 overflow-hidden block"
                      >
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                          <ChefHat className="w-3 h-3 text-yellow-500" />
                          <span className="text-white text-xs">
                            {post.author.name}
                          </span>
                        </div>
                      </Link>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <Quote className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">
                            {post.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{getRelativeTime(post.publishedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{getReadTimeDisplay(post.readTime)}</span>
                          </div>
                        </div>
                        <Link
                          href={`/blog/post/${post.slug}`}
                          className="block mb-3"
                        >
                          <h3 className="text-xl font-bold font-serif text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {post.author.role || "Chef"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.comments} comments
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {post.likes} likes
                          </span>
                        </div>
                        <Link
                          href={`/blog/post/${post.slug}`}
                          className="inline-flex items-center gap-2 text-yellow-600 font-semibold text-sm hover:text-yellow-700 transition group"
                        >
                          Read Story
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  </MotionWrapper>
                ))}
              </div>
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
              "linear-gradient(rgba(8,31,34,0.88), rgba(8,31,34,0.92)), url(/assets/homeImg2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <MotionWrapper variant="fade-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-2xl mb-4">
              <ChefHat className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-3">
              Get Chef Stories Delivered
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-6">
              Subscribe for behind-the-scenes stories and chef tips.
            </p>
            {isNewsletterSubmitted ? (
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white">Thanks for subscribing!</p>
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
