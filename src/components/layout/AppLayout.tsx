"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ScrollTop from "../ui/ScrollTop";
import Header from "./Header";
import Footer from "./Footer";

type AppLayoutProps = {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
};

const AppLayout = ({
  children,
  showHeader = true,
  showFooter = true,
}: AppLayoutProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main className="w-full">
      {showHeader && !isHome && <Header />}
      {children}
      {showFooter && <Footer />}
      <ScrollTop />
    </main>
  );
};

export default AppLayout;