import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  FileText,
  Shield,
  MessageSquare,
  Users,
  Star,
  Coffee,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import {
  ContactInfo,
  FAQ,
  SocialLink,
  SupportTopic,
  Location,
  EmailOption,
  CallOption,
  SupportHours,
  StatItem,
} from "@/types/contact.types";
import { StaticImageData } from "next/image";

// import all images statically so next/image can optimise them
import homeImg1 from "@/../public/assets/homeImg1.jpg";
import homeImg2 from "@/../public/assets/homeImg2.jpg";
import homeImg3 from "@/../public/assets/homeImg3.jpg";

// re-export so pages can use the typed version
export type { StaticImageData };

//  CONTACT INFO 

export const contactInfo: ContactInfo[] = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Foodie Street, Lekki Phase 1", "Lagos, Nigeria"],
    delay: 0,
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+234 801 234 5678", "+234 802 345 6789"],
    delay: 100,
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["hello@tastyc.com", "reservations@tastyc.com"],
    delay: 200,
  },
  {
    icon: Clock,
    title: "Opening Hours",
    details: ["Mon - Fri: 11am - 10pm", "Sat - Sun: 12pm - 11pm"],
    delay: 300,
  },
];

//  FAQS 

export const faqs: FAQ[] = [
  {
    question: "Do you accept reservations?",
    answer:
      "Yes, we accept reservations for both lunch and dinner. You can book a table through our reservation page or by calling us directly.",
  },
  {
    question: "Do you offer vegetarian options?",
    answer:
      "Absolutely! We have a wide range of vegetarian and vegan options clearly marked on our menu.",
  },
  {
    question: "Can I order for delivery?",
    answer:
      "Yes, we offer delivery through our website and partner apps. Minimum order for delivery is $15.",
  },
  {
    question: "Do you cater for events?",
    answer:
      "Yes, we provide catering services for corporate events, weddings, and private parties. Contact our events team for a custom quote.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Yes, we have a dedicated parking lot for our guests with over 50 spaces available.",
  },
];

// ── SOCIAL LINKS ─────────────────────────────────────────────────────────────

export const socialLinks: SocialLink[] = [
  { icon: FaFacebookF, href: "https://facebook.com/tastyc", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com/tastyc", label: "Instagram" },
  { icon: FaXTwitter, href: "https://twitter.com/tastyc", label: "Twitter" },
  { icon: FaYoutube, href: "https://youtube.com/tastyc", label: "YouTube" },
];

// SUPPORT TOPICS 

export const supportTopics: SupportTopic[] = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team instantly",
    linkText: "Start Chat",
    linkHref: "#",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email within 24 hours",
    linkText: "Send Email",
    linkHref: "/contact/email",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us for urgent matters",
    linkText: "Call Now",
    linkHref: "/contact/call",
  },
  {
    icon: FileText,
    title: "Help Center",
    description: "Browse our comprehensive guides",
    linkText: "Browse Guides",
    linkHref: "#",
  },
  {
    icon: Shield,
    title: "Report Issue",
    description: "Report a problem with your order",
    linkText: "Report Now",
    linkHref: "#",
  },
  {
    icon: MessageSquare,
    title: "Feedback",
    description: "Share your experience with us",
    linkText: "Give Feedback",
    linkHref: "#",
  },
];

//  SUPPORT FAQS 

export const supportFaqs: FAQ[] = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order from the 'My Orders' page in your account dashboard. You'll also receive SMS and email updates at each stage of your order journey.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and cash on delivery for eligible locations.",
  },
  {
    question: "How do I cancel or modify my order?",
    answer:
      "Orders can be canceled or modified within 5 minutes of placement. Contact our support team immediately for assistance with order changes.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer full refunds for incorrect or unsatisfactory orders. Please contact support within 2 hours of delivery with photos of your order for processing.",
  },
  {
    question: "How do I report a technical issue?",
    answer:
      "Use the 'Report Issue' button above or email tech@tastyc.com with details and screenshots of the problem you're experiencing.",
  },
];

// LOCATIONS — image is StaticImageData, not a string 

export interface LocationWithImage extends Omit<Location, "image"> {
  image: StaticImageData;
}

