import MotionWrapper from "@/components/MotionWrapper";

export function ContactInfoCard({
  icon: Icon,
  title,
  details,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  details: string[];
  delay?: number;
}) {
  return (
    <MotionWrapper variant="fade-up" delay={delay} duration={500}>
      <div className="group bg-white rounded-3xl p-6 md:p-8 border border-gray-100 h-full shadow-sm hover:shadow-xl transition-all duration-500">
        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-5 group-hover:bg-yellow-500/20 transition">
          <Icon className="w-7 h-7 text-yellow-500" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold font-serif text-gray-900 mb-4">
          {title}
        </h3>
        <div className="space-y-2">
          {details.map((detail, i) => (
            <p
              key={i}
              className="text-gray-600 text-base md:text-lg leading-relaxed"
            >
              {detail}
            </p>
          ))}
        </div>
      </div>
    </MotionWrapper>
  );
}
