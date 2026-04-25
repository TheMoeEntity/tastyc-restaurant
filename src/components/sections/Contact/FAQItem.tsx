export function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
        isOpen
          ? "border-yellow-400/60 shadow-yellow-100/60 shadow-md"
          : "border-gray-100 hover:shadow-md hover:border-gray-200"
      }`}
    >
      {/* Header / trigger */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
      >
        <h3 className="text-lg md:text-xl font-bold font-serif text-gray-900">
          {question}
        </h3>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-yellow-500 rotate-180"
              : "bg-yellow-500/10 group-hover:bg-yellow-500/20"
          }`}
        >
          <svg
            className={`w-4 h-4 transition-colors duration-300 ${
              isOpen ? "text-white" : "text-yellow-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {/* Animated body */}
      <div
        style={{
          maxHeight: isOpen ? 500 : 0,
          opacity: isOpen ? 1 : 0,
          transition:
            "max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
          overflow: "hidden",
        }}
      >
        <div className="px-6 pb-5 pt-1 border-t border-gray-100">
          <p className="text-gray-600 text-base md:text-lg leading-relaxed pt-3">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
