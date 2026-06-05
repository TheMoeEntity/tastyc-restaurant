"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ScrollTop from "../ui/ScrollTop";
import Header from "./Header";
import Footer from "./Footer";
import LoadingScreen from "../ui/LoadingScreen";

type AppLayoutProps = {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  siteName: string;
};

const AppLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  siteName,
}: AppLayoutProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main className="w-full overflow-x-hidden">
      <LoadingScreen siteName={siteName} />
      {showHeader && <Header />}
      <div className={showHeader && !isHome ? "pt-28" : ""}>{children}</div>
      {showFooter && <Footer />}
      <ScrollTop />
    </main>
  );
};

export default AppLayout;
