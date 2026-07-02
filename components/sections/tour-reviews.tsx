import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewForm } from "@/components/sections/review-form";
import { getCurrentUser } from "@/lib/auth";
import { averageRating, getOwnReviewForTour, getTourReviews } from "@/lib/reviews";

function StarRow({ value }: { value: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "h-4 w-4",
            n <= Math.round(value) ? "fill-gold text-gold" : "text-forest/20"
          )}
        />
      ))}
    </span>
  );
}

/**
 * Reviews & ratings block for the tour detail page. Server-rendered so every
 * visitor (even anonymous) sees the same public list and average immediately.
 * The write path is delegated to the client <ReviewForm>, which is only
 * interactive for signed-in users.
 */
export async function TourReviews({ tourId, slug }: { tourId: string; slug: string }) {
  const [reviews, user] = await Promise.all([getTourReviews(tourId), getCurrentUser()]);
  const ownReview = user ? await getOwnReviewForTour(tourId) : null;
  const average = averageRating(reviews);

  return (
    <article
      className="rounded-3xl border border-forest/10 bg-white p-7 shadow-card"
      data-testid="tour-reviews"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-ink">Đánh giá & nhận xét</h2>
        <div className="flex items-center gap-2">
          <StarRow value={average} />
          <span className="text-sm font-semibold text-ink" data-testid="reviews-average">
            {reviews.length > 0 ? average.toFixed(1) : "Chưa có"}
          </span>
          <span className="text-sm text-mist" data-testid="reviews-count">
            ({reviews.length} đánh giá)
          </span>
        </div>
      </div>

      <div className="mt-6">
        <ReviewForm
          tourId={tourId}
          slug={slug}
          isAuthenticated={Boolean(user)}
          existingReview={ownReview}
        />
      </div>

      <div className="mt-8 grid gap-4" data-testid="reviews-list">
        {reviews.length === 0 ? (
          <p className="text-sm text-mist">
            Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận!
          </p>
        ) : (
          reviews.map((review) => (
            <div
              className="rounded-2xl border border-forest/10 bg-paper p-5"
              data-testid="review-item"
              key={review.id}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-ink">{review.author_name}</span>
                <StarRow value={review.rating} />
              </div>
              <p className="mt-2 text-sm leading-6 text-mist">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
