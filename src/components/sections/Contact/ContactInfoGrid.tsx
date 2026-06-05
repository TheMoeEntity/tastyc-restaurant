"use client";

import { contactInfo } from "@/lib/utils/contactUtils";
import MotionWrapper from "@/components/ui/MotionWrapper";
import { LucideIcon } from "lucide-react";

function ContactInfoCard({ icon: Icon, title, details, delay }: { icon: LucideIcon; title: string; details: string[]; delay: number }) {
  return (
    <MotionWrapper variant="fade-up" delay={delay}>
      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition text-center border border-gray-100">
        <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-7 h-7 text-yellow-500" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-3">{title}</h3>
        {details.map((detail, idx) => (
          <p key={idx} className="text-gray-500 text-sm leading-relaxed">
            {detail}
          </p>
        ))}
      </div>
    </MotionWrapper>
  );
}

export function ContactInfoGrid() {
  return (
    <section className="py-12 md:py-16 px-6 md:px-16 lg:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <ContactInfoCard
              key={index}
              icon={info.icon}
              title={info.title}
              details={info.details}
              delay={info.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}