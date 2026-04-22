"use client";

import React, { useState } from "react";
import {
  Calendar,
  User,
  Clock,
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  ChevronRight,
  Search,
  Tag,
  Mail,
  Check,
} from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";

// Sample blog posts data
const featuredPost = {
  id: 1,
  title: "The Secret Behind Our Signature Jollof Rice",
  excerpt:
    "After 12 years of perfecting the recipe, we're finally sharing what makes our Jollof Rice the most requested dish on the menu — from the blend of tomatoes to the smoking technique.",
  image: "/assets/homeImg1.jpg",
  date: "April 12, 2024",
  readTime: "6 min read",
  author: "Chef Emmanuel Obi",
  category: "Recipes",
  slug: "secret-behind-signature-jollof-rice",
};

const recentPosts = [
  {
    id: 2,
    title: "A Beginner's Guide to Nigerian Soups",
    excerpt:
      "From Egusi to Oha, we break down the essential Nigerian soups every home cook should master.",
    image: "/assets/homeImg2.jpg",
    date: "April 5, 2024",
    readTime: "8 min read",
    author: "Adaeze Nwosu",
    category: "Cooking Tips",
    slug: "beginners-guide-nigerian-soups",
  },
  {
    id: 3,
    title: "Why We Wake Up at 5 AM Every Morning",
    excerpt:
      "A behind-the-scenes look at what happens in the Tastyc kitchen before the first guest arrives.",
    image: "/assets/homeImg3.jpg",
    date: "March 28, 2024",
    readTime: "5 min read",
    author: "Kingsley Eze",
    category: "Behind the Scenes",
    slug: "why-we-wake-up-at-5am",
  },
  {
    id: 4,
    title: "The Perfect Suya: A Love Letter to Street Food",
    excerpt:
      "How we took the flavours of Lagos street suya and elevated them without losing the soul.",
    image: "/assets/homeImg1.jpg",
    date: "March 20, 2024",
    readTime: "7 min read",
    author: "Chef Emmanuel Obi",
    category: "Recipes",
    slug: "perfect-suya-love-letter",
  },
];

const morePosts = [
  {
    id: 5,
    title: "Hosting a Dinner Party? Try Our Small Chops Menu",
    excerpt: "Everything you need to know about putting together the ultimate Nigerian small chops spread.",
    image: "/assets/homeImg2.jpg",
    date: "March 12, 2024",
    readTime: "4 min read",
    author: "Adaeze Nwosu",
    category: "Entertaining",
    slug: "hosting-dinner-party-small-chops",
  },
  {
    id: 6,
    title: "From 20 Seats to 200: Our Growth Story",
    excerpt: "The lessons, failures, and wins from twelve years of running a restaurant in this city.",
    image: "/assets/homeImg3.jpg",
    date: "March 5, 2024",
    readTime: "10 min read",
    author: "Kingsley Eze",
    category: "Story",
    slug: "20-seats-to-200-growth-story",
  },
  {
    id: 7,
    title: "The Best Plantain: Ripe, Unripe, or Somewhere In Between?",
    excerpt: "A respectful debate settled once and for all — plus our favourite ways to prepare plantains.",
    image: "/assets/homeImg1.jpg",
    date: "February 28, 2024",
    readTime: "5 min read",
    author: "Chef Emmanuel Obi",
    category: "Food Science",
    slug: "best-plantain-ripe-or-unripe",
  },
];

const categories = [
  { name: "Recipes", count: 12 },
  { name: "Behind the Scenes", count: 8 },
  { name: "Cooking Tips", count: 10 },
  { name: "Story", count: 6 },
  { name: "Entertaining", count: 5 },
  { name: "Food Science", count: 4 },
];

