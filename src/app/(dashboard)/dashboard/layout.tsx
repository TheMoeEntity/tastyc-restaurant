import React from "react";
import DashboardLayout from "@/components/layout/Dashboard/DashboardLayout";

const DashboardLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardLayoutWrapper;
