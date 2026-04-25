// src/lib/utils/blogUtils.ts

import { BlogAuthor, BlogPost } from "@/types/blog.types";
export const POSTS_PER_PAGE = 6;
export const CHEF_CORNER_SLUG = "chef-corner";

// Get date for time filtering
export const getDateFilter = (
  timeRange: "week" | "month" | "all",
): Date | null => {
  const now = new Date();
  if (timeRange === "week") {
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    return weekAgo;
  }
  if (timeRange === "month") {
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);
    return monthAgo;
  }
  return null;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
export const getChefAuthors = (posts: BlogPost[]): BlogAuthor[] => {
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
export const getReadTimeDisplay = (minutes: number): string => {
  return `${minutes} min read`;
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
};

export const getCategoryLink = (categorySlug: string): string => {
  switch (categorySlug) {
    case "recipes":
      return "/blog/recipes";
    case "chef-corner":
      return "/blog/chef-corner";
    case "events":
      return "/blog/events";
    case "food-culture":
      return "/blog/category/food-culture";
    default:
      return `/blog/category/${categorySlug}`;
  }
};

export const filterPosts = (
  posts: BlogPost[],
  searchQuery: string,
  selectedCategory: string,
): BlogPost[] => {
  return posts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || post.categorySlug === selectedCategory;

    return matchesSearch && matchesCategory;
  });
};

export const paginatePosts = (
  posts: BlogPost[],
  currentPage: number,
  postsPerPage: number,
): BlogPost[] => {
  const startIndex = (currentPage - 1) * postsPerPage;
  return posts.slice(startIndex, startIndex + postsPerPage);
};

export const getTotalPages = (
  totalPosts: number,
  postsPerPage: number,
): number => {
  return Math.ceil(totalPosts / postsPerPage);
};

export const getFeaturedPosts = (
  posts: BlogPost[],
  limit: number = 2,
): BlogPost[] => {
  return posts.filter((post) => post.featured).slice(0, limit);
};

export const getPostBySlug = (
  posts: BlogPost[],
  slug: string,
): BlogPost | undefined => {
  return posts.find((post) => post.slug === slug);
};

export const getRelatedPosts = (
  posts: BlogPost[],
  currentPost: BlogPost,
  limit: number = 3,
): BlogPost[] => {
  return posts
    .filter((post) => post.id !== currentPost.id)
    .filter((post) => post.tags.some((tag) => currentPost.tags.includes(tag)))
    .slice(0, limit);
};

// ADD THIS MISSING FUNCTION:
export const getPostsByCategory = (
  posts: BlogPost[],
  categorySlug: string,
): BlogPost[] => {
  return posts.filter((post) => post.categorySlug === categorySlug);
};
