"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

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

  const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from("tour-images")
    .upload(path, image, { upsert: true });

  if (error) {
    return fallbackUrl;
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from("tour-images").getPublicUrl(path);

  return publicUrl;
}

function getTourPayload(formData: FormData, imageUrl: string) {
  const title = String(formData.get("title") || "");
  const explicitSlug = String(formData.get("slug") || "");

  return {
    title,
    slug: explicitSlug || slugify(title),
    description: String(formData.get("description") || ""),
    location: String(formData.get("location") || ""),
    duration: String(formData.get("duration") || ""),
    price: Number(formData.get("price") || 0),
    rating: Number(formData.get("rating") || 4.8),
    image_url: imageUrl || String(formData.get("image_url") || ""),
    itinerary: getListValue(formData, "itinerary"),
    included_services: getListValue(formData, "included_services"),
    tour_type: String(formData.get("tour_type") || "Khám phá")
  };
}

export async function createTour(formData: FormData) {
  await requireUser();
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const imageUrl = await uploadTourImage(formData, String(formData.get("image_url") || ""));
  const payload = getTourPayload(formData, imageUrl);

  await supabase.from("tours").insert(payload);
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/dashboard/tours");
  redirect("/dashboard/tours");
}

export async function updateTour(formData: FormData) {
  await requireUser();
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "");
  const fallbackUrl = String(formData.get("existing_image_url") || "");
  const imageUrl = await uploadTourImage(formData, fallbackUrl);
  const payload = getTourPayload(formData, imageUrl);

  await supabase.from("tours").update(payload).eq("id", id);
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath(`/tours/${payload.slug}`);
  revalidatePath("/dashboard/tours");
  redirect("/dashboard/tours");
}

export async function deleteTour(formData: FormData) {
  await requireUser();
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "");
  await supabase.from("tours").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/dashboard/tours");
  redirect("/dashboard/tours");
}
