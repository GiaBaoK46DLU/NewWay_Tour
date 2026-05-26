import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "user";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return user;
}

export async function getCurrentUserRole(userId: string): Promise<AppRole> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return "user";
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (data?.role === "admin") {
    return "admin";
  }

  return "user";
}

export async function requireAdmin() {
  const user = await requireUser();
  const role = await getCurrentUserRole(user.id);

  if (role !== "admin") {
    redirect("/login?error=admin-required");
  }

  return { user, role };
}
