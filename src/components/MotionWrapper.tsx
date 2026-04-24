"use client";

import { MotionWrapperProps } from "@/types";
import { useEffect, useRef } from "react";

// inject styles once into <head> instead of inside every component
function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("mw-styles")) return; // already injected
  const style = document.createElement("style");
  style.id = "mw-styles";
  style.innerHTML = `
    .mw-fade-up    { opacity: 0; transform: translateY(40px); }
    .mw-fade-down  { opacity: 0; transform: translateY(-40px); }
    .mw-fade-left  { opacity: 0; transform: translateX(-40px); }
    .mw-fade-right { opacity: 0; transform: translateX(40px); }
    .mw-fade-in    { opacity: 0; transform: scale(0.96); }

    .mw-fade-up.mw-visible,
    .mw-fade-down.mw-visible,
    .mw-fade-left.mw-visible,
    .mw-fade-right.mw-visible,
    .mw-fade-in.mw-visible {
      opacity: 1;
      transform: none;
    }
  `;
  document.head.appendChild(style);
}

export default function MotionWrapper({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0, // ✅ changed from 0.1 to 0 — fires as soon as 1px enters viewport
  className = "",
}: MotionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectStyles(); // inject once into head

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.add("mw-visible");
            }, delay);
            observer.disconnect();
          }
        });
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div
      ref={ref}
      className={`mw-${variant} ${className}`}
      style={{
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}
