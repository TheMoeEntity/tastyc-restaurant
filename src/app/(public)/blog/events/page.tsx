import { blogPosts } from "@/lib/data/blogData";
import { BlogEventsHero, BlogEventsClient, BlogNewsletter } from "@/components/sections/Blog";

const EVENTS_SLUG = "events";

export default function BlogEventsPage() {
  const allEventPosts = blogPosts.filter((post) => post.categorySlug === EVENTS_SLUG);
  const upcomingEvent = allEventPosts[0];

  return (
    <main className="bg-gray-50 min-h-screen">
      <BlogEventsHero />
      <BlogEventsClient initialPosts={allEventPosts} upcomingEvent={upcomingEvent} />
      <BlogNewsletter />
    </main>
  );
}