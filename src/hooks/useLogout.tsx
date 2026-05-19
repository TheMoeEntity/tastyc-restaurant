"use client";

import apiFetch from "@/lib/api";
import { useConfirmModal } from "./useConfirmModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogout = (callback?: () => void) => {
  const { confirm, modal } = useConfirmModal();
  const { push } = useRouter();
  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Log out?",
      message: "You'll need to sign in again to access your account.",
      confirmLabel: "Log out",
      cancelLabel: "Stay",
      danger: true,
    });
    if (!confirmed) return;
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
    } catch {
      // best-effort — clear UI regardless
      toast.error("Failed to logout, try again");
    }
    callback?.();
    push("/");
  };

  return { handleLogout, modal };
};
