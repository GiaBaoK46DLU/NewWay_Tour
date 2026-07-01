import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  Hash,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  ShieldCheck,
  StickyNote,
  Ticket,
  UserRound,
  Users
} from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { getCurrentProfile } from "@/lib/auth";
import { getUserBookings } from "@/lib/tours";
import { USER_ROLES } from "@/lib/constants";
import { formatBookingDate, getBookingReference } from "@/lib/utils";
import { BookingStatusBadge } from "@/components/ui/booking-status-badge";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?next=/profile");
  }

  const bookings = await getUserBookings();

  const displayName = profile.username || profile.email;
  const isAdmin = profile.role === USER_ROLES.ADMIN;
  const initial = displayName.charAt(0).toUpperCase();

  const details = [
    { label: "Tên người dùng", value: profile.username || "Chưa cập nhật", icon: UserRound },
    { label: "Email", value: profile.email, icon: Mail },
    {
      label: "Vai trò",
      value: isAdmin ? "Quản trị viên" : "Khách hàng",
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container-page max-w-2xl">
        <p className="section-kicker">Tài khoản</p>
        <h1 className="mb-7 text-3xl font-semibold tracking-tight text-ink">
          Hồ sơ của tôi
        </h1>

        <div className="rounded-3xl border border-forest/10 bg-white p-8 shadow-soft">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest text-2xl font-bold text-white shadow-card">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold text-ink">{displayName}</p>
              <span className="mt-1 inline-flex rounded-full bg-cream px-3 py-1 text-xs font-semibold text-forest">
                {isAdmin ? "Quản trị viên" : "Khách hàng"}
              </span>
            </div>
          </div>

          <dl className="mt-8 grid gap-4">
            {details.map((item) => (
              <div
                className="flex items-center gap-4 rounded-2xl bg-paper px-4 py-3"
                key={item.label}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-forest shadow-card">
                  <item.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    {item.label}
                  </dt>
                  <dd className="truncate text-sm font-semibold text-ink">
                    {item.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            {isAdmin ? (
              <Link
                className="inline-flex h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
                href="/dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                Vào trang quản trị
              </Link>
            ) : null}
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full border border-forest/15 px-5 text-sm font-semibold text-forest transition hover:border-forest/30"
              href="/tours"
            >
              Khám phá tour
            </Link>
            <form action={logout}>
              <button
                className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-earth transition hover:bg-cream"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-ink">
              <Ticket className="h-6 w-6 text-forest" />
              Lịch sử đặt tour
            </h2>
            {bookings.length > 0 ? (
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-forest">
                {bookings.length} yêu cầu
              </span>
            ) : null}
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-forest/20 bg-white p-10 text-center shadow-soft">
              <p className="text-sm text-mist">
                Bạn chưa có yêu cầu đặt tour nào khi đăng nhập bằng tài khoản này.
              </p>
              <Link
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
                href="/tours"
              >
                Khám phá tour ngay
              </Link>
            </div>
          ) : (
            <ul className="grid gap-4">
              {bookings.map((booking) => (
                <li
                  className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft"
                  key={booking.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      {booking.tours ? (
                        <Link
                          className="text-lg font-semibold text-ink transition hover:text-forest"
                          href={`/tours/${booking.tours.slug ?? booking.tour_id}`}
                        >
                          {booking.tours.title}
                        </Link>
                      ) : (
                        <p className="text-lg font-semibold text-ink">Tour không còn khả dụng</p>
                      )}
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-mist">
                        <Hash className="h-3.5 w-3.5" />
                        {getBookingReference(booking.id)}
                      </p>
                    </div>
                    <BookingStatusBadge status={booking.status} cancelledAt={booking.cancelled_at} />
                  </div>

                  <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2.5 text-sm text-ink">
                      <CalendarDays className="h-4 w-4 shrink-0 text-forest" />
                      <span className="text-mist">Ngày đi:</span>
                      <span className="font-semibold">{formatBookingDate(booking.travel_date)}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-ink">
                      <Users className="h-4 w-4 shrink-0 text-forest" />
                      <span className="text-mist">Số khách:</span>
                      <span className="font-semibold">{booking.guests}</span>
                    </div>
                    {booking.created_at ? (
                      <div className="flex items-center gap-2.5 text-sm text-ink">
                        <MapPin className="h-4 w-4 shrink-0 text-forest" />
                        <span className="text-mist">Đặt ngày:</span>
                        <span className="font-semibold">
                          {formatBookingDate(booking.created_at.slice(0, 10))}
                        </span>
                      </div>
                    ) : null}
                  </dl>

                  {booking.note ? (
                    <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-paper px-4 py-3 text-sm text-ink">
                      <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                      <span>{booking.note}</span>
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
