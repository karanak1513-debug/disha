import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title = "Confirm Action", message = "Are you sure you want to proceed?" }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl border border-slate-100 space-y-4 z-10"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">{title}</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed font-semibold">{message}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-650 cursor-pointer transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="rounded-2xl bg-rose-500 hover:bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg hover:shadow-rose-500/20 cursor-pointer transition-all active:scale-[0.98]"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
