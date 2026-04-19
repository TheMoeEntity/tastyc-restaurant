import type { Metadata } from "next";
import { Geist, Geist_Mono, Josefin_Sans } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tastyc restaurant & cuisine | Premium Cuisine and eatery",
  description: "Tastyc restaurant & cuisine | Premium Cuisine and eatery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${josefinSans.className} ${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        {/* Pass showHeader=false if Hero has its own header */}
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
