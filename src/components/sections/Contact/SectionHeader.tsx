import MotionWrapper from "@/components/MotionWrapper";

export function SectionHeader({
  label,
  title,
  subtitle,
  light = false,
}: {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <MotionWrapper variant="fade-up" duration={600}>
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-0.5 w-6 bg-yellow-500" />
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
            {label}
          </p>
          <div className="h-0.5 w-6 bg-yellow-500" />
        </div>
        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-4 ${light ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`text-base md:text-lg leading-relaxed ${light ? "text-gray-300" : "text-gray-600"}`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </MotionWrapper>
  );
}
