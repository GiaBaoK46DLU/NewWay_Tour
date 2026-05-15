"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function login(_: unknown, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { error: "Chưa cấu hình Supabase. Hãy thêm biến môi trường trước." };
  }

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function register(_: unknown, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { error: "Chưa cấu hình Supabase. Hãy thêm biến môi trường trước." };
  }

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
