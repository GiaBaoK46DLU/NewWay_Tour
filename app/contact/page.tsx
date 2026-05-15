export default function ContactPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="section-kicker">Liên hệ</p>
          <h1 className="section-title">Cần tư vấn lịch trình Đà Lạt?</h1>
          <p className="mt-5 text-base leading-7 text-mist">
            Gửi thông tin của bạn, đội ngũ Dalat Trails sẽ phản hồi để tư vấn
            tour, ngày đi và lịch trình phù hợp.
          </p>
        </div>
        <form className="grid gap-4 rounded-3xl border border-forest/10 bg-white p-7 shadow-card">
          <input
            className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
            placeholder="Họ và tên"
          />
          <input
            className="h-12 rounded-2xl border border-forest/10 bg-paper px-4 text-sm outline-none focus:border-forest"
            placeholder="Email"
            type="email"
          />
          <textarea
            className="min-h-36 rounded-2xl border border-forest/10 bg-paper p-4 text-sm outline-none focus:border-forest"
            placeholder="Bạn muốn đi tour nào?"
          />
          <button
            className="h-12 rounded-full bg-forest text-sm font-bold text-white"
            type="button"
          >
            Gửi liên hệ
          </button>
        </form>
      </div>
    </section>
  );
}