function SectionHeader({ label, title, subtitle, light = false }: {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <MotionWrapper variant="fade-up" duration={600}>
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-0.5 w-6 bg-yellow-500" />
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">{label}</p>
          <div className="h-0.5 w-6 bg-yellow-500" />
        </div>
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-4 ${light ? "text-white" : "text-gray-900"}`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`text-base md:text-lg leading-relaxed ${light ? "text-gray-300" : "text-gray-600"}`}>
            {subtitle}
          </p>
        )}
      </div>
    </MotionWrapper>
  );
}

function BlogCard({ post, featured = false, delay = 0 }: { post: typeof featuredPost; featured?: boolean; delay?: number }) {
  return (
    <MotionWrapper variant="fade-up" delay={delay} duration={500}>
      <article className={`group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 ${
        featured ? "lg:flex lg:gap-0" : ""
      }`}>
        <div className={`overflow-hidden ${featured ? "lg:w-1/2" : ""}`}>
          <img
            src={post.image}
            alt={post.title}
            className={`w-full h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-700 ${
              featured ? "lg:h-full lg:min-h-[400px]" : ""
            }`}
          />
        </div>
        <div className={`p-6 md:p-8 ${featured ? "lg:w-1/2 lg:flex lg:flex-col lg:justify-center" : ""}`}>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Calendar className="w-3 h-3" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Clock className="w-3 h-3" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h3 className={`font-bold font-serif text-gray-900 mb-3 leading-tight ${featured ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl md:text-2xl"}`}>
            <Link href={`/blog/${post.slug}`} className="hover:text-yellow-500 transition-colors">
              {post.title}
            </Link>
          </h3>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-sm md:text-base text-gray-700">{post.author}</span>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-yellow-600 hover:text-yellow-500 transition"
            >
              Read More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </MotionWrapper>
  );
}

export default function BlogPage() {
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [shareText, setShareText] = useState("");

  const handleLoadMore = () => {
    setVisiblePosts((prev) => Math.min(prev + 3, morePosts.length));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      alert(`Thank you for your message! We'll get back to you soon.\n\nMessage: ${messageText}`);
      setMessageText("");
      setShowMessageModal(false);
    }
  };

  const handleShareStory = () => {
    if (shareText.trim()) {
      alert(`Thank you for sharing your story! We'll review it and may feature it on our blog.\n\nStory: ${shareText}`);
      setShareText("");
      setShowShareModal(false);
    }
  };

  const visibleMorePosts = morePosts.slice(0, visiblePosts);
  const hasMorePosts = visiblePosts < morePosts.length;

  return (
    <main className="bg-white overflow-hidden">

      {/* HERO SECTION - Reduced radiance */}
      <section className="relative py-16 md:py-20 lg:py-24 px-6 md:px-16 lg:px-20 bg-white">
        <div className="pointer-events-none absolute inset-0 flex justify-center items-center opacity-40">
          <div className="w-[400px] h-[400px] bg-yellow-400/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <MotionWrapper variant="fade-up" duration={700}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">Our Blog</p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-6">
              Stories from the <br />
              <span className="text-yellow-500">Tastyc Kitchen</span>
            </h1>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
              Recipes, behind-the-scenes stories, cooking tips, and everything in between — straight from our kitchen to yours.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition text-base"
                />
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* FEATURED POST */}
      <section className="py-8 md:py-12 px-6 md:px-16 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">Featured Article</p>
            </div>
            <Link href="/blog/all" className="text-sm md:text-base font-semibold text-gray-500 hover:text-yellow-500 transition flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <BlogCard post={featuredPost} featured />
        </div>
      </section>

      {/* RECENT POSTS + SIDEBAR */}
      <section className="py-12 md:py-16 px-6 md:px-16 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Fresh from the Kitchen"
            title="Recent Stories"
            subtitle="The latest from our team — recipes, reflections, and kitchen wisdom."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} delay={index * 100} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 md:space-y-8">
              {/* About Card */}
              <MotionWrapper variant="fade-up" delay={0} duration={500}>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-bold text-gray-900 text-lg md:text-xl">About This Blog</h4>
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed mb-4">
                    Welcome to the Tastyc blog — a space where our chefs, bakers, and team share the stories behind your favourite dishes.
                  </p>
                  <p className="text-gray-600 text-base leading-relaxed">
                    New posts every Tuesday and Friday. Subscribe to never miss a recipe.
                  </p>
                </div>
              </MotionWrapper>

              {/* Categories */}
              <MotionWrapper variant="fade-up" delay={100} duration={500}>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Tag className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-bold text-gray-900 text-lg md:text-xl">Categories</h4>
                  </div>
                  <div className="space-y-2">
                    {categories.map((cat, i) => (
                      <Link
                        key={i}
                        href={`/blog/category/${cat.name.toLowerCase()}`}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 group hover:pl-2 transition-all"
                      >
                        <span className="text-gray-700 text-base group-hover:text-yellow-500 transition">{cat.name}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </MotionWrapper>

              {/* Newsletter - Redesigned with background image */}
              <MotionWrapper variant="fade-up" delay={200} duration={500}>
                <div 
                  className="relative rounded-3xl overflow-hidden"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: "url('/assets/homeImg2.jpg')",
                    }}
                  />
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 to-gray-800/90" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 md:p-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-500/20 rounded-2xl mb-4 mx-auto">
                      <Mail className="w-7 h-7 text-yellow-400" />
                    </div>
                    <h4 className="font-bold text-white text-2xl md:text-3xl font-serif mb-2">
                      Fresh Posts, <br className="sm:hidden" />Straight to You
                    </h4>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 max-w-xs mx-auto">
                      Get recipes, stories, and kitchen wisdom delivered to your inbox — no spam, just the good stuff.
                    </p>
                    
                    <form onSubmit={handleSubscribe} className="flex flex-col gap-3 max-w-sm mx-auto">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition text-base"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl transition text-base md:text-lg"
                      >
                        {isSubscribed ? (
                          <span className="flex items-center justify-center gap-2">
                            <Check className="w-5 h-5" /> Subscribed!
                          </span>
                        ) : (
                          "Subscribe Now →"
                        )}
                      </button>
                    </form>
                    
                    <p className="text-gray-400 text-xs mt-4">
                      Join 5,000+ subscribers. Unsubscribe anytime.
                    </p>
                  </div>
                </div>
              </MotionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* MORE POSTS */}
      <section className="py-16 md:py-24 px-6 md:px-16 lg:px-20 bg-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex justify-center items-center opacity-30">
          <div className="w-[500px] h-[500px] bg-yellow-400/10 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            label="Keep Reading"
            title="More From Our Kitchen"
            subtitle="Stories we think you'll love — hand-picked from our archive."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visibleMorePosts.map((post, index) => (
              <MotionWrapper key={post.id} variant="fade-up" delay={index * 100} duration={500}>
                <article className="group rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                  <div className="overflow-hidden h-56 md:h-64">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <h3 className="font-bold font-serif text-gray-900 text-xl md:text-2xl mb-2 leading-tight">
                      <Link href={`/blog/${post.slug}`} className="hover:text-yellow-500 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed mb-4 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm md:text-base font-semibold text-yellow-600 hover:text-yellow-500 transition flex items-center gap-1"
                      >
                        Read <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              </MotionWrapper>
            ))}
          </div>

          {/* Load More Button - Fixed */}
          {hasMorePosts && (
            <MotionWrapper variant="fade-up" delay={300} duration={500}>
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-8 py-3 md:px-10 md:py-4 border-2 border-gray-200 rounded-full text-gray-700 font-semibold text-base md:text-lg hover:border-yellow-500 hover:text-yellow-500 hover:bg-yellow-50 transition-all duration-300"
                >
                  Load More Articles <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </MotionWrapper>
          )}
        </div>
      </section>

      {/* CALL TO ACTION - Fixed buttons */}
      <section className="relative py-16 md:py-24 px-6 md:px-16 lg:px-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(8,31,34,0.88), rgba(8,31,34,0.92)), url(/assets/homeImg3.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <MotionWrapper variant="fade-up" duration={600}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">Join the Conversation</p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white leading-tight mb-4">
              Have a Story to Share?
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              We'd love to hear from you. Tag us in your Tastyc moments or reach out with your own kitchen stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowMessageModal(true)}
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition text-base md:text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Send a Message
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 border-2 border-white/30 hover:bg-white/10 text-white font-semibold rounded-lg transition text-base md:text-lg"
              >
                <Share2 className="w-5 h-5" />
                Share Your Story
              </button>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMessageModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold font-serif text-gray-900 mb-4">Send Us a Message</h3>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Tell us what's on your mind..."
              className="w-full p-4 border border-gray-200 rounded-xl text-base min-h-[150px] focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 px-4 py-3 bg-yellow-500 rounded-lg text-black font-bold hover:bg-yellow-400 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Story Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold font-serif text-gray-900 mb-4">Share Your Story</h3>
            <textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              placeholder="Tell us your Tastyc experience, favourite memory, or kitchen story..."
              className="w-full p-4 border border-gray-200 rounded-xl text-base min-h-[150px] focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleShareStory}
                className="flex-1 px-4 py-3 bg-yellow-500 rounded-lg text-black font-bold hover:bg-yellow-400 transition"
              >
                Submit Story
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}