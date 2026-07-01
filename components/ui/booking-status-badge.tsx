import { BOOKING_STATUS_META } from "@/lib/constants";
import { cn, getBookingDisplayStatus } from "@/lib/utils";

interface BookingStatusBadgeProps {
  /** The stored booking status; combined with `cancelledAt` to resolve display. */
  status: string;
  /** Soft-cancel timestamp. When set, the badge always shows "Đã hủy". */
  cancelledAt?: string | null;
  className?: string;
}

/**
 * A pill showing a booking's human-readable status in the project palette.
 * Server-safe (no client hooks). Resolves the display status via
 * getBookingDisplayStatus so a soft-cancelled row reads "Đã hủy" even when its
 * stored `status` is still "new"/"confirmed".
 */
export function BookingStatusBadge({ status, cancelledAt, className }: BookingStatusBadgeProps) {
  const resolved = getBookingDisplayStatus({ status, cancelled_at: cancelledAt });
  const meta = BOOKING_STATUS_META[resolved];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        meta.badge,
        className
      )}
    >
      {meta.label}
    </span>
  );
}
