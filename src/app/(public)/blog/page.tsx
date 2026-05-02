import { blogPosts } from "@/lib/data/blogData";
import { getFeaturedPosts } from "@/lib/utils/blogUtils";
import {
  BlogHero,
  BlogFeaturedPosts,
  BlogPostsGrid,
  BlogNewsletter,
} from "@/components/sections/Blog";

export default function BlogLatestPage() {
  const featuredPosts = getFeaturedPosts(blogPosts, 2);

  return (
    <main className="bg-gray-50 min-h-screen">
      <BlogHero
        badge="Latest Updates"
        title="Latest"
        highlightedText="Stories & Updates"
        subtitle="Discover recipes, chef stories, and the latest news from Tastyc."
      />
      <BlogFeaturedPosts posts={featuredPosts} />
      <BlogPostsGrid />
      <BlogNewsletter />
    </main>
  );
}