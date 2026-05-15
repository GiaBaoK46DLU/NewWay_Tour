import type { Tour } from "@/types";

type TourAdminFormProps = {
  action: (formData: FormData) => Promise<void>;
  tour?: Tour;
  submitLabel: string;
};

export function TourAdminForm({ action, tour, submitLabel }: TourAdminFormProps) {
  return (
    <form action={action} className="grid gap-4">
      {tour ? <input name="id" type="hidden" value={tour.id} /> : null}
      {tour ? (
        <input name="existing_image_url" type="hidden" value={tour.image_url} />
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
          defaultValue={tour?.title}
          name="title"
          placeholder="Tên tour"
          required
        />
        <input
          className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
          defaultValue={tour?.slug}
          name="slug"
          placeholder="Slug"
        />
      </div>
      <textarea
        className="min-h-24 rounded-2xl border border-forest/10 bg-paper p-4 text-sm outline-none focus:border-forest"
        defaultValue={tour?.description}
        name="description"
        placeholder="Mô tả"
        required
      />
      <div className="grid gap-4 md:grid-cols-4">
        <input
          className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
          defaultValue={tour?.location}
          name="location"
          placeholder="Địa điểm"
          required
        />
        <input
          className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
          defaultValue={tour?.duration}
          name="duration"
          placeholder="Thời lượng"
          required
        />
        <input
          className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
          defaultValue={tour?.price}
          min="0"
          name="price"
          placeholder="Giá"
          required
          type="number"
        />
        <input
          className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
          defaultValue={tour?.rating ?? 4.8}
          max="5"
          min="1"
          name="rating"
          placeholder="Rating"
          step="0.1"
          type="number"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <select
          className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
          defaultValue={tour?.tour_type ?? "Khám phá"}
          name="tour_type"
        >
          <option>Săn mây</option>
          <option>Khám phá</option>
          <option>Mạo hiểm</option>
          <option>Nghỉ dưỡng</option>
          <option>City tour</option>
          <option>Camping</option>
        </select>
        <input
          className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
          defaultValue={tour?.image_url}
          name="image_url"
          placeholder="Image URL nếu không upload"
        />
      </div>
      <input
        accept="image/*"
        className="rounded-2xl border border-dashed border-forest/20 bg-paper px-4 py-4 text-sm"
        name="image"
        type="file"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <textarea
          className="min-h-36 rounded-2xl border border-forest/10 bg-paper p-4 text-sm outline-none focus:border-forest"
          defaultValue={tour?.itinerary.join("\n")}
          name="itinerary"
          placeholder="Lịch trình, mỗi dòng một ý"
        />
        <textarea
          className="min-h-36 rounded-2xl border border-forest/10 bg-paper p-4 text-sm outline-none focus:border-forest"
          defaultValue={tour?.included_services.join("\n")}
          name="included_services"
          placeholder="Dịch vụ bao gồm, mỗi dòng một ý"
        />
      </div>
      <button
        className="h-12 rounded-full bg-forest px-6 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
        type="submit"
      >
        {submitLabel}
      </button>
    </form>
  );
}
