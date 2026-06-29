import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCachedUserRole, cacheUserRole, invalidateUserRoleCache } from "@/lib/cache";
import { USER_ROLES } from "@/lib/constants";

export type AppRole = "admin" | "user";

export type Profile = {
  id: string;
  email: string;
  username: string | null;
  role: AppRole;
};

/**
 * Get the currently authenticated user.
 * Returns null if user is not authenticated or Supabase is not configured.
 */
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

/**
 * Get the current user's profile (username, email, role).
 * Returns null when not authenticated or Supabase is not configured.
 * Falls back to auth data if the profile row is missing (e.g. legacy account).
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, email, username, role")
    .eq("id", user.id)
    .maybeSingle();

  const role = data?.role === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.USER;

  return {
    id: user.id,
    email: data?.email ?? user.email ?? "",
    username: data?.username ?? null,
    role: role as AppRole
  };
}

/**
 * Require user to be authenticated.
 * Redirects to login page if not authenticated.
 */
export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return user;
}

/**
 * Get user's role from database.
 * Uses cache to avoid repeated queries (5-minute TTL).
 * Defaults to "user" role if not found or on error.
 */
export async function getCurrentUserRole(userId: string): Promise<AppRole> {
  const cached = getCachedUserRole(userId);
  if (cached) {
    return cached as AppRole;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return USER_ROLES.USER as AppRole;
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const role = data?.role === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.USER;
  cacheUserRole(userId, role);

  return role as AppRole;
}

/**
 * Require user to be authenticated AND have admin role.
 * Redirects to login if not authenticated.
 * Redirects with error if authenticated but not admin.
 */
export async function requireAdmin() {
  const user = await requireUser();
  const role = await getCurrentUserRole(user.id);

  if (role !== USER_ROLES.ADMIN) {
    redirect("/login?error=admin-required");
  }

  return { user, role };
}

/**
 * Invalidate cached role for a user (call after role changes).
 */
export function invalidateUserCache(userId: string): void {
  invalidateUserRoleCache(userId);
}
