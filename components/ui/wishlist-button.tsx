"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleWishlist } from "@/lib/actions/wishlist";

/**
 * Heart toggle that saves/removes a tour from the signed-in user's Supabase
 * wishlist (cross-device). Anonymous visitors are redirected to login with a
 * `next` back to the current page. State is optimistic and reconciled with the
 * server action result. `variant="overlay"` sits on a card image; `"inline"` is
 * a full-width bordered button for the tour detail sidebar.
 */
export function WishlistButton({
  tourId,
  initialSaved = false,
  isAuthenticated,
  variant = "overlay"
}: {
  tourId: string;
  initialSaved?: boolean;
  isAuthenticated: boolean;
  variant?: "overlay" | "inline";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    // Optimistic flip, reconciled by the server result.
    setSaved((prev) => !prev);
    startTransition(async () => {
      const result = await toggleWishlist(tourId);
      if (result.error) {
        // Roll back on failure (e.g. session expired mid-action).
        setSaved(result.saved);
        if (result.error === "auth") {
          router.push(`/login?next=${encodeURIComponent(pathname)}`);
        }
        return;
      }
      setSaved(result.saved);
    });
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? "Bỏ khỏi yêu thích" : "Lưu vào yêu thích"}
        data-testid="wishlist-toggle"
        disabled={isPending}
        onClick={handleClick}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border text-sm font-bold transition disabled:opacity-70",
          saved
            ? "border-earth/30 bg-earth/10 text-earth"
            : "border-forest/15 bg-cream text-forest hover:bg-forest hover:text-white"
        )}
      >
        <Heart className={cn("h-5 w-5", saved && "fill-earth")} />
        {saved ? "Đã lưu vào yêu thích" : "Lưu tour yêu thích"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Bỏ khỏi yêu thích" : "Lưu vào yêu thích"}
      data-testid="wishlist-toggle"
      disabled={isPending}
      onClick={handleClick}
      className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-earth shadow-card backdrop-blur transition hover:scale-105 disabled:opacity-70"
    >
      <Heart className={cn("h-5 w-5", saved ? "fill-earth text-earth" : "text-mist")} />
    </button>
  );
}
