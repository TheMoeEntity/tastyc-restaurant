import AppLayout from "@/components/layout/AppLayout";
import { Toaster } from "sonner";
import React from "react";
import { getRestaurantConfig } from "@/lib/api/config";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const config = await getRestaurantConfig();
  const siteName = config?.name ?? "Tastyc";
  return (
    <>
      <AppLayout siteName={siteName}>{children}</AppLayout>
      <Toaster position="top-right" richColors />
    </>
  );
};

export default PublicLayout;
