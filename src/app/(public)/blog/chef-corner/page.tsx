import { blogPosts } from "@/lib/data/blogData";
import { getChefAuthors, CHEF_CORNER_SLUG } from "@/lib/utils/blogUtils";
import { BlogChefHero, BlogChefClient, BlogNewsletter } from "@/components/sections/Blog";

export default function BlogChefCornerPage() {
  const allChefPosts = blogPosts.filter((post) => post.categorySlug === CHEF_CORNER_SLUG);
  const featuredStory = allChefPosts.find((post) => post.featured);
  const chefs = getChefAuthors(blogPosts);

  return (
    <main className="bg-gray-50 min-h-screen">
      <BlogChefHero />
      <BlogChefClient initialPosts={allChefPosts} chefs={chefs} featuredStory={featuredStory} />
      <BlogNewsletter />
    </main>
  );
}