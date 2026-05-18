import { SearchBox } from "@/components/sections/search-box";
import { TourCard } from "@/components/cards/tour-card";
import { getTours } from "@/lib/tours";

type ToursPageProps = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    price?: string;
  }>;
};

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const filters = await searchParams;
  const tours = await getTours();
  const query = filters.q?.toLowerCase().trim();
  const maxPrice = Number(filters.price || 0);

  const filteredTours = tours.filter((tour) => {
    const matchesQuery = query
      ? [tour.title, tour.location, tour.description]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;
    const matchesType = filters.type ? tour.tour_type === filters.type : true;
    const matchesPrice = maxPrice ? tour.price <= maxPrice : true;

    return matchesQuery && matchesType && matchesPrice;
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
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-ink">
              {filteredTours.length} tour khả dụng
            </h2>
          </div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
