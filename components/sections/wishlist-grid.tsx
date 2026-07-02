"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock3, Heart, MapPin, Trash2 } from "lucide-react";
import type { Tour } from "@/types";
import { formatPrice } from "@/lib/utils";
import { removeFromWishlist } from "@/lib/actions/wishlist";

/**
 * Client grid for the /wishlist page. Seeded with the user's saved tours from
 * the server, it removes a card optimistically and calls the server action to
 * delete the wishlist row. Renders the empty state once the list is cleared.
 */
export function WishlistGrid({ initialTours }: { initialTours: Tour[] }) {
  const [tours, setTours] = useState(initialTours);
  const [isPending, startTransition] = useTransition();

  const handleRemove = (tourId: string) => {
    const previous = tours;
    setTours((list) => list.filter((tour) => tour.id !== tourId));
    startTransition(async () => {
      const result = await removeFromWishlist(tourId);
      if (result.error) {
        setTours(previous); // roll back on failure
      }
    });
  };

  if (tours.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-forest/20 bg-cream/50 p-12 text-center">
        <Heart className="mx-auto h-10 w-10 text-mist" />
        <h2 className="mt-4 text-xl font-semibold text-ink">
          Chưa có tour nào được lưu
        </h2>
        <p className="mt-2 text-sm text-mist">
          Nhấn vào biểu tượng trái tim trên mỗi tour để lưu vào đây.
        </p>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
          href="/tours"
        >
          Khám phá tour
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-ink">{tours.length} tour đã lưu</h2>
      </div>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
          <article
            className="group overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card"
            data-testid="wishlist-item"
            key={tour.id}
          >
            <Link href={`/tours/${tour.slug}`}>
              <div className="relative h-56 overflow-hidden">
                <Image
                  alt={tour.title}
                  className="object-cover transition duration-500 group-hover:scale-105"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  src={tour.image_url}
                />
                {tour.tour_type ? (
                  <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-bold text-forest backdrop-blur">
                    {tour.tour_type}
                  </div>
                ) : null}
              </div>
            </Link>
            <div className="p-6">
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-mist">
                <MapPin className="h-4 w-4 text-gold" />
                {tour.location}
              </span>
              <Link href={`/tours/${tour.slug}`}>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink transition group-hover:text-forest">
                  {tour.title}
                </h3>
              </Link>
              <div className="mt-5 flex items-center justify-between border-t border-forest/10 pt-5">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-mist">
                  <Clock3 className="h-4 w-4 text-forest" />
                  {tour.duration}
                </span>
                <span className="text-lg font-bold text-forest">
                  {formatPrice(tour.price)}
                </span>
              </div>
              <button
                aria-label="Bỏ khỏi yêu thích"
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-earth/20 bg-earth/5 text-sm font-bold text-earth transition hover:bg-earth hover:text-white disabled:opacity-70"
                disabled={isPending}
                onClick={() => handleRemove(tour.id)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Bỏ lưu
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
