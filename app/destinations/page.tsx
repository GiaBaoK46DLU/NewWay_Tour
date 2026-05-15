import { DestinationCard } from "@/components/cards/destination-card";
import { destinations } from "@/lib/data";

export default function DestinationsPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-page">
        <div className="mb-12 max-w-3xl">
          <p className="section-kicker">Điểm đến Đà Lạt</p>
          <h1 className="section-title">
            Những địa điểm nổi bật cho lịch trình cao nguyên.
          </h1>
        </div>
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard destination={destination} key={destination.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
