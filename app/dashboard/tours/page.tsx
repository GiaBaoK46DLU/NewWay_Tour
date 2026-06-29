import Image from "next/image";
import { Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { TourAdminForm } from "@/components/forms/tour-admin-form";
import { createTour, deleteTour, updateTour } from "@/lib/actions/tours";
import { getTours } from "@/lib/tours";
import { formatPrice } from "@/lib/utils";

export default async function DashboardToursPage() {
  await requireAdmin();
  const tours = await getTours(false);

  return (
    <div className="space-y-8">
      <div>
        <p className="section-kicker">Tour</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Quản lý tour
        </h1>
      </div>

      <section className="rounded-3xl border border-forest/10 bg-white p-7 shadow-card">
        <h2 className="mb-6 text-xl font-semibold text-ink">Thêm tour mới</h2>
        <TourAdminForm action={createTour} submitLabel="Thêm tour" />
      </section>

      <section className="grid gap-6">
        {tours.map((tour) => (
          <article
            className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card"
            key={tour.id}
          >
            <div className="mb-6 flex flex-col gap-4 border-b border-forest/10 pb-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-24 overflow-hidden rounded-2xl">
                  <Image
                    alt={tour.title}
                    className="object-cover"
                    fill
                    sizes="96px"
                    src={tour.image_url}
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-ink">{tour.title}</h2>
                  <p className="mt-1 text-sm text-mist">
                    {tour.location} · {formatPrice(tour.price)}
                  </p>
                </div>
              </div>
              <form action={deleteTour}>
                <input name="id" type="hidden" value={tour.id} />
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-red-50 px-4 text-sm font-semibold text-red-700"
                  type="submit"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </button>
              </form>
            </div>
            <TourAdminForm
              action={updateTour}
              submitLabel="Lưu thay đổi"
              tour={tour}
            />
          </article>
        ))}
        {!tours.length ? (
          <div className="rounded-3xl border border-forest/10 bg-white p-7 text-sm text-mist shadow-card">
            Chưa có tour trong Supabase. Hãy thêm tour mới hoặc chạy SQL seed.
          </div>
        ) : null}
      </section>
    </div>
  );
}
