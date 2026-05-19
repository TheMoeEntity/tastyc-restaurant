"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface ModalState {
  open: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
}

const INITIAL: ModalState = {
  open: false,
  options: { title: "" },
  resolve: null,
};

export function useConfirmModal() {
  const [state, setState] = useState<ModalState>(INITIAL);

  // Close on Escape
  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.open]);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ open: true, options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    state.resolve?.(true);
    setState(INITIAL);
  };

  const handleCancel = () => {
    state.resolve?.(false);
    setState(INITIAL);
  };

  const modal = (
    <AnimatePresence>
      {state.open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={handleCancel}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm p-6"
            initial={{ scale: 0.9, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-gray-900 font-bold text-base mb-1">
              {state.options.title}
            </h2>

            {state.options.message && (
              <p className="text-gray-500 text-sm mb-6">
                {state.options.message}
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                {state.options.cancelLabel ?? "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition ${
                  state.options.danger
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-yellow-500 hover:bg-yellow-400 text-black"
                }`}
              >
                {state.options.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { confirm, modal };
}
