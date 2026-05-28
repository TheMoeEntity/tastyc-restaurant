import type { Metadata } from "next";
import { Geist, Geist_Mono, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { useRestaurantConfig } from "@/hooks/useRestaurantConfig";

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

const DEFAULT_NAME = "Tastyc Restaurant";
const DEFAULT_TAGLINE = "Where every bite tells a story";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = useRestaurantConfig();
  const name = config?.name || DEFAULT_NAME;
  const tagline = config?.tagline || DEFAULT_TAGLINE;
  return {
    title: `${name} | ${tagline}`,
    description: `${name} | ${tagline}`,
    icons: { icon: "/icon.svg", apple: "/apple-icon.svg" },
  }
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
