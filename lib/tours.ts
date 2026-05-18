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
  const fallbackTour =
    sampleTours.find((tour) => tour.slug === slugOrId || tour.id === slugOrId) ??
    null;

  if (!supabase) {
    return fallbackTour;
  }

  const { data: tourBySlug, error: slugError } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slugOrId)
    .maybeSingle();

  if (tourBySlug) {
    return tourBySlug as Tour;
  }

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      slugOrId
    );

  if (isUuid) {
    const { data: tourById } = await supabase
      .from("tours")
      .select("*")
      .eq("id", slugOrId)
      .maybeSingle();

    if (tourById) {
      return tourById as Tour;
    }
  }

  if (slugError) {
    return fallbackTour;
  }

  return fallbackTour;
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
