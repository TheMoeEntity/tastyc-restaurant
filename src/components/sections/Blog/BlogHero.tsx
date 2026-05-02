import MotionWrapper from "@/components/MotionWrapper";

interface BlogHeroProps {
  badge: string;
  title: string;
  highlightedText?: string;
  subtitle: string;
}

export function BlogHero({ badge, title, highlightedText, subtitle }: BlogHeroProps) {
  return (
    <section className="relative py-20 md:py-24 px-6 md:px-16 lg:px-20 bg-white">
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center opacity-40">
        <div className="w-80 h-80 bg-yellow-400/10 blur-[120px] rounded-full" />
      </div>
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <MotionWrapper variant="fade-up" duration={700}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-0.5 w-6 bg-yellow-500" />
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
              {badge}
            </p>
            <div className="h-0.5 w-6 bg-yellow-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-6">
            {title} {highlightedText && <span className="text-yellow-500">{highlightedText}</span>}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </MotionWrapper>
      </div>
    </section>
  );
}