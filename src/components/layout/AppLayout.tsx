import React from "react";
import ScrollTop from "../ui/ScrollTop";
import Header from "./Header";
import Footer from "./Footer";
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full">
      <Header/>
      {children}
      <Footer/>
      <ScrollTop />
    </main>
  );
};

export default AppLayout;
