"use client";

import { useActionState } from "react";
import { CalendarDays } from "lucide-react";
import {
  createBooking,
  type BookingFormState
} from "@/lib/actions/bookings";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  tourId: string;
}

const initialState: BookingFormState = { status: "idle" };

const inputBase =
  "h-12 rounded-2xl border bg-paper px-4 text-sm outline-none focus:border-forest";

export function BookingForm({ tourId }: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(
    createBooking,
    initialState
  );
  const errors = state.errors;

  return (
    <form action={formAction} className="mt-7 grid gap-4" noValidate>
      <input name="tour_id" type="hidden" value={tourId} />

      {state.status === "error" && state.message ? (
        <p
          aria-live="polite"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-1.5">
        <input
          aria-invalid={Boolean(errors?.full_name)}
          className={cn(
            inputBase,
            errors?.full_name ? "border-red-400" : "border-forest/10"
          )}
          name="full_name"
          placeholder="Họ và tên"
          required
        />
        {errors?.full_name ? (
          <span className="px-1 text-xs text-red-600">{errors.full_name}</span>
        ) : null}
      </div>

      <div className="grid gap-1.5">
        <input
          aria-invalid={Boolean(errors?.email)}
          className={cn(
            inputBase,
            errors?.email ? "border-red-400" : "border-forest/10"
          )}
          name="email"
          placeholder="Email"
          required
          type="email"
        />
        {errors?.email ? (
          <span className="px-1 text-xs text-red-600">{errors.email}</span>
        ) : null}
      </div>

      <div className="grid gap-1.5">
        <input
          aria-invalid={Boolean(errors?.phone)}
          className={cn(
            inputBase,
            errors?.phone ? "border-red-400" : "border-forest/10"
          )}
          name="phone"
          placeholder="Số điện thoại"
          required
        />
        {errors?.phone ? (
          <span className="px-1 text-xs text-red-600">{errors.phone}</span>
        ) : null}
      </div>

      <label className="grid gap-2 text-sm font-semibold text-ink">
        Ngày đi
        <span className="relative">
          <CalendarDays className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-mist" />
          <input
            aria-invalid={Boolean(errors?.travel_date)}
            className={cn(
              "h-12 w-full rounded-2xl border bg-paper pl-12 pr-4 text-sm outline-none focus:border-forest",
              errors?.travel_date ? "border-red-400" : "border-forest/10"
            )}
            name="travel_date"
            required
            type="date"
          />
        </span>
        {errors?.travel_date ? (
          <span className="px-1 text-xs font-normal text-red-600">
            {errors.travel_date}
          </span>
        ) : null}
      </label>

      <div className="grid gap-1.5">
        <input
          aria-invalid={Boolean(errors?.guests)}
          className={cn(
            inputBase,
            errors?.guests ? "border-red-400" : "border-forest/10"
          )}
          min="1"
          name="guests"
          placeholder="Số khách"
          required
          type="number"
        />
        {errors?.guests ? (
          <span className="px-1 text-xs text-red-600">{errors.guests}</span>
        ) : null}
      </div>

      <textarea
        className="min-h-28 rounded-2xl border border-forest/10 bg-paper p-4 text-sm outline-none focus:border-forest"
        name="note"
        placeholder="Ghi chú thêm"
      />

      <button
        className={cn(
          "h-12 rounded-full bg-gradient-to-r from-gold to-earth text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft",
          isPending && "cursor-not-allowed opacity-70 hover:translate-y-0"
        )}
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Đang gửi..." : "Gửi yêu cầu đặt tour"}
      </button>
    </form>
  );
}
