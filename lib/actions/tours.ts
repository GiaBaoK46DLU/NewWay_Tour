"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import {
  TOUR_VALIDATION,
  TOUR_ERROR_MESSAGES,
  TOUR_FIELD_ERRORS,
  TOUR_DEFAULTS,
  QUERY_PARAMS,
  DATABASE_CONFIG
} from "@/lib/constants";

interface TourValidationErrors {
  [key: string]: string;
}

/**
 * Validate tour data against business rules and constraints.
 * Used by create and update operations to ensure data consistency.
 * Validation mirrors database CHECK constraints for defense in depth.
 */
function validateTourData(payload: any): TourValidationErrors {
  const errors: TourValidationErrors = {};

  if (!payload.title || payload.title.trim().length < TOUR_VALIDATION.MIN_TITLE_LENGTH) {
    errors.title = TOUR_FIELD_ERRORS.TITLE_MIN;
  } else if (payload.title.length > TOUR_VALIDATION.MAX_TITLE_LENGTH) {
    errors.title = TOUR_FIELD_ERRORS.TITLE_MAX(TOUR_VALIDATION.MAX_TITLE_LENGTH);
  }

  if (!payload.description || payload.description.trim().length < TOUR_VALIDATION.MIN_DESCRIPTION_LENGTH) {
    errors.description = TOUR_FIELD_ERRORS.DESCRIPTION_MIN;
  } else if (payload.description.length > TOUR_VALIDATION.MAX_DESCRIPTION_LENGTH) {
    errors.description = TOUR_FIELD_ERRORS.DESCRIPTION_MAX(TOUR_VALIDATION.MAX_DESCRIPTION_LENGTH);
  }

  if (!payload.location || payload.location.trim().length === 0) {
    errors.location = TOUR_FIELD_ERRORS.LOCATION_REQUIRED;
  }

  if (!payload.duration || payload.duration.trim().length === 0) {
    errors.duration = TOUR_FIELD_ERRORS.DURATION_REQUIRED;
  }

  if (!payload.price || payload.price <= TOUR_VALIDATION.MIN_PRICE - 1) {
    errors.price = TOUR_FIELD_ERRORS.PRICE_INVALID;
  } else if (payload.price > TOUR_VALIDATION.MAX_PRICE) {
    errors.price = TOUR_FIELD_ERRORS.PRICE_TOO_HIGH;
  }

  if (!payload.rating || payload.rating < TOUR_VALIDATION.MIN_RATING || payload.rating > TOUR_VALIDATION.MAX_RATING) {
    errors.rating = TOUR_FIELD_ERRORS.RATING_INVALID;
  }

  if (!payload.slug || payload.slug.trim().length === 0) {
    errors.slug = TOUR_FIELD_ERRORS.SLUG_REQUIRED;
  } else if (!TOUR_VALIDATION.SLUG_REGEX.test(payload.slug)) {
    errors.slug = TOUR_FIELD_ERRORS.SLUG_INVALID;
  }

  if (payload.itinerary && payload.itinerary.length > TOUR_VALIDATION.MAX_ITINERARY_ITEMS) {
    errors.itinerary = TOUR_FIELD_ERRORS.ITINERARY_MAX_ITEMS(TOUR_VALIDATION.MAX_ITINERARY_ITEMS);
  }

  if (payload.itinerary) {
    for (let i = 0; i < payload.itinerary.length; i++) {
      if (payload.itinerary[i].length > TOUR_VALIDATION.MAX_ITINERARY_ITEM_LENGTH) {
        errors.itinerary = TOUR_FIELD_ERRORS.ITINERARY_ITEM_MAX_LENGTH(TOUR_VALIDATION.MAX_ITINERARY_ITEM_LENGTH);
        break;
      }
    }
  }

  return Object.keys(errors).length > 0 ? errors : {};
}

