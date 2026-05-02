"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
  label: string;
  title?: ReactNode;
  subtitle?: string;
  light?: boolean;
}

export function SectionHeader({ label, title, subtitle, light = false }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <p className={`text-sm font-bold uppercase tracking-widest mb-3 ${light ? 'text-yellow-400' : 'text-yellow-500'}`}>
        {label}
      </p>
      {title && (
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-4 ${light ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`text-base max-w-2xl mx-auto ${light ? 'text-gray-300' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}