"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type WishlistToggleResult = {
  saved: boolean;
  /** Present when the toggle could not be applied. */
  error?: "auth" | "config" | "failed";
};

/**
 * Toggle a tour in the signed-in user's wishlist. Requires authentication —
 * anonymous visitors get `{ error: "auth" }` and the client redirects them to
 * login. RLS guarantees a user can only ever touch their own rows.
 */
export async function toggleWishlist(tourId: string): Promise<WishlistToggleResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { saved: false, error: "config" };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { saved: false, error: "auth" };

  if (!tourId) return { saved: false, error: "failed" };

  const { data: existing, error: selectError } = await supabase
    .from("wishlists")
    .select("tour_id")
    .eq("user_id", user.id)
    .eq("tour_id", tourId)
    .maybeSingle();

  if (selectError) {
    console.error("Error reading wishlist:", selectError.message);
    return { saved: false, error: "failed" };
  }

  if (existing) {
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("tour_id", tourId);
    if (error) {
      console.error("Error removing from wishlist:", error.message);
      return { saved: true, error: "failed" };
    }
    revalidatePath("/wishlist");
    return { saved: false };
  }

  const { error } = await supabase
    .from("wishlists")
    .insert({ user_id: user.id, tour_id: tourId });
  if (error) {
    console.error("Error adding to wishlist:", error.message);
    return { saved: false, error: "failed" };
  }
  revalidatePath("/wishlist");
  return { saved: true };
}

/** Remove a single tour from the wishlist (used by the /wishlist page). */
export async function removeFromWishlist(tourId: string): Promise<WishlistToggleResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { saved: false, error: "config" };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { saved: false, error: "auth" };

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", user.id)
    .eq("tour_id", tourId);

  if (error) {
    console.error("Error removing from wishlist:", error.message);
    return { saved: true, error: "failed" };
  }

  revalidatePath("/wishlist");
  return { saved: false };
}
