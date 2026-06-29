import { requireAdmin } from "@/lib/auth";
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
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tours:", error.message);
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

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      slugOrId
    );

  try {
    if (isUuid) {
      const [slugResult, idResult] = await Promise.all([
        supabase
          .from("tours")
          .select("*")
          .eq("slug", slugOrId)
          .is("deleted_at", null)
          .maybeSingle(),
        supabase
          .from("tours")
          .select("*")
          .eq("id", slugOrId)
          .is("deleted_at", null)
          .maybeSingle()
      ]);

      if (slugResult.data) return slugResult.data as Tour;
      if (idResult.data) return idResult.data as Tour;
    } else {
      const { data: tourBySlug } = await supabase
        .from("tours")
        .select("*")
        .eq("slug", slugOrId)
        .is("deleted_at", null)
        .maybeSingle();

      if (tourBySlug) return tourBySlug as Tour;
    }
  } catch (err) {
    console.error("Error fetching tour:", err);
  }

  return fallbackTour;
}

export async function getBookings() {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*, tours!inner(id, title)")
    .is("cancelled_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error.message);
    return [];
  }

  return data ?? [];
}
