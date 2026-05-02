"use client";

import { useState } from "react";
import { BlogPost } from "@/types/blog.types";
import { BlogRecipesSearchBar } from "./BlogRecipesSearchBar";
import { BlogRecipesGrid } from "./BlogRecipesGrid";

interface BlogRecipesClientWrapperProps {
  initialPosts: BlogPost[];
}

export function BlogRecipesClientWrapper({ initialPosts }: BlogRecipesClientWrapperProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <BlogRecipesSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BlogRecipesGrid initialPosts={initialPosts} searchQuery={searchQuery} />
    </>
  );
}