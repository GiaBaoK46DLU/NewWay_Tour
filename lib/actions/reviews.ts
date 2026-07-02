"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ReviewFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

const MIN_COMMENT = 3;
const MAX_COMMENT = 1000;

/**
 * Create or update the signed-in user's review for a tour. Only authenticated
 * users can post (enforced here and by RLS); the unique (user_id, tour_id)
 * constraint means each user has at most one review per tour, so re-submitting
 * edits the existing one (upsert). The author name is taken from the user's
 * profile, never from client input, so it cannot be spoofed.
 */
export async function submitReview(
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Chức năng đánh giá chưa sẵn sàng." };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Bạn cần đăng nhập để gửi đánh giá." };
  }

  const tourId = String(formData.get("tour_id") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const rating = Number(formData.get("rating") || 0);
  const comment = String(formData.get("comment") || "").trim();

  if (!tourId) {
    return { status: "error", message: "Không xác định được tour." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "Vui lòng chọn số sao từ 1 đến 5." };
  }
  if (comment.length < MIN_COMMENT) {
    return { status: "error", message: "Nhận xét quá ngắn, vui lòng viết cụ thể hơn." };
  }
  if (comment.length > MAX_COMMENT) {
    return { status: "error", message: `Nhận xét tối đa ${MAX_COMMENT} ký tự.` };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, email")
    .eq("id", user.id)
    .maybeSingle();

  const authorName =
    profile?.username?.trim() ||
    profile?.email?.split("@")[0] ||
    user.email?.split("@")[0] ||
    "Khách";

  const { error } = await supabase.from("reviews").upsert(
    {
      tour_id: tourId,
      user_id: user.id,
      author_name: authorName,
      rating,
      comment,
      updated_at: new Date().toISOString()
    },
    { onConflict: "user_id,tour_id" }
  );

  if (error) {
    console.error("Error saving review:", error.message);
    return { status: "error", message: "Không thể lưu đánh giá, vui lòng thử lại." };
  }

  if (slug) {
    revalidatePath(`/tours/${slug}`);
  }
  return { status: "success", message: "Cảm ơn bạn đã đánh giá!" };
}
