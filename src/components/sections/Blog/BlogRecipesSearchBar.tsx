"use client";

import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";

interface BlogRecipesSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function BlogRecipesSearchBar({ searchQuery, onSearchChange }: BlogRecipesSearchBarProps) {
  return (
    <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 py-4 px-6 md:px-16 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
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
  );
}