"use client";

import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  ChevronRight,
  Headphones
} from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";

const supportChannels = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get response within 24 hours",
    contact: "support@tastyc.com",
    action: "mailto:support@tastyc.com",
    buttonText: "Send Email",
    color: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "24/7 customer support",
    contact: "+234 801 234 5678",
    action: "tel:+2348012345678",
    buttonText: "Call Now",
    color: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    contact: "Available 9am - 9pm",
    action: "#",
    buttonText: "Start Chat",
    color: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
];

export function SupportContact() {
  return (
    <section className="py-16 md:py-20 px-6 md:px-16 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-3">
            Still Need Help?
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Our support team is here to assist you. Choose your preferred way to reach us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {supportChannels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <MotionWrapper key={index} variant="fade-up" delay={index * 100}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition p-6 text-center group">
                  <div className={`w-14 h-14 rounded-xl ${channel.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${channel.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">{channel.description}</p>
                  <p className="text-gray-700 font-semibold text-sm mb-4">
                    {channel.contact}
                  </p>
                  <Link
                    href={channel.action}
                    className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold text-sm transition group"
                  >
                    {channel.buttonText} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </MotionWrapper>
            );
          })}
        </div>

        {/* Contact Form Section - Connected to Contact Page */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Headphones className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-bold font-serif text-gray-900">
                Need to speak with someone?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Visit our full contact page for more ways to reach us, including our location and social media.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
            >
              Go to Contact Page <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="text-center mt-12 pt-8 border-t border-gray-100">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Support Hours: Monday - Sunday, 9:00 AM - 9:00 PM (WAT)</span>
          </div>
        </div>
      </div>
    </section>
  );
}