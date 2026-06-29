// Application-wide constants for booking system, tours, and authentication

// ============ Booking Status & Validation ============
export const BOOKING_STATUS = {
  NEW: "new",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled"
} as const;

export const BOOKING_VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_GUESTS: 100,
  MAX_NOTE_LENGTH: 5000,
  MIN_TRAVEL_DATE: "today",
  EMAIL_REGEX: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
  PHONE_REGEX: /^\+?[0-9\s\.\-()]{10,15}$/
} as const;

export const BOOKING_ERROR_MESSAGES = {
  INVALID_TOUR: "Tour không tồn tại. Vui lòng chọn tour khác.",
  CAPACITY_EXCEEDED: (available: number) =>
    `Chỉ còn ${Math.max(0, available)} chỗ trống cho ngày đi này.`,
  CHECK_CAPACITY_FAILED: "Không thể kiểm tra chỗ trống. Vui lòng thử lại sau.",
  CREATE_FAILED: "Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.",
  UNEXPECTED_ERROR: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
  GENERIC_VALIDATION_ERROR: "Vui lòng kiểm tra lại thông tin đã nhập.",
  INVALID_BOOKING_ID: "ID booking không hợp lệ.",
  UPDATE_FAILED: (action: string) =>
    `Không thể ${action === "cancelled" ? "hủy" : "xác nhận"} booking. Vui lòng thử lại sau.`,
  UPDATE_SUCCESS: (action: string) =>
    `Booking đã được ${action === "cancelled" ? "hủy" : "xác nhận"}.`
} as const;

export const BOOKING_FIELD_ERRORS = {
  TOUR_ID: "Không xác định được tour. Vui lòng thử lại.",
  FULL_NAME: "Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự).",
  EMAIL_REQUIRED: "Vui lòng nhập email.",
  EMAIL_INVALID: "Email không đúng định dạng (vd: example@domain.com).",
  PHONE_REQUIRED: "Vui lòng nhập số điện thoại.",
  PHONE_INVALID: "Số điện thoại không hợp lệ. Sử dụng định dạng: +84 9xxxxxxxx hoặc 09xxxxxxxx.",
  TRAVEL_DATE_REQUIRED: "Vui lòng chọn ngày đi.",
  TRAVEL_DATE_INVALID: "Ngày đi không hợp lệ.",
  TRAVEL_DATE_PAST: "Ngày đi phải từ hôm nay trở đi.",
  GUESTS_NOT_INTEGER: "Số khách phải là số nguyên.",
  GUESTS_MIN: "Số khách phải lớn hơn 0.",
  GUESTS_MAX: (max: number) => `Số khách không được vượt quá ${max}.`,
  NOTE_MAX_LENGTH: (max: number) => `Ghi chú không được vượt quá ${max} ký tự.`
} as const;

// ============ Tour Validation & Management ============
export const TOUR_VALIDATION = {
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 200,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 5000,
  MIN_PRICE: 1,
  MAX_PRICE: 100_000_000,
  MIN_RATING: 0,
  MAX_RATING: 5,
  MAX_ITINERARY_ITEMS: 20,
  MAX_ITINERARY_ITEM_LENGTH: 300,
  SLUG_REGEX: /^[a-z0-9-]+$/,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_IMAGE_SIZE: 10 * 1024 * 1024
} as const;

export const TOUR_ERROR_MESSAGES = {
  CREATE_FAILED: "Không thể tạo tour lúc này. Vui lòng thử lại sau.",
  UPDATE_FAILED: "Không thể cập nhật tour lúc này. Vui lòng thử lại sau.",
  DELETE_FAILED: "Không thể xóa tour lúc này. Vui lòng thử lại sau.",
  DUPLICATE_SLUG: "Slug này đã được sử dụng. Vui lòng chọn slug khác.",
  VALIDATION_FAILED: "Vui lòng kiểm tra lại thông tin tour.",
  INVALID_ID: "ID tour không hợp lệ.",
  NOT_FOUND: "Tour không tồn tại.",
  IMAGE_UPLOAD_FAILED: "Không thể tải ảnh lên. Vui lòng thử lại sau.",
  UNEXPECTED_ERROR: "Đã có lỗi xảy ra. Vui lòng thử lại sau."
} as const;