function getListValue(formData: FormData, key: string) {
  return String(formData.get(key) || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Upload tour image to Supabase storage.
 * Validates MIME type and file size before upload.
 * Uses UUID for filename to prevent race conditions on concurrent uploads.
 * Returns fallback URL if upload fails or is skipped.
 */
async function uploadTourImage(formData: FormData, fallbackUrl = "") {
  const supabase = await createSupabaseServerClient();
  const image = formData.get("image");

  if (!supabase || !(image instanceof File) || image.size === 0) {
    return fallbackUrl;
  }

  if (!TOUR_VALIDATION.ALLOWED_IMAGE_TYPES.includes(image.type as any)) {
    return fallbackUrl;
  }

  if (image.size > TOUR_VALIDATION.MAX_IMAGE_SIZE) {
    return fallbackUrl;
  }

  const ext = image.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("tour-images")
    .upload(filename, image, { upsert: true });

  if (error) {
    console.error("Image upload failed:", error.message);
    return fallbackUrl;
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from("tour-images").getPublicUrl(filename);

  return publicUrl;
}

function getTourPayload(formData: FormData, imageUrl: string) {
  const title = String(formData.get("title") || "").trim();
  const explicitSlug = String(formData.get("slug") || "").trim();

  return {
    title,
    slug: explicitSlug || slugify(title),
    description: String(formData.get("description") || "").trim(),
    location: String(formData.get("location") || "").trim(),
    duration: String(formData.get("duration") || "").trim(),
    price: Number(formData.get("price") || 0),
    rating: Number(formData.get("rating") || TOUR_DEFAULTS.RATING),
    image_url: imageUrl || String(formData.get("image_url") || ""),
    itinerary: getListValue(formData, "itinerary"),
    included_services: getListValue(formData, "included_services"),
    tour_type: String(formData.get("tour_type") || TOUR_DEFAULTS.TYPE)
  };
}

/**
 * Server action to create a new tour.
 * Requires admin authentication. Validates all tour data, uploads image, inserts record.
 */
export async function createTour(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    redirect(`/login?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_UNAUTHORIZED}`);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const imageUrl = await uploadTourImage(formData, String(formData.get("image_url") || ""));
  const payload = getTourPayload(formData, imageUrl);

  const validationErrors = validateTourData(payload);
  if (Object.keys(validationErrors).length > 0) {
    redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_VALIDATION_FAILED}`);
  }

  try {
    const { error } = await supabase.from("tours").insert(payload);

    if (error) {
      console.error("Failed to create tour:", error.message);
      if (error.message.includes(QUERY_PARAMS.ERROR_DUPLICATE_KEY)) {
        redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_DUPLICATE_SLUG}`);
      }
      redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_CREATE_FAILED}`);
    }
  } catch (err) {
    console.error("Unexpected error creating tour:", err);
    redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_UNEXPECTED}`);
  }

  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/dashboard/tours");
  redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_SUCCESS}=${QUERY_PARAMS.TOUR_SUCCESS_CREATED}`);
}

/**
 * Server action to update an existing tour.
 * Requires admin authentication. Validates all tour data, handles image updates.
 */
export async function updateTour(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    redirect(`/login?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_UNAUTHORIZED}`);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !DATABASE_CONFIG.UUID_PATTERN.test(id)) {
    redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_INVALID_ID}`);
  }

  const fallbackUrl = String(formData.get("existing_image_url") || "");
  const imageUrl = await uploadTourImage(formData, fallbackUrl);
  const payload = getTourPayload(formData, imageUrl);

  const validationErrors = validateTourData(payload);
  if (Object.keys(validationErrors).length > 0) {
    redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_VALIDATION_FAILED}`);
  }

  try {
    const { error } = await supabase.from("tours").update(payload).eq("id", id);

    if (error) {
      console.error("Failed to update tour:", error.message);
      if (error.message.includes(QUERY_PARAMS.ERROR_DUPLICATE_KEY)) {
        redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_DUPLICATE_SLUG}`);
      }
      redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_UPDATE_FAILED}`);
    }
  } catch (err) {
    console.error("Unexpected error updating tour:", err);
    redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_UNEXPECTED}`);
  }

  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath(`/tours/${payload.slug}`);
  revalidatePath("/dashboard/tours");
  redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_SUCCESS}=${QUERY_PARAMS.TOUR_SUCCESS_UPDATED}`);
}

/**
 * Server action to soft-delete a tour.
 * Requires admin authentication. Sets deleted_at timestamp instead of hard delete.
 * Preserves audit trail and allows restore if needed.
 */
export async function deleteTour(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    redirect(`/login?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_UNAUTHORIZED}`);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !DATABASE_CONFIG.UUID_PATTERN.test(id)) {
    redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_INVALID_ID}`);
  }

  try {
    const { data: tour } = await supabase
      .from("tours")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!tour) {
      redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_NOT_FOUND}`);
    }

    const { error } = await supabase.from("tours").update({ deleted_at: new Date().toISOString() }).eq("id", id);

    if (error) {
      console.error("Failed to delete tour:", error.message);
      redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_DELETE_FAILED}`);
    }
  } catch (err) {
    console.error("Unexpected error deleting tour:", err);
    redirect(`/dashboard/tours?${QUERY_PARAMS.TOUR_ERROR}=${QUERY_PARAMS.ERROR_UNEXPECTED}`);
  }

  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/dashboard/tours");
  redirect("/dashboard/tours");
}
