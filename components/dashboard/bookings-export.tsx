"use client";

import { Download } from "lucide-react";
import { BOOKING_STATUS_META } from "@/lib/constants";
import { getBookingDisplayStatus, getBookingReference } from "@/lib/utils";
import type { Booking } from "@/types";

interface BookingsExportProps {
  bookings: Booking[];
}

const COLUMNS = [
  "Mã",
  "Khách hàng",
  "Email",
  "Số điện thoại",
  "Tour",
  "Ngày đi",
  "Số khách",
  "Trạng thái",
  "Ghi chú",
  "Ngày tạo"
];

/** Wrap a cell for CSV: always quote, and double any embedded quotes (RFC 4180). */
function csvCell(value: string | number | null | undefined): string {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsv(bookings: Booking[]): string {
  const rows = bookings.map((booking) => {
    const status = BOOKING_STATUS_META[getBookingDisplayStatus(booking)].label;
    return [
      getBookingReference(booking.id),
      booking.full_name,
      booking.email,
      booking.phone,
      booking.tours?.title ?? booking.tour_id,
      booking.travel_date,
      booking.guests,
      status,
      booking.note ?? "",
      booking.created_at ? booking.created_at.slice(0, 10) : ""
    ]
      .map(csvCell)
      .join(",");
  });

  return [COLUMNS.map(csvCell).join(","), ...rows].join("\r\n");
}

/**
 * "Xuất CSV" button for the admin bookings dashboard. Turns the already-loaded
 * bookings into a CSV file entirely in the browser (no server round-trip) and
 * triggers a download. A UTF-8 BOM is prepended so Excel renders the Vietnamese
 * text correctly instead of mojibake. Disabled when there is nothing to export.
 */
export function BookingsExport({ bookings }: BookingsExportProps) {
  function handleExport() {
    if (bookings.length === 0) return;

    // Prepend BOM (﻿) so Excel detects UTF-8 and keeps Vietnamese diacritics.
    const blob = new Blob(["﻿" + buildCsv(bookings)], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `bookings-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      className="inline-flex h-11 items-center gap-2 rounded-full border border-forest/15 bg-white px-5 text-sm font-semibold text-forest shadow-card transition hover:border-forest/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      disabled={bookings.length === 0}
      onClick={handleExport}
      type="button"
    >
      <Download className="h-4 w-4" />
      Xuất CSV
    </button>
  );
}
