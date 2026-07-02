import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock3, MapPin, Star } from "lucide-react";
import { BookingForm } from "@/components/forms/booking-form";
import { TourReviews } from "@/components/sections/tour-reviews";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { formatPrice } from "@/lib/utils";
import { getSavedTourIds } from "@/lib/wishlist";
import { getCurrentUser } from "@/lib/auth";
import { getTourBySlug } from "@/lib/tours";

type TourDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params;
  const tour = await getTourBySlug(id);

  if (!tour) {
    notFound();
  }

  const [user, savedIds] = await Promise.all([getCurrentUser(), getSavedTourIds()]);
  const isAuthenticated = Boolean(user);

  return (
    <div>
      <section className="relative min-h-[520px] overflow-hidden">
        <Image
          alt={tour.title}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src={tour.image_url}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/82 via-ink/45 to-transparent" />
        <div className="container-page relative flex min-h-[520px] items-end pb-14 text-white">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-sm font-semibold backdrop-blur">
                <MapPin className="h-4 w-4 text-gold" />
                {tour.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Clock3 className="h-4 w-4 text-gold" />
                {tour.duration}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Star className="h-4 w-4 fill-gold text-gold" />
                {tour.rating}
              </span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {tour.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
              {tour.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_420px]">
          <div className="space-y-10">
            <article className="rounded-3xl border border-forest/10 bg-white p-7 shadow-card">
              <h2 className="text-2xl font-semibold text-ink">Lịch trình</h2>
              <div className="mt-6 grid gap-4">
                {tour.itinerary.map((item, index) => (
                  <div className="flex gap-4" key={item}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-sm font-bold text-forest">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-7 text-mist">{item}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-forest/10 bg-white p-7 shadow-card">
              <h2 className="text-2xl font-semibold text-ink">Dịch vụ bao gồm</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {tour.included_services.map((item) => (
                  <p
                    className="flex items-center gap-3 text-sm font-medium text-mist"
                    key={item}
                  >
                    <CheckCircle2 className="h-5 w-5 text-forest" />
                    {item}
                  </p>
                ))}
              </div>
            </article>

            <TourReviews tourId={tour.id} slug={tour.slug} />
          </div>

          <aside className="h-fit rounded-3xl border border-forest/10 bg-white p-7 shadow-soft lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-mist">Giá từ</p>
            <p className="mt-1 text-3xl font-bold text-forest">
              {formatPrice(tour.price)}
            </p>
            <div className="mt-5">
              <WishlistButton
                tourId={tour.id}
                initialSaved={savedIds.has(tour.id)}
                isAuthenticated={isAuthenticated}
                variant="inline"
              />
            </div>
            <BookingForm tourId={tour.id} />
          </aside>
        </div>
      </section>
    </div>
  );
}
