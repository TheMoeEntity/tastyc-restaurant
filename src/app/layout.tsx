import type { Metadata } from "next";
import { Geist, Geist_Mono, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',    // ← add to all three
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  display: 'swap',    // ← add to all three
  preload: false,
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${josefinSans.className} ${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
