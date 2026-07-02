"use server";

import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
const GENERIC_ERROR = "Email hoặc mật khẩu không đúng. Vui lòng thử lại.";

/**
 * Only allow same-origin relative redirects (e.g. "/wishlist") to prevent open
 * redirects. Reject protocol-relative ("//evil.com") and absolute URLs.
 */
function safeNext(value: string): string | null {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return null;
}

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export async function login(_: unknown, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { error: "Chưa cấu hình Supabase. Hãy thêm biến môi trường trước." };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !validateEmail(email)) {
    return { error: "Vui lòng nhập email hợp lệ." };
  }

  if (!password || !validatePassword(password)) {
    return { error: "Vui lòng nhập mật khẩu (tối thiểu 6 ký tự)." };
  }

  let destination: string;

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Login error:", error.message);
      return { error: GENERIC_ERROR };
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: GENERIC_ERROR };
    }

    const role = await getCurrentUserRole(user.id);
    if (role === "admin") {
      destination = "/dashboard";
    } else {
      // Honour a safe ?next= return path for regular users (e.g. after being
      // sent to login from the wishlist/review flow); default to home.
      const next = safeNext(String(formData.get("next") || ""));
      destination = next ?? "/";
    }
  } catch (err) {
    console.error("Unexpected login error:", err);
    return { error: GENERIC_ERROR };
  }

  // redirect() throws NEXT_REDIRECT by design, so it must run outside try/catch.
  redirect(destination);
}

export async function register(_: unknown, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { error: "Chưa cấu hình Supabase. Hãy thêm biến môi trường trước." };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const username = String(formData.get("username") || "").trim();

  if (!username || username.length < 2 || username.length > 50) {
    return { error: "Vui lòng nhập tên người dùng (2-50 ký tự)." };
  }

  if (!email || !validateEmail(email)) {
    return { error: "Vui lòng nhập email hợp lệ." };
  }

  if (!password || !validatePassword(password)) {
    return { error: "Mật khẩu phải có tối thiểu 6 ký tự." };
  }

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    });

    if (error) {
      console.error("Registration error:", error.message);
      if (error.message.includes("already registered")) {
        return { error: "Email này đã được đăng ký. Vui lòng thử email khác." };
      }
      return { error: "Không thể đăng ký. Vui lòng thử lại sau." };
    }
  } catch (err) {
    console.error("Unexpected registration error:", err);
    return { error: "Không thể đăng ký. Vui lòng thử lại sau." };
  }

  // redirect() throws NEXT_REDIRECT by design, so it must run outside try/catch.
  redirect("/login?registered=1");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