export const TOUR_FIELD_ERRORS = {
  TITLE_MIN: "Tiêu đề phải có tối thiểu 3 ký tự.",
  TITLE_MAX: (max: number) => `Tiêu đề không được vượt quá ${max} ký tự.`,
  DESCRIPTION_MIN: "Mô tả phải có tối thiểu 10 ký tự.",
  DESCRIPTION_MAX: (max: number) => `Mô tả không được vượt quá ${max} ký tự.`,
  LOCATION_REQUIRED: "Vui lòng nhập địa điểm.",
  DURATION_REQUIRED: "Vui lòng nhập thời lượng.",
  PRICE_INVALID: "Giá phải lớn hơn 0.",
  PRICE_TOO_HIGH: "Giá không hợp lệ.",
  RATING_INVALID: "Xếp hạng phải nằm trong khoảng 0-5.",
  SLUG_REQUIRED: "Slug không được để trống.",
  SLUG_INVALID: "Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang.",
  ITINERARY_MAX_ITEMS: (max: number) => `Lịch trình không được vượt quá ${max} mục.`,
  ITINERARY_ITEM_MAX_LENGTH: (max: number) => `Mỗi mục lịch trình không được vượt quá ${max} ký tự.`
} as const;

export const TOUR_DEFAULTS = {
  RATING: 4.8,
  TYPE: "Khám phá",
  CAPACITY: 30,
  TYPES: ["Săn mây", "Khám phá", "Mạo hiểm", "Nghỉ dưỡng", "City tour", "Camping"]
} as const;

// ============ Authentication & Authorization ============
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng",
  SETUP_REQUIRED: "Chưa cấu hình Supabase. Hãy thêm biến môi trường trước.",
  UNAUTHORIZED: "Bạn không có quyền truy cập tài nguyên này.",
  ALREADY_REGISTERED: "Email này đã được đăng ký.",
  GENERIC: "Email hoặc mật khẩu không đúng"
} as const;

export const AUTH_VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_EMAIL_LENGTH: 254,
  EMAIL_REGEX: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user"
} as const;

// ============ Query Parameters & Redirects ============
export const QUERY_PARAMS = {
  BOOKING_ERROR: "booking",
  BOOKING_SUCCESS: "success",
  BOOKING_SETUP_REQUIRED: "setup-required",
  TOUR_ERROR: "error",
  TOUR_SUCCESS: "success",
  TOUR_SUCCESS_CREATED: "created",
  TOUR_SUCCESS_UPDATED: "updated",
  ERROR_VALIDATION_FAILED: "validation-failed",
  ERROR_DUPLICATE_SLUG: "duplicate-slug",
  ERROR_DUPLICATE_KEY: "duplicate key",
  ERROR_CREATE_FAILED: "create-failed",
  ERROR_UPDATE_FAILED: "update-failed",
  ERROR_DELETE_FAILED: "delete-failed",
  ERROR_INVALID_ID: "invalid-id",
  ERROR_NOT_FOUND: "not-found",
  ERROR_UNAUTHORIZED: "unauthorized",
  ERROR_UNEXPECTED: "unexpected"
} as const;

// ============ Database Config ============
export const DATABASE_CONFIG = {
  UUID_PATTERN: /^[0-9a-f-]{36}$/i,
  SOFT_DELETE_FILTER: { is: ["deleted_at", null] },
  SOFT_CANCEL_FILTER: { is: ["cancelled_at", null] }
} as const;

// ============ Pagination & Limits ============
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
} as const;
