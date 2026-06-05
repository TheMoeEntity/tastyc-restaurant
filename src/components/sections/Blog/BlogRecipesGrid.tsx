"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, MessageCircle, Star, ChevronRight, Search } from "lucide-react";
import MotionWrapper from "@/components/ui/MotionWrapper";
import { BlogPost } from "@/types/blog.types";
import { getReadTimeDisplay, getRelativeTime, paginatePosts, getTotalPages } from "@/lib/utils/blogUtils";
import { BlogPagination } from "./BlogPagination";

const POSTS_PER_PAGE = 6;

interface BlogRecipesGridProps {
  initialPosts: BlogPost[];
  searchQuery: string;
}

export function BlogRecipesGrid({ initialPosts, searchQuery }: BlogRecipesGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let filtered = initialPosts;
    if (searchQuery) {
      filtered = initialPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [searchQuery, initialPosts]);

  useEffect(() => {
    const paginated = paginatePosts(filteredPosts, currentPage, POSTS_PER_PAGE);
    setDisplayedPosts(paginated);
    setTotalPages(getTotalPages(filteredPosts.length, POSTS_PER_PAGE));
  }, [filteredPosts, currentPage]);

  if (displayedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No recipes found</h3>
        <p className="text-gray-400">Try a different search term.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedPosts.map((post, idx) => (
          <MotionWrapper key={post.id} variant="fade-up" delay={idx * 100}>
            <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col">
              <Link href={`/blog/post/${post.slug}`} className="relative h-56 overflow-hidden block">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getReadTimeDisplay(post.readTime)}
                </div>
              </Link>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{getRelativeTime(post.publishedAt)}</span>
                  </div>
                </div>
                <Link href={`/blog/${post.slug}`} className="block mb-3">
                  <h3 className="text-xl font-bold font-serif text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author.name}
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
                  View Recipe
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          </MotionWrapper>
        ))}
      </div>
      {totalPages > 1 && (
        <BlogPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
}