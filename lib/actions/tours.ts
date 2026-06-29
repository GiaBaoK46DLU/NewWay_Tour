"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_ITINERARY_ITEMS = 20;
const MAX_ITINERARY_ITEM_LENGTH = 300;

interface TourValidationErrors {
  [key: string]: string;
}

function validateTourData(payload: any): TourValidationErrors {
  const errors: TourValidationErrors = {};

  if (!payload.title || payload.title.trim().length < 3) {
    errors.title = "Tiêu đề phải có tối thiểu 3 ký tự.";
  } else if (payload.title.length > MAX_TITLE_LENGTH) {
    errors.title = `Tiêu đề không được vượt quá ${MAX_TITLE_LENGTH} ký tự.`;
  }

  if (!payload.description || payload.description.trim().length < 10) {
    errors.description = "Mô tả phải có tối thiểu 10 ký tự.";
  } else if (payload.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Mô tả không được vượt quá ${MAX_DESCRIPTION_LENGTH} ký tự.`;
  }

  if (!payload.location || payload.location.trim().length === 0) {
    errors.location = "Vui lòng nhập địa điểm.";
  }

  if (!payload.duration || payload.duration.trim().length === 0) {
    errors.duration = "Vui lòng nhập thời lượng.";
  }

  if (!payload.price || payload.price <= 0) {
    errors.price = "Giá phải lớn hơn 0.";
  } else if (payload.price > 100000000) {
    errors.price = "Giá không hợp lệ.";
  }

  if (!payload.rating || payload.rating < 0 || payload.rating > 5) {
    errors.rating = "Xếp hạng phải nằm trong khoảng 0-5.";
  }

  if (!payload.slug || payload.slug.trim().length === 0) {
    errors.slug = "Slug không được để trống.";
  } else if (!/^[a-z0-9-]+$/.test(payload.slug)) {
    errors.slug = "Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang.";
  }

  if (payload.itinerary && payload.itinerary.length > MAX_ITINERARY_ITEMS) {
    errors.itinerary = `Lịch trình không được vượt quá ${MAX_ITINERARY_ITEMS} mục.`;
  }

  if (payload.itinerary) {
    for (let i = 0; i < payload.itinerary.length; i++) {
      if (payload.itinerary[i].length > MAX_ITINERARY_ITEM_LENGTH) {
        errors.itinerary = `Mỗi mục lịch trình không được vượt quá ${MAX_ITINERARY_ITEM_LENGTH} ký tự.`;
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

async function uploadTourImage(formData: FormData, fallbackUrl = "") {
  const supabase = await createSupabaseServerClient();
  const image = formData.get("image");

  if (!supabase || !(image instanceof File) || image.size === 0) {
    return fallbackUrl;
  }

  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
    return fallbackUrl;
  }

  if (image.size > MAX_IMAGE_SIZE) {
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
    rating: Number(formData.get("rating") || 4.8),
    image_url: imageUrl || String(formData.get("image_url") || ""),
    itinerary: getListValue(formData, "itinerary"),
    included_services: getListValue(formData, "included_services"),
    tour_type: String(formData.get("tour_type") || "Khám phá")
  };
}

export async function createTour(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    redirect("/login?error=unauthorized");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const imageUrl = await uploadTourImage(formData, String(formData.get("image_url") || ""));
  const payload = getTourPayload(formData, imageUrl);

  const validationErrors = validateTourData(payload);
  if (Object.keys(validationErrors).length > 0) {
    redirect("/dashboard/tours?error=validation-failed");
  }

  try {
    const { error } = await supabase.from("tours").insert(payload);

    if (error) {
      console.error("Failed to create tour:", error.message);
      if (error.message.includes("duplicate key")) {
        redirect("/dashboard/tours?error=duplicate-slug");
      }
      redirect("/dashboard/tours?error=create-failed");
    }
  } catch (err) {
    console.error("Unexpected error creating tour:", err);
    redirect("/dashboard/tours?error=unexpected");
  }

  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/dashboard/tours");
  redirect("/dashboard/tours?success=created");
}

export async function updateTour(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    redirect("/login?error=unauthorized");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    redirect("/dashboard/tours?error=invalid-id");
  }

  const fallbackUrl = String(formData.get("existing_image_url") || "");
  const imageUrl = await uploadTourImage(formData, fallbackUrl);
  const payload = getTourPayload(formData, imageUrl);

  const validationErrors = validateTourData(payload);
  if (Object.keys(validationErrors).length > 0) {
    redirect("/dashboard/tours?error=validation-failed");
  }

  try {
    const { error } = await supabase.from("tours").update(payload).eq("id", id);

    if (error) {
      console.error("Failed to update tour:", error.message);
      if (error.message.includes("duplicate key")) {
        redirect("/dashboard/tours?error=duplicate-slug");
      }
      redirect("/dashboard/tours?error=update-failed");
    }
  } catch (err) {
    console.error("Unexpected error updating tour:", err);
    redirect("/dashboard/tours?error=unexpected");
  }

  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath(`/tours/${payload.slug}`);
  revalidatePath("/dashboard/tours");
  redirect("/dashboard/tours?success=updated");
}

export async function deleteTour(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    redirect("/login?error=unauthorized");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    redirect("/dashboard/tours?error=invalid-id");
  }

  try {
    const { data: tour } = await supabase
      .from("tours")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!tour) {
      redirect("/dashboard/tours?error=not-found");
    }

    const { error } = await supabase.from("tours").update({ deleted_at: new Date().toISOString() }).eq("id", id);

    if (error) {
      console.error("Failed to delete tour:", error.message);
      redirect("/dashboard/tours?error=delete-failed");
    }
  } catch (err) {
    console.error("Unexpected error deleting tour:", err);
    redirect("/dashboard/tours?error=unexpected");
  }

  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/dashboard/tours");
  redirect("/dashboard/tours");
}
