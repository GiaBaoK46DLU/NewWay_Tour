"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. Pass 0 to keep it until manually closed. */
  duration?: number;
}

/**
 * Lightweight, self-contained toast. Renders fixed at the top-right, slides in
 * on mount, and auto-dismisses after `duration`. Purely presentational and
 * client-side — drop it onto any page (e.g. the booking confirmation page) to
 * show a transient success/error notice. No provider/context needed.
 */
export function Toast({ message, variant = "success", duration = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Defer to the next frame so the enter transition actually animates.
    const showId = requestAnimationFrame(() => setVisible(true));
    if (duration <= 0) {
      return () => cancelAnimationFrame(showId);
    }
    const hideId = setTimeout(() => setVisible(false), duration);
    return () => {
      cancelAnimationFrame(showId);
      clearTimeout(hideId);
    };
  }, [duration]);

  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      aria-live="polite"
      role="status"
      className={cn(
        "fixed right-4 top-24 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-soft transition-all duration-300",
        visible ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-4 opacity-0",
        variant === "success"
          ? "border-forest/20 bg-white text-ink"
          : "border-red-200 bg-red-50 text-red-700"
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 h-5 w-5 shrink-0",
          variant === "success" ? "text-forest" : "text-red-600"
        )}
      />
      <p className="text-sm font-medium leading-6">{message}</p>
      <button
        aria-label="Đóng thông báo"
        className="ml-1 shrink-0 rounded-full p-1 text-mist transition hover:bg-cream"
        onClick={() => setVisible(false)}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
