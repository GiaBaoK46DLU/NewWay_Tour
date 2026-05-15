import { Award, BadgeCheck, Headphones, Map } from "lucide-react";
import { BlogCard } from "@/components/cards/blog-card";
import { DestinationCard } from "@/components/cards/destination-card";
import { TourCard } from "@/components/cards/tour-card";
import { HeroSection } from "@/components/sections/hero-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { ButtonLink } from "@/components/ui/button-link";
import { blogPosts, destinations, sampleTours } from "@/lib/data";

const benefits = [
  {
    icon: Award,
    title: "Tour chất lượng",
    description:
      "Lịch trình được tuyển chọn, ưu tiên trải nghiệm thiên nhiên và nhịp đi thoải mái."
  },
  {
    icon: BadgeCheck,
    title: "Giá rõ ràng",
    description:
      "Thông tin giá, dịch vụ bao gồm và lịch trình được trình bày minh bạch trước khi đặt."
  },
  {
    icon: Map,
    title: "Hướng dẫn viên địa phương",
    description:
      "Đội ngũ am hiểu Đà Lạt, biết thời điểm đẹp và các góc check-in đáng đi."
  },
  {
    icon: Headphones,
    title: "Hỗ trợ nhanh",
    description:
      "Tiếp nhận yêu cầu đặt tour, tư vấn lịch trình và phản hồi thay đổi trong thời gian ngắn."
  }
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="py-20 lg:py-24">
        <div className="container-page">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="section-kicker">Tour nổi bật</p>
              <h2 className="section-title">
                Những trải nghiệm đáng đặt trước mùa cao điểm.
              </h2>
            </div>
            <ButtonLink href="/tours" variant="ghost">
              Xem tất cả tour
            </ButtonLink>
          </div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {sampleTours.slice(0, 6).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 lg:py-24">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <p className="section-kicker">Điểm đến nổi bật</p>
            <h2 className="section-title">
              Hồ, núi, rừng thông và những góc rất Đà Lạt.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {destinations.map((destination, index) => (
              <div
                className={index === 0 || index === 4 ? "lg:col-span-2" : ""}
                key={destination.id}
              >
                <DestinationCard destination={destination} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <p className="section-kicker">Vì sao chọn chúng tôi</p>
            <h2 className="section-title">
              Một trải nghiệm đặt tour rõ ràng từ lúc xem đến lúc đi.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <article
                className="rounded-3xl border border-forest/10 bg-white p-7 shadow-card"
                key={item.title}
              >
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-forest">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-mist">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TestimonialSection />

      <section className="py-20 lg:py-24">
        <div className="container-page">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="section-kicker">Blog du lịch Đà Lạt</p>
              <h2 className="section-title">
                Mẹo lên lịch trình, ăn chơi và chuẩn bị trước chuyến đi.
              </h2>
            </div>
            <ButtonLink href="/blog" variant="ghost">
              Đọc thêm
            </ButtonLink>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
