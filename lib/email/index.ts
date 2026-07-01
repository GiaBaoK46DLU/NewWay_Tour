import { EMAIL_SUBJECTS } from "@/lib/constants";
import { sendEmail, type SendEmailResult } from "@/lib/email/client";
import {
  adminNotificationEmail,
  customerConfirmationEmail,
  bookingConfirmedEmail,
  bookingCancelledEmail,
  type BookingEmailData
} from "@/lib/email/templates";

export type { BookingEmailData } from "@/lib/email/templates";
export { isEmailConfigured } from "@/lib/email/client";

/**
 * Send the booking confirmation email to the customer who made the request.
 * Never throws — returns the delivery result so the caller can log failures
 * without breaking the booking flow.
 */
export async function sendBookingConfirmationEmail(
  data: BookingEmailData
): Promise<SendEmailResult> {
  return sendEmail({
    to: data.email,
    subject: EMAIL_SUBJECTS.CUSTOMER_CONFIRMATION(data.tour.title),
    html: customerConfirmationEmail(data)
  });
}

/**
 * Notify the admin/owner that a new booking arrived. The recipient is taken from
 * the ADMIN_EMAIL env var; if it is not set the send is skipped (returns ok:false
 * with skipped:true) rather than failing.
 */
export async function sendBookingNotificationEmail(
  data: BookingEmailData
): Promise<SendEmailResult> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn(
      "[email] ADMIN_EMAIL is not set — skipping admin booking notification."
    );
    return { ok: false, skipped: true };
  }

  return sendEmail({
    to: adminEmail,
    subject: EMAIL_SUBJECTS.ADMIN_NOTIFICATION(data.tour.title),
    html: adminNotificationEmail(data),
    // Let the admin reply straight to the customer.
    replyTo: data.email
  });
}

/**
 * Notify the customer that an admin changed their booking's status. Used by
 * the dashboard's Confirm/Cancel actions — never thrown, same best-effort
 * contract as the other booking emails.
 */
export async function sendBookingStatusEmail(
  data: BookingEmailData,
  status: "confirmed" | "cancelled"
): Promise<SendEmailResult> {
  const isConfirmed = status === "confirmed";

  return sendEmail({
    to: data.email,
    subject: isConfirmed
      ? EMAIL_SUBJECTS.BOOKING_CONFIRMED(data.tour.title)
      : EMAIL_SUBJECTS.BOOKING_CANCELLED(data.tour.title),
    html: isConfirmed ? bookingConfirmedEmail(data) : bookingCancelledEmail(data)
  });
}
