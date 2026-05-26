"use server";

import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";
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

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = await getCurrentUserRole(user.id);
  redirect(role === "admin" ? "/dashboard" : "/");
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

  redirect("/login?registered=1");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
