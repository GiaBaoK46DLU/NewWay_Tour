import { CalendarCheck2, MapPinned, Ticket } from "lucide-react";
import { getBookings, getTours } from "@/lib/tours";

export default async function DashboardPage() {
  const [tours, bookings] = await Promise.all([getTours(false), getBookings()]);

  const stats = [
    {
      label: "Tour đang có",
      value: tours.length,
      icon: MapPinned
    },
    {
      label: "Booking mới",
      value: bookings.length,
      icon: Ticket
    },
    {
      label: "Tỉ lệ phản hồi",
      value: "100%",
      icon: CalendarCheck2
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="section-kicker">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Quản lý website tour Đà Lạt
        </h1>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((item) => (
          <article
            className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card"
            key={item.label}
          >
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-forest">
              <item.icon className="h-6 w-6" />
            </span>
            <p className="text-3xl font-bold text-ink">{item.value}</p>
            <p className="mt-2 text-sm font-medium text-mist">{item.label}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 rounded-3xl border border-forest/10 bg-white p-7 shadow-card">
        <h2 className="text-xl font-semibold text-ink">Ghi chú cấu hình</h2>
        <p className="mt-3 text-sm leading-7 text-mist">
          Dashboard yêu cầu Supabase Auth. Tài khoản đăng nhập có thể thao tác
          CRUD tour và xem booking theo chính sách RLS trong file
          <span className="font-semibold text-forest"> supabase/schema.sql</span>.
        </p>
      </div>
    </div>
  );
}
