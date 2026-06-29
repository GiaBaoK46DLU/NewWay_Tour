"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
const PHONE_REGEX = /^\+?[0-9\s\.\-()]{10,15}$/;
const MAX_GUESTS = 100;
const MAX_NOTE_LENGTH = 5000;

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
    errors.tour_id = "Không xác định được tour. Vui lòng thử lại.";
  }

  if (!payload.full_name || payload.full_name.trim().length < 2) {
    errors.full_name = "Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự).";
  }

  if (!payload.email) {
    errors.email = "Vui lòng nhập email.";
  } else if (!EMAIL_REGEX.test(payload.email)) {
    errors.email = "Email không đúng định dạng (vd: example@domain.com).";
  }

  if (!payload.phone) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (!PHONE_REGEX.test(payload.phone)) {
    errors.phone = "Số điện thoại không hợp lệ. Sử dụng định dạng: +84 9xxxxxxxx hoặc 09xxxxxxxx.";
  }

  if (!payload.travel_date) {
    errors.travel_date = "Vui lòng chọn ngày đi.";
  } else {
    const travelDate = new Date(payload.travel_date + "T00:00:00Z");
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (Number.isNaN(travelDate.getTime())) {
      errors.travel_date = "Ngày đi không hợp lệ.";
    } else if (travelDate < today) {
      errors.travel_date = "Ngày đi phải từ hôm nay trở đi.";
    }
  }

  if (!Number.isInteger(payload.guests)) {
    errors.guests = "Số khách phải là số nguyên.";
  } else if (payload.guests < 1) {
    errors.guests = "Số khách phải lớn hơn 0.";
  } else if (payload.guests > MAX_GUESTS) {
    errors.guests = `Số khách không được vượt quá ${MAX_GUESTS}.`;
  }

  if (payload.note && payload.note.length > MAX_NOTE_LENGTH) {
    errors.note = `Ghi chú không được vượt quá ${MAX_NOTE_LENGTH} ký tự.`;
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}

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
      message: "Vui lòng kiểm tra lại thông tin đã nhập.",
      errors
    };
  }

  try {
    const { data: tour, error: tourError } = await supabase
      .from("tours")
      .select("id, capacity")
      .eq("id", payload.tour_id)
      .maybeSingle();

    if (tourError || !tour) {
      return {
        status: "error",
        message: "Tour không tồn tại. Vui lòng chọn tour khác."
      };
    }

    const { count: bookedGuests, error: countError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("tour_id", payload.tour_id)
      .eq("travel_date", payload.travel_date)
      .is("cancelled_at", null)
      .neq("status", "cancelled");

    if (countError) {
      console.error("Error checking capacity:", countError.message);
      return {
        status: "error",
        message: "Không thể kiểm tra chỗ trống. Vui lòng thử lại sau."
      };
    }

    const currentBooked = (bookedGuests || 0) + payload.guests;
    if (currentBooked > tour.capacity) {
      return {
        status: "error",
        message: `Chỉ còn ${Math.max(0, tour.capacity - (bookedGuests || 0))} chỗ trống cho ngày đi này.`
      };
    }

    const { error } = await supabase.from("bookings").insert({
      tour_id: payload.tour_id,
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      travel_date: payload.travel_date,
      guests: payload.guests,
      note: payload.note || null,
      status: "new"
    });

    if (error) {
      console.error("Failed to create booking:", error.message);
      return {
        status: "error",
        message: "Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau."
      };
    }
  } catch (error) {
    console.error("Unexpected error while creating booking:", error);
    return {
      status: "error",
      message: "Đã có lỗi xảy ra. Vui lòng thử lại sau."
    };
  }

  revalidatePath("/dashboard/bookings");
  redirect("/tours?booking=success");
}

export async function updateBookingStatus(
  bookingId: string,
  status: "confirmed" | "cancelled"
): Promise<BookingFormState> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      status: "error",
      message: "Chưa cấu hình Supabase. Hãy thêm biến môi trường trước."
    };
  }

  if (!bookingId || !/^[0-9a-f-]{36}$/i.test(bookingId)) {
    return {
      status: "error",
      message: "ID booking không hợp lệ."
    };
  }

  try {
    const updateData = status === "cancelled" ? { cancelled_at: new Date().toISOString() } : { status: "confirmed" };

    const { error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", bookingId);

    if (error) {
      console.error(`Failed to ${status} booking:`, error.message);
      return {
        status: "error",
        message: `Không thể ${status === "cancelled" ? "hủy" : "xác nhận"} booking. Vui lòng thử lại sau.`
      };
    }

    revalidatePath("/dashboard/bookings");
    return {
      status: "idle",
      message: `Booking đã được ${status === "cancelled" ? "hủy" : "xác nhận"}.`
    };
  } catch (error) {
    console.error("Unexpected error updating booking:", error);
    return {
      status: "error",
      message: "Đã có lỗi xảy ra. Vui lòng thử lại sau."
    };
  }
}
