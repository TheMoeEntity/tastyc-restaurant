"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { blogPosts } from "@/lib/data/blogData";
import { BlogPost } from "@/types/blog.types";
import { filterPosts, paginatePosts, getTotalPages } from "@/lib/utils/blogUtils";
import { BlogPostCard } from "./BlogPostCard";
import { BlogPagination } from "./BlogPagination";

const POSTS_PER_PAGE = 6;

export function BlogPostsGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const filtered = filterPosts(blogPosts, searchQuery, selectedCategory);
    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const paginated = paginatePosts(filteredPosts, currentPage, POSTS_PER_PAGE);
    setDisplayedPosts(paginated);
    setTotalPages(getTotalPages(filteredPosts.length, POSTS_PER_PAGE));
  }, [filteredPosts, currentPage]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  if (displayedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No posts found</h3>
        <p className="text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
        <button
          onClick={handleClearFilters}
          className="mt-4 text-yellow-600 hover:text-yellow-700 font-semibold"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      {totalPages > 1 && (
        <BlogPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
}