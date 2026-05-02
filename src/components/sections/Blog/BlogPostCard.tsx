import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, MessageCircle } from "lucide-react";
import { getRelativeTime, getReadTimeDisplay } from "@/lib/utils/blogUtils";
import { BlogPost } from "@/types/blog.types";
import { Helper } from "@/lib/Helper";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col">
      <Link href={`/blog/${post.slug}`} className="relative h-56 overflow-hidden block">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {post.featured && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            Featured
          </div>
        )}
      </Link>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <Link
            href={Helper.getCategoryLink(post.categorySlug)}
            className="text-xs font-semibold text-yellow-600 uppercase tracking-wider hover:text-yellow-700 transition"
          >
            {post.category}
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{getRelativeTime(post.publishedAt)}</span>
          </div>
        </div>

        <Link href={`/blog/${post.slug}`} className="block mb-3">
          <h3 className="text-xl font-bold font-serif text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {post.author.name}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getReadTimeDisplay(post.readTime)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            {post.comments} comments
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}