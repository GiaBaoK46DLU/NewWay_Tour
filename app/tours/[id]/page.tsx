import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Star } from "lucide-react";
import { createBooking } from "@/lib/actions/bookings";
import { formatPrice } from "@/lib/utils";
import { getTourBySlug } from "@/lib/tours";

type TourDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const tour = await getTourBySlug(params.id);

  if (!tour) {
    notFound();
  }

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
          </div>

          <aside className="h-fit rounded-3xl border border-forest/10 bg-white p-7 shadow-soft lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-mist">Giá từ</p>
            <p className="mt-1 text-3xl font-bold text-forest">
              {formatPrice(tour.price)}
            </p>
            <form action={createBooking} className="mt-7 grid gap-4">
              <input name="tour_id" type="hidden" value={tour.id} />
              <input
                className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
                name="full_name"
                placeholder="Họ và tên"
                required
              />
              <input
                className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
                name="email"
                placeholder="Email"
                required
                type="email"
              />
              <input
                className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
                name="phone"
                placeholder="Số điện thoại"
                required
              />
              <label className="grid gap-2 text-sm font-semibold text-ink">
                Ngày đi
                <span className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-mist" />
                  <input
                    className="h-12 w-full rounded-2xl border border-forest/10 bg-paper pl-12 pr-4 text-sm outline-none focus:border-forest"
                    name="travel_date"
                    required
                    type="date"
                  />
                </span>
              </label>
              <input
                className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
                min="1"
                name="guests"
                placeholder="Số khách"
                required
                type="number"
              />
              <textarea
                className="min-h-28 rounded-2xl border border-forest/10 bg-paper p-4 text-sm outline-none focus:border-forest"
                name="note"
                placeholder="Ghi chú thêm"
              />
              <button
                className="h-12 rounded-full bg-gradient-to-r from-gold to-earth text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
                type="submit"
              >
                Gửi yêu cầu đặt tour
              </button>
            </form>
          </aside>
        </div>
      </section>
    </div>
  );
}
