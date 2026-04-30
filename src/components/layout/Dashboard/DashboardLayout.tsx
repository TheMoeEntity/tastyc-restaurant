import React from "react";
import Header from "./Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="p-4 min-h-screen bg-gray-50">{children}</main>
    </>
  );
};

export default DashboardLayout;
