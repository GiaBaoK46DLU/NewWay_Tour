import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Short, human-friendly booking reference shown to customers (e.g. in the
 * confirmation page and confirmation email). It is the first segment of the
 * booking UUID, uppercased — not a separate database column. To look a booking
 * up from a reference, match bookings whose `id` STARTS WITH the lowercased ref.
 */
export function getBookingReference(bookingId: string) {
  return bookingId.split("-")[0]?.toUpperCase() || bookingId;
}

/**
 * Format an ISO date string (YYYY-MM-DD) as a long Vietnamese date. Returns the
 * raw input unchanged if it cannot be parsed. Uses UTC so the calendar day is
 * preserved regardless of the server timezone.
 */
export function formatBookingDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
