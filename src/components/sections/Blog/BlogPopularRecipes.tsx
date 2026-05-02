import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { BlogPost } from "@/types/blog.types";

interface BlogPopularRecipesProps {
  posts: BlogPost[];
}

export function BlogPopularRecipes({ posts }: BlogPopularRecipesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-8 px-6 md:px-16 lg:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          🔥 Most Popular
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/post/${post.slug}`} className="group">
              <div className="relative h-40 rounded-lg overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-sm font-bold text-white line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-200 mt-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span>{post.views} views</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}