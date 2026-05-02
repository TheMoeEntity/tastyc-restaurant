import MotionWrapper from "@/components/MotionWrapper";
import { CalendarDays } from "lucide-react";

export function BlogEventsHero() {
  return (
    <section className="relative py-20 md:py-24 px-6 md:px-16 lg:px-20 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <MotionWrapper variant="fade-up" duration={700}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-0.5 w-6 bg-yellow-500" />
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
              Stay Updated
            </p>
            <div className="h-0.5 w-6 bg-yellow-500" />
          </div>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <CalendarDays className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-4">
            <span className="text-yellow-500">Events</span> & News
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Stay updated with the latest events, promotions, and news from Tastyc.
          </p>
        </MotionWrapper>
      </div>
    </section>
  );
}