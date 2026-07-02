import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Review } from "@/types";

/**
 * Server-side reviews data access (Supabase). Reviews are publicly readable
 * (the "Public can read reviews" RLS policy), so every visitor sees the same
 * list; only signed-in users can write (enforced in the server action + RLS).
 *
 * Reads are defensive: if Supabase is unconfigured or the `reviews` table does
 * not exist yet (migration 0004 not applied), they return empty results instead
 * of throwing, so the tour detail page keeps rendering.
 */

export async function getTourReviews(tourId: string): Promise<Review[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("id, tour_id, user_id, author_name, rating, comment, created_at, updated_at")
    .eq("tour_id", tourId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error.message);
    return [];
  }

  return (data ?? []) as Review[];
}

/** The current user's own review for a tour, if any (used to prefill the form). */
export async function getOwnReviewForTour(tourId: string): Promise<Review | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("reviews")
    .select("id, tour_id, user_id, author_name, rating, comment, created_at, updated_at")
    .eq("tour_id", tourId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching own review:", error.message);
    return null;
  }

  return (data as Review) ?? null;
}

export function averageRating(reviews: Pick<Review, "rating">[]): number {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}
