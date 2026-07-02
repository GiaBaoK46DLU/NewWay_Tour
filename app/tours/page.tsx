import { SearchBox } from "@/components/sections/search-box";
import { TourCard } from "@/components/cards/tour-card";
import { TourToolbar, type SortOption } from "@/components/sections/tour-toolbar";
import { getTours } from "@/lib/tours";
import { getCurrentUser } from "@/lib/auth";
import { getSavedTourIds } from "@/lib/wishlist";

type ToursPageProps = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    price?: string;
    date?: string;
    duration?: string;
    sort?: string;
  }>;
};

const SORT_VALUES: SortOption[] = ["popular", "price-asc", "price-desc", "rating"];

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const filters = await searchParams;
  const [tours, user, savedIds] = await Promise.all([
    getTours(),
    getCurrentUser(),
    getSavedTourIds()
  ]);
  const isAuthenticated = Boolean(user);
  const query = filters.q?.toLowerCase().trim();
  const maxPrice = Number(filters.price || 0);
  const travelDate = filters.date ? new Date(filters.date) : null;
  const durationFilter = filters.duration?.trim();
  const sort: SortOption = SORT_VALUES.includes(filters.sort as SortOption)
    ? (filters.sort as SortOption)
    : "popular";

  // Distinct durations for the toolbar dropdown, sourced from the current tours.
  const durations = Array.from(new Set(tours.map((tour) => tour.duration))).sort();

  const filteredTours = tours.filter((tour) => {
    const matchesQuery = query
      ? [tour.title, tour.location, tour.description]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;
    const matchesType = filters.type ? tour.tour_type === filters.type : true;
    const matchesPrice = maxPrice > 0 ? tour.price <= maxPrice : true;
    const matchesDate = travelDate ? !isNaN(travelDate.getTime()) : true;
    const matchesDuration = durationFilter ? tour.duration === durationFilter : true;

    return matchesQuery && matchesType && matchesPrice && matchesDate && matchesDuration;
  });

  const sortedTours = [...filteredTours].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "popular":
      default:
        return b.rating - a.rating;
    }
  });

  return (
    <div>
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="section-kicker">Tour Đà Lạt</p>
            <h1 className="section-title">
              Tìm tour phù hợp với nhịp đi và ngân sách của bạn.
            </h1>
            <p className="mt-5 text-base leading-7 text-mist">
              Bộ lọc giúp chọn nhanh điểm đến, loại tour, khoảng giá và ngày đi
              cho lịch trình Đà Lạt.
            </p>
          </div>
          <div className="mt-10">
            <SearchBox compact />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-2xl font-semibold text-ink">
              {sortedTours.length} tour khả dụng
            </h2>
            <TourToolbar
              durations={durations}
              sort={sort}
              duration={durationFilter ?? ""}
            />
          </div>
          {sortedTours.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {sortedTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  saved={savedIds.has(tour.id)}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-3xl border border-dashed border-forest/20 bg-cream/50 p-10 text-center text-mist">
              Không tìm thấy tour phù hợp. Thử điều chỉnh bộ lọc hoặc xoá bớt điều
              kiện tìm kiếm.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
