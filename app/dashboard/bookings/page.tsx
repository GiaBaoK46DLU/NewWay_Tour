import { requireAdmin } from "@/lib/auth";
import { getBookings } from "@/lib/tours";
import { BookingActions } from "@/components/dashboard/booking-actions";
import { BookingDetail } from "@/components/dashboard/booking-detail";
import { BookingsExport } from "@/components/dashboard/bookings-export";
import { BookingStatusBadge } from "@/components/ui/booking-status-badge";
import type { Booking } from "@/types";

export default async function DashboardBookingsPage() {
  await requireAdmin();
  const bookings = (await getBookings()) as Booking[];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Booking</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Yêu cầu đặt tour
          </h1>
        </div>
        <BookingsExport bookings={bookings} />
      </div>
      <div className="overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-[0.15em] text-mist">
              <tr>
                <th className="px-5 py-4">Khách hàng</th>
                <th className="px-5 py-4">Tour</th>
                <th className="px-5 py-4">Ngày đi</th>
                <th className="px-5 py-4">Số khách</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Ghi chú</th>
                <th className="px-5 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10">
              {bookings.map((booking) => (
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
                    <BookingStatusBadge
                      status={booking.status}
                      cancelledAt={booking.cancelled_at}
                    />
                  </td>
                  <td className="max-w-[220px] truncate px-5 py-4 text-mist" title={booking.note ?? ""}>
                    {booking.note}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <BookingDetail booking={booking} />
                      <BookingActions bookingId={booking.id} status={booking.status} />
                    </div>
                  </td>
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
