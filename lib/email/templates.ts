import { EMAIL_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

/**
 * Data needed to render booking emails. Decoupled from the database row shape so
 * templates stay stable even if the bookings/tours schema evolves.
 */
export interface BookingEmailData {
  bookingId: string;
  fullName: string;
  email: string;
  phone: string;
  travelDate: string;
  guests: number;
  note?: string | null;
  tour: {
    title: string;
    location: string;
    duration: string;
    price: number;
  };
}

/** Escape user-supplied text so it cannot inject HTML into the email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Format an ISO date string (YYYY-MM-DD) into a Vietnamese long date. */
function formatTravelDate(value: string): string {
  const date = new Date(value + "T00:00:00Z");
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

/** Short booking reference shown to the customer (first segment of the UUID). */
function bookingReference(bookingId: string): string {
  return bookingId.split("-")[0]?.toUpperCase() || bookingId;
}

/** Shared email shell with header/footer. `body` is trusted (already escaped). */
function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:${EMAIL_CONFIG.BRAND_COLOR};padding:24px 32px;">
              <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.5px;">${EMAIL_CONFIG.BRAND_NAME}</span>
              <span style="color:#99f6e4;font-size:13px;display:block;margin-top:2px;">Khám phá Đà Lạt theo cách của bạn</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                Email này được gửi tự động từ hệ thống ${EMAIL_CONFIG.BRAND_NAME}.<br />
                Vui lòng không trả lời trực tiếp email này.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Render a key/value detail row used in both templates. */
function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:#64748b;font-size:14px;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;vertical-align:top;">${value}</td>
  </tr>`;
}

/** Shared block of booking + tour details (values already escaped/formatted). */
function detailsTable(data: BookingEmailData): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    ${detailRow("Mã đặt tour", `<span style="color:${EMAIL_CONFIG.BRAND_COLOR};">#${escapeHtml(bookingReference(data.bookingId))}</span>`)}
    ${detailRow("Tour", escapeHtml(data.tour.title))}
    ${detailRow("Địa điểm", escapeHtml(data.tour.location))}
    ${detailRow("Thời lượng", escapeHtml(data.tour.duration))}
    ${detailRow("Ngày khởi hành", escapeHtml(formatTravelDate(data.travelDate)))}
    ${detailRow("Số khách", `${data.guests} người`)}
    ${detailRow("Đơn giá", escapeHtml(formatPrice(data.tour.price)))}
    ${data.note ? detailRow("Ghi chú", escapeHtml(data.note)) : ""}
  </table>`;
}

/** Customer-facing confirmation that their booking request was received. */
export function customerConfirmationEmail(data: BookingEmailData): string {
  const body = `
    <h1 style="margin:0 0 8px;color:#0f172a;font-size:22px;">Cảm ơn bạn, ${escapeHtml(data.fullName)}!</h1>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
      Chúng tôi đã nhận được yêu cầu đặt tour của bạn. ${escapeHtml(EMAIL_CONFIG.SUPPORT_NOTE)}
    </p>
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
      <h2 style="margin:0 0 12px;color:#0f172a;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">Chi tiết đặt tour</h2>
      ${detailsTable(data)}
    </div>
    <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
      Nếu cần thay đổi thông tin, vui lòng liên hệ trực tiếp với chúng tôi và cung cấp
      <strong>mã đặt tour #${escapeHtml(bookingReference(data.bookingId))}</strong>.
    </p>`;

  return layout(`Đã nhận yêu cầu đặt tour ${data.tour.title}`, body);
}

/** Internal notification sent to the admin/owner when a new booking arrives. */
export function adminNotificationEmail(data: BookingEmailData): string {
  const body = `
    <h1 style="margin:0 0 8px;color:#0f172a;font-size:22px;">Có booking mới 🎉</h1>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
      Một khách hàng vừa gửi yêu cầu đặt tour. Vui lòng liên hệ xác nhận sớm.
    </p>
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
      <h2 style="margin:0 0 12px;color:#0f172a;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">Thông tin khách hàng</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${detailRow("Họ tên", escapeHtml(data.fullName))}
        ${detailRow("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:${EMAIL_CONFIG.BRAND_COLOR};">${escapeHtml(data.email)}</a>`)}
        ${detailRow("Điện thoại", `<a href="tel:${escapeHtml(data.phone)}" style="color:${EMAIL_CONFIG.BRAND_COLOR};">${escapeHtml(data.phone)}</a>`)}
      </table>
    </div>
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px 24px;">
      <h2 style="margin:0 0 12px;color:#0f172a;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">Chi tiết đặt tour</h2>
      ${detailsTable(data)}
    </div>`;

  return layout(`Booking mới: ${data.tour.title}`, body);
}
