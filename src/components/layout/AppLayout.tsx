import React from "react";
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
  return (
    <main className="w-full">
      {showHeader && <Header />}
      {children}
      {showFooter && <Footer />}
      <ScrollTop />
    </main>
  );
};

export default AppLayout;