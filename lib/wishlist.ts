import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tour } from "@/types";

/**
 * Server-side wishlist data access (Supabase). A wishlist row links a signed-in
 * user to a tour they saved, so the list follows them across devices. Reads are
 * scoped by the "Users can read own wishlist" RLS policy (user_id = auth.uid()).
 *
 * All reads are defensive: if Supabase is unconfigured, the visitor is anonymous,
 * or the `wishlists` table does not exist yet (migration 0004 not applied), they
 * return empty results instead of throwing — so every page keeps rendering.
 */

export async function getSavedTourIds(): Promise<Set<string>> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return new Set();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data, error } = await supabase
    .from("wishlists")
    .select("tour_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching wishlist ids:", error.message);
    return new Set();
  }

  return new Set((data ?? []).map((row) => row.tour_id as string));
}

export async function getWishlistCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return 0;

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("wishlists")
    .select("tour_id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error counting wishlist:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function getWishlistTours(): Promise<Tour[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("wishlists")
    .select("created_at, tours(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wishlist tours:", error.message);
    return [];
  }

  // The joined `tours` relation comes back as an object (or array depending on
  // the client); normalise and drop rows whose tour was deleted.
  return (data ?? [])
    .map((row) => {
      const tour = Array.isArray(row.tours) ? row.tours[0] : row.tours;
      return tour as Tour | null;
    })
    .filter((tour): tour is Tour => Boolean(tour));
}
