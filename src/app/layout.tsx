import type { Metadata } from "next";
import { Geist, Geist_Mono, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { getRestaurantConfig } from "@/lib/api/config";

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

export async function generateMetadata(): Promise<Metadata> {
  const config = await getRestaurantConfig();
  const title = `${config.name} | ${config.tagline}`;
  return {
    title,
    description: title,
    icons: { icon: "/icon.svg", apple: "/apple-icon.svg" },
  };
}

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
