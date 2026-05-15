import Link from "next/link";
import Image from "next/image";
import { Clock3, MapPin, Star } from "lucide-react";
import type { Tour } from "@/types";
import { formatPrice } from "@/lib/utils";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/tours/${tour.slug}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            alt={tour.title}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            src={tour.image_url}
          />
          <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-bold text-forest backdrop-blur">
            {tour.tour_type}
          </div>
        </div>
      </Link>
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-mist">
            <MapPin className="h-4 w-4 text-gold" />
            {tour.location}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-ink">
            <Star className="h-4 w-4 fill-gold text-gold" />
            {tour.rating}
          </span>
        </div>
        <Link href={`/tours/${tour.slug}`}>
          <h3 className="text-xl font-semibold tracking-tight text-ink transition group-hover:text-forest">
            {tour.title}
          </h3>
        </Link>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-mist">
          {tour.description}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-forest/10 pt-5">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-mist">
            <Clock3 className="h-4 w-4 text-forest" />
            {tour.duration}
          </span>
          <span className="text-lg font-bold text-forest">
            {formatPrice(tour.price)}
          </span>
        </div>
        <Link
          className="mt-5 flex h-11 items-center justify-center rounded-full bg-cream text-sm font-bold text-forest transition hover:bg-forest hover:text-white"
          href={`/tours/${tour.slug}`}
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}
