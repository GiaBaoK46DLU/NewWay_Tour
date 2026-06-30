"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  sendBookingConfirmationEmail,
  sendBookingNotificationEmail,
  type BookingEmailData
} from "@/lib/email";
import {
  BOOKING_STATUS,
  BOOKING_VALIDATION,
  BOOKING_ERROR_MESSAGES,
  BOOKING_FIELD_ERRORS,
  BOOKING_CONFIRMATION,
  DATABASE_CONFIG
} from "@/lib/constants";
import { getBookingReference } from "@/lib/utils";

export interface BookingFormState {
  status: "idle" | "error";
  message?: string;
  errors?: {
    tour_id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    travel_date?: string;
    guests?: string;
    note?: string;
  };
}

/**
 * Validate booking form data before submission.
 * Checks all fields for proper format, length, and business rules.
 * Travel dates are normalized to UTC midnight for consistent comparison.
 */
function validateBooking(payload: {
  tour_id: string;
  full_name: string;
  email: string;
  phone: string;
  travel_date: string;
  guests: number;
  note?: string | null;
}): BookingFormState["errors"] {
  const errors: NonNullable<BookingFormState["errors"]> = {};

  if (!payload.tour_id || payload.tour_id.trim().length === 0) {
    errors.tour_id = BOOKING_FIELD_ERRORS.TOUR_ID;
  }

  if (!payload.full_name || payload.full_name.trim().length < BOOKING_VALIDATION.MIN_NAME_LENGTH) {
    errors.full_name = BOOKING_FIELD_ERRORS.FULL_NAME;
  }

  if (!payload.email) {
    errors.email = BOOKING_FIELD_ERRORS.EMAIL_REQUIRED;
  } else if (!BOOKING_VALIDATION.EMAIL_REGEX.test(payload.email)) {
    errors.email = BOOKING_FIELD_ERRORS.EMAIL_INVALID;
  }

  if (!payload.phone) {
    errors.phone = BOOKING_FIELD_ERRORS.PHONE_REQUIRED;
  } else if (!BOOKING_VALIDATION.PHONE_REGEX.test(payload.phone)) {
    errors.phone = BOOKING_FIELD_ERRORS.PHONE_INVALID;
  }

  if (!payload.travel_date) {
    errors.travel_date = BOOKING_FIELD_ERRORS.TRAVEL_DATE_REQUIRED;
  } else {
    const travelDate = new Date(payload.travel_date + "T00:00:00Z");
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (Number.isNaN(travelDate.getTime())) {
      errors.travel_date = BOOKING_FIELD_ERRORS.TRAVEL_DATE_INVALID;
    } else if (travelDate < today) {
      errors.travel_date = BOOKING_FIELD_ERRORS.TRAVEL_DATE_PAST;
    }
  }

  if (!Number.isInteger(payload.guests)) {
    errors.guests = BOOKING_FIELD_ERRORS.GUESTS_NOT_INTEGER;
  } else if (payload.guests < 1) {
    errors.guests = BOOKING_FIELD_ERRORS.GUESTS_MIN;
  } else if (payload.guests > BOOKING_VALIDATION.MAX_GUESTS) {
    errors.guests = BOOKING_FIELD_ERRORS.GUESTS_MAX(BOOKING_VALIDATION.MAX_GUESTS);
  }

  if (payload.note && payload.note.length > BOOKING_VALIDATION.MAX_NOTE_LENGTH) {
    errors.note = BOOKING_FIELD_ERRORS.NOTE_MAX_LENGTH(BOOKING_VALIDATION.MAX_NOTE_LENGTH);
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}

/**
 * Send the customer confirmation and admin notification emails for a booking.
 * Best-effort: failures are logged but never thrown, so a flaky email provider
 * can never roll back a successful booking. Both sends run in parallel.
 */
async function sendBookingEmails(data: BookingEmailData): Promise<void> {
  try {
    const results = await Promise.allSettled([
      sendBookingConfirmationEmail(data),
      sendBookingNotificationEmail(data)
    ]);

    results.forEach((result, index) => {
      const label = index === 0 ? "customer confirmation" : "admin notification";
      if (result.status === "rejected") {
        console.error(`[email] ${label} threw:`, result.reason);
      } else if (!result.value.ok && !result.value.skipped) {
        console.error(`[email] ${label} failed:`, result.value.error);
      }
    });
  } catch (error) {
    console.error("[email] Unexpected error while sending booking emails:", error);
  }
}

/**
 * Server action to create a new booking.
 * Validates all input, checks tour capacity, and inserts booking record.
 * Prevents overbooking by querying existing non-cancelled bookings for same tour+date.
 */
export async function createBooking(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/tours?booking=setup-required");
  }

  const payload = {
    tour_id: String(formData.get("tour_id") || "").trim(),
    full_name: String(formData.get("full_name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    travel_date: String(formData.get("travel_date") || "").trim(),
    guests: Number(formData.get("guests") || 0),
    note: String(formData.get("note") || "").trim()
  };

  const errors = validateBooking(payload);
  if (errors) {
    return {
      status: "error",
      message: BOOKING_ERROR_MESSAGES.GENERIC_VALIDATION_ERROR,
      errors
    };
  }

  // Set inside the try block once the booking is saved, then consumed by the
  // redirect() below (which must live outside the try/catch).
  let confirmationUrl = "";

  try {
    const { data: tour, error: tourError } = await supabase
      .from("tours")
      .select("id, capacity, title, location, duration, price")
      .eq("id", payload.tour_id)
      .maybeSingle();

    if (tourError || !tour) {
      return {
        status: "error",
        message: BOOKING_ERROR_MESSAGES.INVALID_TOUR
      };
    }

    // Capacity is measured in GUESTS, not number of bookings. We must SUM the
    // `guests` column of every active booking for this tour+date, not COUNT the
    // rows — otherwise 5 bookings of 6 guests (30 guests) would read as 5.
    const { data: activeBookings, error: countError } = await supabase
      .from("bookings")
      .select("guests")
      .eq("tour_id", payload.tour_id)
      .eq("travel_date", payload.travel_date)
      .is("cancelled_at", null)
      .neq("status", BOOKING_STATUS.CANCELLED);

    if (countError) {
      console.error("Error checking capacity:", countError.message);
      return {
        status: "error",
        message: BOOKING_ERROR_MESSAGES.CHECK_CAPACITY_FAILED
      };
    }

    const bookedGuests = (activeBookings || []).reduce(
      (sum, booking) => sum + (booking.guests || 0),
      0
    );

    const currentBooked = bookedGuests + payload.guests;
    if (currentBooked > tour.capacity) {
      return {
        status: "error",
        message: BOOKING_ERROR_MESSAGES.CAPACITY_EXCEEDED(Math.max(0, tour.capacity - bookedGuests))
      };
    }

    // Generate the ID client-side instead of using `.select().single()` after
    // insert: the bookings table only grants SELECT to admins via RLS, so
    // requesting the inserted row back (RETURNING) fails RLS for anonymous
    // customers even though the INSERT itself is allowed.
    const bookingId = crypto.randomUUID();
    const { error } = await supabase.from("bookings").insert({
      id: bookingId,
      tour_id: payload.tour_id,
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      travel_date: payload.travel_date,
      guests: payload.guests,
      note: payload.note || null,
      status: BOOKING_STATUS.NEW
    });

    if (error) {
      console.error("Failed to create booking:", error.message);
      return {
        status: "error",
        message: BOOKING_ERROR_MESSAGES.CREATE_FAILED
      };
    }

    // Fire confirmation + admin notification emails. Email delivery is a
    // best-effort side effect: a failure here must NOT fail the booking, so we
    // swallow errors and only log them. Both emails are attempted in parallel.
    await sendBookingEmails({
      bookingId,
      fullName: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      travelDate: payload.travel_date,
      guests: payload.guests,
      note: payload.note,
      tour: {
        title: tour.title,
        location: tour.location,
        duration: tour.duration,
        price: tour.price
      }
    });

    // Build the confirmation URL while the booking details are in scope. Only
    // non-sensitive fields go into the query string (no name/email/phone) — the
    // customer reads the rest from their confirmation email. URLSearchParams
    // handles encoding of the Vietnamese tour title.
    const params = new URLSearchParams({
      [BOOKING_CONFIRMATION.PARAMS.REF]: getBookingReference(bookingId),
      [BOOKING_CONFIRMATION.PARAMS.TOUR]: tour.title,
      [BOOKING_CONFIRMATION.PARAMS.DATE]: payload.travel_date,
      [BOOKING_CONFIRMATION.PARAMS.GUESTS]: String(payload.guests)
    });
    confirmationUrl = `${BOOKING_CONFIRMATION.PATH}?${params.toString()}`;
  } catch (error) {
    console.error("Unexpected error while creating booking:", error);
    return {
      status: "error",
      message: BOOKING_ERROR_MESSAGES.UNEXPECTED_ERROR
    };
  }

  revalidatePath("/dashboard/bookings");
  // redirect() throws internally, so it must run outside the try/catch above.
  redirect(confirmationUrl);
}

/**
 * Update booking status or cancel a booking.
 * Cancellation sets cancelled_at timestamp for soft-delete pattern.
 * Confirmation updates status field to "confirmed".
 */
export async function updateBookingStatus(
  bookingId: string,
  status: "confirmed" | "cancelled"
): Promise<BookingFormState> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      status: "error",
      message: BOOKING_ERROR_MESSAGES.CREATE_FAILED
    };
  }

  if (!bookingId || !DATABASE_CONFIG.UUID_PATTERN.test(bookingId)) {
    return {
      status: "error",
      message: BOOKING_ERROR_MESSAGES.INVALID_BOOKING_ID
    };
  }

  try {
    const updateData = status === BOOKING_STATUS.CANCELLED
      ? { cancelled_at: new Date().toISOString() }
      : { status: BOOKING_STATUS.CONFIRMED };

    const { error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", bookingId);

    if (error) {
      console.error(`Failed to ${status} booking:`, error.message);
      return {
        status: "error",
        message: BOOKING_ERROR_MESSAGES.UPDATE_FAILED(status)
      };
    }

    revalidatePath("/dashboard/bookings");
    return {
      status: "idle",
      message: BOOKING_ERROR_MESSAGES.UPDATE_SUCCESS(status)
    };
  } catch (error) {
    console.error("Unexpected error updating booking:", error);
    return {
      status: "error",
      message: BOOKING_ERROR_MESSAGES.UNEXPECTED_ERROR
    };
  }
}
