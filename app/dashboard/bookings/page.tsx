import { getBookings } from "@/lib/tours";

export default async function DashboardBookingsPage() {
  const bookings = await getBookings();

  return (
    <div>
      <div className="mb-8">
        <p className="section-kicker">Booking</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Yêu cầu đặt tour
        </h1>
      </div>
      <div className="overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-[0.15em] text-mist">
              <tr>
                <th className="px-5 py-4">Khách hàng</th>
                <th className="px-5 py-4">Tour</th>
                <th className="px-5 py-4">Ngày đi</th>
                <th className="px-5 py-4">Số khách</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10">
              {bookings.map((booking: any) => (
                <tr key={booking.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{booking.full_name}</p>
                    <p className="text-mist">{booking.email}</p>
                    <p className="text-mist">{booking.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-mist">
                    {booking.tours?.title ?? booking.tour_id}
                  </td>
                  <td className="px-5 py-4 text-mist">{booking.travel_date}</td>
                  <td className="px-5 py-4 text-mist">{booking.guests}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-earth">
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-mist">{booking.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!bookings.length ? (
          <div className="p-7 text-sm text-mist">Chưa có booking nào.</div>
        ) : null}
      </div>
    </div>
  );
}
