// src/types/blog.types.ts

export interface BlogAuthor {
  name: string;
  id: string;
  avatar: string;
  bio?: string;
  role?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  categorySlug: string;
  author: BlogAuthor;
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  featured: boolean;
}

export interface BlogCategory {
  name: string;
  slug: string;
  count: number;
  description?: string;
}