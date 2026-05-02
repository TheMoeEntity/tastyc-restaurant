import { blogPosts } from "@/lib/data/blogData";
import {
  BlogRecipesHero,
  BlogPopularRecipes,
  BlogNewsletter,
  BlogRecipesClientWrapper,
} from "@/components/sections/Blog";

const RECIPES_SLUG = "recipes";

export default function BlogRecipesPage() {
  const allRecipePosts = blogPosts.filter((post) => post.categorySlug === RECIPES_SLUG);
  const popularRecipes = [...allRecipePosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  return (
    <main className="bg-gray-50 min-h-screen">
      <BlogRecipesHero />
      <BlogPopularRecipes posts={popularRecipes} />
      <BlogRecipesClientWrapper initialPosts={allRecipePosts} />
      <BlogNewsletter />
    </main>
  );
}