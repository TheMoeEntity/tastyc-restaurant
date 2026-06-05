import Link from "next/link";
import Image from "next/image";
import MotionWrapper from "@/components/ui/MotionWrapper";
import { Calendar, Clock, Star } from "lucide-react";
import { getRelativeTime, getReadTimeDisplay } from "@/lib/utils/blogUtils";
import { BlogPost } from "@/types/blog.types";

interface BlogFeaturedPostsProps {
  posts: BlogPost[];
}

export function BlogFeaturedPosts({ posts }: BlogFeaturedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-12 px-6 md:px-16 lg:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.map((post, idx) => (
            <MotionWrapper key={post.id} variant="fade-up" delay={idx * 150}>
              <div className="group block">
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-3">
                      Featured
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-200 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-gray-300 text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {getRelativeTime(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getReadTimeDisplay(post.readTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {post.likes} likes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}