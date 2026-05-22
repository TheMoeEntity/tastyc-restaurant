import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Tag,
  // Facebook,
  // Twitter,
  // Linkedin,
} from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import { blogPosts } from "@/lib/data/blogData";
import { formatDate, getReadTimeDisplay } from "@/lib/utils/blogUtils";
import { BlogPost } from "@/types/blog.types";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Find related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter((p) => p.categorySlug === post.categorySlug && p.id !== post.id)
    .slice(0, 3);

  // Fallback content if empty
  const articleContent =
    post.content ||
    `
    <p class="mb-6 text-lg text-gray-700 leading-relaxed">${post.excerpt}</p>
    <p class="mb-6 text-gray-600 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <h3 class="text-2xl font-bold font-serif text-gray-900 mb-4 mt-8">The Process</h3>
    <p class="mb-6 text-gray-600 leading-relaxed">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <blockquote class="border-l-4 border-yellow-500 pl-6 py-2 my-8 italic text-xl text-gray-800 bg-yellow-50 border-r border-gray-100 rounded-r-lg">
      "Cooking is like painting or writing a song. Just as there are only so many notes or colors, there are only so many flavors - it's how you combine them that sets you apart."
    </blockquote>
    <p class="mb-6 text-gray-600 leading-relaxed">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
  `;

  return (
    <main className="bg-white min-h-screen pb-20">
      {/* HERO BANNER */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end pb-16 pt-32">
        <div className="absolute inset-0">
          <Image
            src={post.featuredImage || "/assets/homeImg1.jpg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-black/30" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-16 lg:px-20 w-full">
          <MotionWrapper variant="fade-up">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition text-sm font-semibold mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {post.category}
              </span>
              <span className="text-gray-300 text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="text-gray-300 text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {getReadTimeDisplay(post.readTime)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 border-t border-white/20 pt-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500">
                <Image
                  src={post.author.avatar || "/assets/avatar1.jpg"}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-white font-semibold">{post.author.name}</p>
                <p className="text-gray-400 text-sm">{post.author.role}</p>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="px-6 md:px-16 lg:px-20 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* MAIN ARTICLE */}
          <article className="lg:w-2/3 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
            <MotionWrapper variant="fade-up" delay={200}>
              {/* Stats Bar */}
              <div className="flex flex-wrap items-center justify-between pb-8 border-b border-gray-100 mb-8 text-sm text-gray-500">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition">
                    <Heart className="w-5 h-5" /> {post.likes} Likes
                  </span>
                  <span className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition">
                    <MessageCircle className="w-5 h-5" /> {post.comments}{" "}
                    Comments
                  </span>
                </div>
                {/* <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <span className="font-semibold text-gray-900">Share:</span>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div> */}
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-a:text-yellow-600 prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: articleContent }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <h4 className="font-bold text-gray-900">Tags:</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-gray-50 hover:bg-yellow-50 text-gray-600 hover:text-yellow-700 text-sm rounded-lg transition cursor-pointer border border-gray-100 hover:border-yellow-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </MotionWrapper>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3 mt-12 lg:mt-0 space-y-8">
            <MotionWrapper variant="fade-left" delay={300}>
              {/* Author Info */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-md">
                  <Image
                    src={post.author.avatar || "/assets/avatar1.jpg"}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold font-serif text-gray-900 mb-1">
                  {post.author.name}
                </h3>
                <p className="text-yellow-600 font-medium text-sm mb-4">
                  {post.author.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {post.author.bio}
                </p>
                <Link
                  href="/blog"
                  className="inline-block w-full py-3 border-2 border-yellow-500 text-yellow-600 font-bold rounded-xl hover:bg-yellow-50 transition"
                >
                  View All Posts
                </Link>
              </div>
            </MotionWrapper>

            <MotionWrapper variant="fade-left" delay={400}>
              {/* Newsletter */}
              <div className="bg-gray-900 rounded-2xl p-8 text-center text-white">
                <h3 className="text-2xl font-bold font-serif mb-2">
                  Join our Newsletter
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Get the latest recipes and chef tips straight to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition"
                  />
                  <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </MotionWrapper>
          </aside>
        </div>
      </section>

      {/* RELATED POSTS */}
      {relatedPosts.length > 0 && (
        <section className="mt-20 px-6 md:px-16 lg:px-20 bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto">
            <MotionWrapper variant="fade-up">
              <h2 className="text-3xl font-bold font-serif text-gray-900 mb-8 text-center">
                More from {post.category}
              </h2>
            </MotionWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, idx) => (
                <MotionWrapper
                  key={relatedPost.id}
                  variant="fade-up"
                  delay={idx * 100}
                >
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">
                          {relatedPost.category}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(relatedPost.publishedAt)}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold font-serif text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2 mb-3">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 flex-1">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                </MotionWrapper>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
