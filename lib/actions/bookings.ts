"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createBooking(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/tours?booking=setup-required");
  }

  const payload = {
    tour_id: String(formData.get("tour_id") || ""),
    full_name: String(formData.get("full_name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    travel_date: String(formData.get("travel_date") || ""),
    guests: Number(formData.get("guests") || 1),
    note: String(formData.get("note") || ""),
    status: "new"
  };

  await supabase.from("bookings").insert(payload);
  revalidatePath("/dashboard/bookings");
  redirect("/tours?booking=success");
}
