"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitReview, type ReviewFormState } from "@/lib/actions/reviews";
import type { Review } from "@/types";

const initialState: ReviewFormState = { status: "idle" };

/**
 * Review submission form. Only rendered interactively for signed-in users;
 * anonymous visitors see a prompt to log in. Submits through the `submitReview`
 * server action (which revalidates the tour page so the new review shows up).
 * If the user already reviewed this tour, the form is pre-filled for editing.
 */
export function ReviewForm({
  tourId,
  slug,
  isAuthenticated,
  existingReview
}: {
  tourId: string;
  slug: string;
  isAuthenticated: boolean;
  existingReview: Review | null;
}) {
  const [state, formAction, isPending] = useActionState(submitReview, initialState);
  const [rating, setRating] = useState(existingReview?.rating ?? 5);
  const [hovered, setHovered] = useState(0);

  if (!isAuthenticated) {
    return (
      <div
        className="rounded-2xl border border-forest/15 bg-paper p-5 text-sm text-mist"
        data-testid="review-login-prompt"
      >
        Vui lòng{" "}
        <Link
          className="font-semibold text-forest underline"
          href={`/login?next=/tours/${slug}`}
        >
          đăng nhập
        </Link>{" "}
        để viết đánh giá cho tour này.
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4" data-testid="review-form">
      <input type="hidden" name="tour_id" value={tourId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating} />

      {existingReview ? (
        <p className="text-sm text-mist">
          Bạn đã đánh giá tour này — gửi lại để cập nhật nội dung.
        </p>
      ) : null}

      <div className="grid gap-2">
        <span className="text-sm font-semibold text-ink">Chấm điểm</span>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Chọn số sao">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} sao`}
              data-testid={`star-${n}`}
              className="p-1"
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(n)}
            >
              <Star
                className={cn(
                  "h-6 w-6 transition",
                  n <= (hovered || rating) ? "fill-gold text-gold" : "text-forest/20"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-ink" htmlFor="review-comment">
          Nhận xét
        </label>
        <textarea
          id="review-comment"
          name="comment"
          defaultValue={existingReview?.comment ?? ""}
          className="min-h-24 rounded-2xl border border-forest/15 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-forest"
          placeholder="Chia sẻ trải nghiệm của bạn về tour này..."
        />
      </div>

      {state.status === "error" && state.message ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" && state.message ? (
        <p className="text-sm font-medium text-forest" role="status">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-forest px-6 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft disabled:opacity-70"
      >
        {isPending ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </form>
  );
}
