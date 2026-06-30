import { redirect } from "next/navigation";
import { CalendarDays, CheckCircle2, Mail, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Toast } from "@/components/ui/toast";
import { BOOKING_CONFIRMATION, EMAIL_CONFIG } from "@/lib/constants";
import { formatBookingDate } from "@/lib/utils";

type BookingConfirmedPageProps = {
  searchParams: Promise<{
    ref?: string;
    tour?: string;
    date?: string;
    guests?: string;
  }>;
};

export const metadata = {
  title: "Đã nhận yêu cầu đặt tour | NewWay Tourist"
};

export default async function BookingConfirmedPage({
  searchParams
}: BookingConfirmedPageProps) {
  const params = await searchParams;
  const ref = params[BOOKING_CONFIRMATION.PARAMS.REF]?.trim();

  // Reached directly without a booking (no reference): nothing to confirm.
  if (!ref) {
    redirect("/tours");
  }

  const tourTitle = params[BOOKING_CONFIRMATION.PARAMS.TOUR]?.trim();
  const travelDate = params[BOOKING_CONFIRMATION.PARAMS.DATE]?.trim();
  const guests = params[BOOKING_CONFIRMATION.PARAMS.GUESTS]?.trim();

  const summary = [
    tourTitle
      ? { icon: CheckCircle2, label: "Tour", value: tourTitle }
      : null,
    travelDate
      ? { icon: CalendarDays, label: "Ngày khởi hành", value: formatBookingDate(travelDate) }
      : null,
    guests
      ? { icon: Users, label: "Số khách", value: `${guests} người` }
      : null
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="bg-cream py-16 lg:py-24">
      <Toast message="Đã gửi yêu cầu đặt tour thành công!" variant="success" />

      <div className="container-page">
        <div className="mx-auto max-w-2xl rounded-3xl border border-forest/10 bg-white p-8 shadow-card sm:p-12">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/10">
              <CheckCircle2 className="h-9 w-9 text-forest" />
            </span>
            <h1 className="mt-6 text-2xl font-semibold text-ink sm:text-3xl">
              Đã nhận yêu cầu đặt tour!
            </h1>
            <p className="mt-3 text-base leading-7 text-mist">
              {EMAIL_CONFIG.SUPPORT_NOTE}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-forest">
              Mã đặt tour
              <span className="font-bold tracking-wide">#{ref}</span>
            </p>
          </div>

          {summary.length > 0 ? (
            <dl className="mt-8 grid gap-4 border-t border-forest/10 pt-8">
              {summary.map((item) => (
                <div className="flex items-center gap-4" key={item.label}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-forest">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-mist">
                      {item.label}
                    </dt>
                    <dd className="text-sm font-semibold text-ink">{item.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-8 flex items-start gap-3 rounded-2xl bg-paper p-4">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
            <p className="text-sm leading-6 text-mist">
              Email xác nhận kèm chi tiết đặt tour đã được gửi tới địa chỉ email
              bạn cung cấp. Vui lòng kiểm tra cả hộp thư <strong>Spam</strong> nếu
              chưa thấy.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <ButtonLink href="/tours" variant="primary">
              Xem thêm tour khác
            </ButtonLink>
            <ButtonLink href="/" variant="secondary">
              Về trang chủ
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
