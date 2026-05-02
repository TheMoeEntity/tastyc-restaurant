import MotionWrapper from "@/components/MotionWrapper";
import { TrendingUp } from "lucide-react";

export function BlogPopularHero() {
  return (
    <section className="relative py-20 md:py-24 px-6 md:px-16 lg:px-20 bg-gradient-to-r from-yellow-50 to-orange-50">
      <div className="max-w-4xl mx-auto text-center">
        <MotionWrapper variant="fade-up" duration={700}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-0.5 w-6 bg-yellow-500" />
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
              Trending Now
            </p>
            <div className="h-0.5 w-6 bg-yellow-500" />
          </div>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-4">
            Most <span className="text-yellow-500">Popular</span> Posts
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the most read, loved, and discussed articles from our community.
          </p>
        </MotionWrapper>
      </div>
    </section>
  );
}