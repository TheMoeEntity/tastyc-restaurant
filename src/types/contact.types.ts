import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { StaticImageData } from "next/image";

export interface ContactInfo {
  icon: LucideIcon;
  title: string;
  details: string[];
  delay: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SocialLink {
  icon: IconType;
  href: string;
  label: string;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface SupportTopic {
  icon: LucideIcon;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  image: string | StaticImageData;
  isMain?: boolean;
}

export interface EmailOption {
  email: string;
  title: string;
  description: string;
  responseTime: string;
  department: string;
}

export interface CallOption {
  number: string;
  title: string;
  description: string;
  hours: string;
  isEmergency?: boolean;
}

export interface SupportHours {
  day: string;
  hours: string;
}

export interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}