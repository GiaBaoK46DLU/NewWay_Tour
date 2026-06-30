import { EMAIL_CONFIG } from "@/lib/constants";

/**
 * Whether the email service is configured. When the RESEND_API_KEY env var is
 * missing we treat email as an optional feature and skip silently — this mirrors
 * the Supabase client pattern (returns null when unconfigured) so the booking
 * flow keeps working in local/demo setups without email credentials.
 */
export const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
  skipped?: boolean;
}

/**
 * Low-level email sender backed by the Resend REST API.
 *
 * Uses fetch directly instead of the Resend SDK to avoid adding a dependency for
 * a single HTTP call. Never throws: callers (server actions) must not have the
 * booking flow fail just because an email could not be delivered — failures are
 * returned as { ok: false } and should be logged, not surfaced to the user.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  if (!isEmailConfigured) {
    console.warn(
      "[email] RESEND_API_KEY is not set — skipping email send. " +
        "Add it to .env.local to enable booking confirmation emails."
    );
    return { ok: false, skipped: true };
  }

  const from = process.env.EMAIL_FROM || EMAIL_CONFIG.DEFAULT_FROM;

  try {
    const response = await fetch(EMAIL_CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        html: params.html,
        ...(params.replyTo ? { reply_to: params.replyTo } : {})
      })
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[email] Resend API responded ${response.status}: ${detail || response.statusText}`
      );
      return { ok: false, error: `Resend API error ${response.status}` };
    }

    const data = (await response.json().catch(() => null)) as { id?: string } | null;
    return { ok: true, id: data?.id };
  } catch (error) {
    console.error("[email] Failed to send email:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown email error"
    };
  }
}
