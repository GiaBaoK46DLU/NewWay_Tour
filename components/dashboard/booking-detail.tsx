"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Eye,
  Hash,
  Mail,
  MapPin,
  Phone,
  StickyNote,
  UserRound,
  Users,
  X
} from "lucide-react";
import { BookingStatusBadge } from "@/components/ui/booking-status-badge";
import { formatBookingDate, getBookingReference } from "@/lib/utils";
import type { Booking } from "@/types";

interface BookingDetailProps {
  booking: Booking;
}

/** Format an ISO timestamp as a Vietnamese date + time, or "—" when missing. */
function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

/**
 * "Chi tiết" button + modal showing the full record for one booking on the admin
 * dashboard. The table only shows a summary (and truncates the note); this reveals
 * everything — contact info, tour, dates, note, and audit timestamps — without
 * leaving the page. Closes on backdrop click, the X, or Esc; locks body scroll
 * while open. Purely client-side: all data is already loaded server-side into the
 * `booking` prop, so opening the modal makes no extra request.
 */
export function BookingDetail({ booking }: BookingDetailProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const rows: { icon: typeof UserRound; label: string; value: string }[] = [
    { icon: UserRound, label: "Họ và tên", value: booking.full_name },
    { icon: Mail, label: "Email", value: booking.email },
    { icon: Phone, label: "Số điện thoại", value: booking.phone },
    { icon: MapPin, label: "Tour", value: booking.tours?.title ?? booking.tour_id },
    { icon: CalendarDays, label: "Ngày đi", value: formatBookingDate(booking.travel_date) },
    { icon: Users, label: "Số khách", value: String(booking.guests) },
    { icon: CalendarDays, label: "Ngày tạo", value: formatDateTime(booking.created_at) }
  ];

  return (
    <>
      <button
        className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-forest transition hover:bg-forest/10"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Eye className="h-3.5 w-3.5" />
        Chi tiết
      </button>

      {open ? (
        <div
          aria-labelledby="booking-detail-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
        >
          <button
            aria-label="Đóng"
            className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            tabIndex={-1}
            type="button"
          />

          <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-forest/10 bg-white p-7 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-kicker">Chi tiết booking</p>
                <h3
                  className="flex items-center gap-2 text-xl font-semibold tracking-tight text-ink"
                  id="booking-detail-title"
                >
                  <Hash className="h-5 w-5 text-forest" />
                  {getBookingReference(booking.id)}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <BookingStatusBadge status={booking.status} cancelledAt={booking.cancelled_at} />
                <button
                  aria-label="Đóng"
                  className="rounded-full p-1.5 text-mist transition hover:bg-cream"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <dl className="mt-6 grid gap-3">
              {rows.map((row) => (
                <div
                  className="flex items-center gap-3 rounded-2xl bg-paper px-4 py-3"
                  key={row.label}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-forest shadow-card">
                    <row.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-mist">
                      {row.label}
                    </dt>
                    <dd className="break-words text-sm font-semibold text-ink">{row.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-4 rounded-2xl bg-paper px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-mist">
                <StickyNote className="h-4 w-4 text-forest" />
                Ghi chú
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink">
                {booking.note || "Khách không để lại ghi chú."}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
