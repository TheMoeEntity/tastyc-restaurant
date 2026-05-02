import { blogPosts } from "@/lib/data/blogData";
import { BlogPopularHero, BlogPopularClient, BlogNewsletter } from "@/components/sections/Blog";

export default function BlogPopularPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <BlogPopularHero />
      <BlogPopularClient initialPosts={blogPosts} />
      <BlogNewsletter />
    </main>
  );
}