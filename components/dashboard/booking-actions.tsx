"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { updateBookingStatus } from "@/lib/actions/bookings";
import { Toast } from "@/components/ui/toast";
import { BOOKING_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BookingActionsProps {
  bookingId: string;
  status: string;
}

type PendingAction = "confirmed" | "cancelled" | null;

/**
 * Confirm/Cancel buttons for a single row in the admin bookings table. Calls
 * the updateBookingStatus() server action directly (no <form>, since it takes
 * positional args rather than FormData) and shows the result as a toast.
 *
 * Cancelled bookings disappear from this table on the next refresh — getBookings()
 * filters `cancelled_at is null` — so no "Cancel" state needs to be rendered here.
 */
export function BookingActions({ bookingId, status }: BookingActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [toast, setToast] = useState<{ id: number; message: string; variant: "success" | "error" } | null>(null);

  function handleUpdate(next: "confirmed" | "cancelled") {
    if (next === "cancelled" && !window.confirm("Hủy booking này? Khách sẽ nhận email thông báo.")) {
      return;
    }

    setPendingAction(next);
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, next);
      setPendingAction(null);
      setToast({
        id: Date.now(),
        message: result.message || "Đã cập nhật trạng thái booking.",
        variant: result.status === "error" ? "error" : "success"
      });
    });
  }

  return (
    <div className="flex items-center gap-2">
      {status === BOOKING_STATUS.NEW ? (
        <button
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1.5 text-xs font-bold text-forest transition hover:bg-forest/20",
            isPending && "cursor-not-allowed opacity-60"
          )}
          disabled={isPending}
          onClick={() => handleUpdate("confirmed")}
          type="button"
        >
          {pendingAction === "confirmed" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          Xác nhận
        </button>
      ) : null}

      <button
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100",
          isPending && "cursor-not-allowed opacity-60"
        )}
        disabled={isPending}
        onClick={() => handleUpdate("cancelled")}
        type="button"
      >
        {pendingAction === "cancelled" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <XCircle className="h-3.5 w-3.5" />
        )}
        Hủy
      </button>

      {toast ? (
        <Toast key={toast.id} message={toast.message} variant={toast.variant} />
      ) : null}
    </div>
  );
}
