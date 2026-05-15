import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Minh Anh",
    role: "Du khách từ TP.HCM",
    content:
      "Tour săn mây đi đúng giờ, hướng dẫn viên rất rành điểm chụp ảnh. Lịch trình gọn nhưng không bị vội.",
    rating: 5
  },
  {
    name: "Quang Huy",
    role: "Nhóm bạn 6 người",
    content:
      "Phần booking rõ ràng, giá minh bạch. Tour camping chuẩn bị lều, BBQ và xe đưa đón khá chỉn chu.",
    rating: 5
  },
  {
    name: "Thu Hà",
    role: "Gia đình nhỏ",
    content:
      "Đi hồ Tuyền Lâm rất nhẹ nhàng, phù hợp gia đình có trẻ nhỏ. Nhân viên hỗ trợ nhanh trước chuyến đi.",
    rating: 5
  }
];

export function TestimonialSection() {
  return (
    <section className="bg-cream py-20 lg:py-24">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <p className="section-kicker">Đánh giá khách hàng</p>
          <h2 className="section-title">Những hành trình được kể lại.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              className="rounded-3xl border border-forest/10 bg-white p-7 shadow-card"
              key={item.name}
            >
              <Quote className="mb-6 h-9 w-9 text-gold" />
              <div className="mb-5 flex gap-1">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star
                    className="h-4 w-4 fill-gold text-gold"
                    key={`${item.name}-${index}`}
                  />
                ))}
              </div>
              <p className="text-sm leading-7 text-mist">{item.content}</p>
              <div className="mt-6 border-t border-forest/10 pt-5">
                <h3 className="font-semibold text-ink">{item.name}</h3>
                <p className="text-sm text-mist">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
