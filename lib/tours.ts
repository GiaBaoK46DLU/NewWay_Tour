import { sampleTours } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tour } from "@/types";

export async function getTours(fallbackToSample = true): Promise<Tour[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return fallbackToSample ? sampleTours : [];
  }

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return fallbackToSample ? sampleTours : [];
  }

  return data as Tour[];
}

export async function getTourBySlug(slugOrId: string): Promise<Tour | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      sampleTours.find(
        (tour) => tour.slug === slugOrId || tour.id === slugOrId
      ) ?? null
    );
  }

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
    .single();

  if (error || !data) {
    return (
      sampleTours.find(
        (tour) => tour.slug === slugOrId || tour.id === slugOrId
      ) ?? null
    );
  }

  return data as Tour;
}

export async function getBookings() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("bookings")
    .select("*, tours(title)")
    .order("created_at", { ascending: false });

  return data ?? [];
}