export const locations: LocationWithImage[] = [
  {
    id: "1",
    name: "Lekki Phase 1",
    address: "123 Foodie Street, Lekki Phase 1",
    city: "Lagos",
    phone: "+234 801 234 5678",
    hours: "Mon - Sun: 11am - 10pm",
    image: homeImg1,
    isMain: true,
  },
  {
    id: "2",
    name: "Victoria Island",
    address: "45 Ahmadu Bello Way, VI",
    city: "Lagos",
    phone: "+234 802 345 6789",
    hours: "Mon - Sun: 12pm - 11pm",
    image: homeImg2,
  },
  {
    id: "3",
    name: "Ikeja City Mall",
    address: "Alausa, Ikeja",
    city: "Lagos",
    phone: "+234 803 456 7890",
    hours: "Mon - Sun: 10am - 9pm",
    image: homeImg3,
  },
  {
    id: "4",
    name: "Port Harcourt",
    address: "GRA Phase 2, Port Harcourt",
    city: "Rivers",
    phone: "+234 804 567 8901",
    hours: "Mon - Sun: 11am - 10pm",
    image: homeImg1,
  },
];

//  LOCATION STATS 

export const locationStats: StatItem[] = [
  { icon: MapPin, value: "4", label: "Locations" },
  { icon: Users, value: "50+", label: "Staff Members" },
  { icon: Coffee, value: "1000+", label: "Daily Customers" },
  { icon: Star, value: "4.9", label: "Rating" },
];

//  EMAIL OPTIONS 

export const emailOptions: EmailOption[] = [
  {
    email: "hello@tastyc.com",
    title: "General Inquiries",
    description: "For general questions, feedback, or partnership opportunities",
    responseTime: "24 hours",
    department: "General",
  },
  {
    email: "reservations@tastyc.com",
    title: "Reservations",
    description: "For table bookings and private dining requests",
    responseTime: "12 hours",
    department: "Reservations",
  },
  {
    email: "catering@tastyc.com",
    title: "Catering",
    description: "For event catering and bulk orders",
    responseTime: "24 hours",
    department: "Catering",
  },
  {
    email: "careers@tastyc.com",
    title: "Careers",
    description: "For job applications and recruitment inquiries",
    responseTime: "3-5 days",
    department: "HR",
  },
  {
    email: "support@tastyc.com",
    title: "Technical Support",
    description: "For website or app-related issues",
    responseTime: "24 hours",
    department: "Tech",
  },
  {
    email: "feedback@tastyc.com",
    title: "Feedback",
    description: "Share your experience and suggestions",
    responseTime: "48 hours",
    department: "Feedback",
  },
];

// CALL OPTIONS 

export const callOptions: CallOption[] = [
  {
    number: "+234 801 234 5678",
    title: "Main Line",
    description: "For general inquiries, reservations, and customer service",
    hours: "24/7",
  },
  {
    number: "+234 802 345 6789",
    title: "Delivery Support",
    description: "For questions about your delivery order",
    hours: "10am - 10pm",
  },
  {
    number: "+234 803 456 7890",
    title: "Catering & Events",
    description: "For large orders and event planning",
    hours: "9am - 6pm (Weekdays)",
  },
  {
    number: "+234 804 567 8901",
    title: "Emergency Support",
    description: "For urgent issues with your order",
    hours: "24/7",
    isEmergency: true,
  },
];

// SUPPORT HOURS 

export const supportHours: SupportHours[] = [
  { day: "Monday - Thursday", hours: "11am - 10pm" },
  { day: "Friday - Saturday", hours: "11am - 11pm" },
  { day: "Sunday", hours: "12pm - 9pm" },
];

//  CALLBACK TIMES 

export const callbackTimes: string[] = [
  "ASAP",
  "Within 1 hour",
  "Within 2 hours",
  "Within 4 hours",
  "Next business day",
];

// HELPERS 

export const getLocationById = (id: string): LocationWithImage | undefined =>
  locations.find((l) => l.id === id);

export const getEmailByDepartment = (department: string): EmailOption | undefined =>
  emailOptions.find((o) => o.department === department);

export const getCallOptionByTitle = (title: string): CallOption | undefined =>
  callOptions.find((o) => o.title === title);

export const getActiveSupportTopics = (): SupportTopic[] => supportTopics;