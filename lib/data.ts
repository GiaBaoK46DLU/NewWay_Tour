import type { BlogPost, Destination, Tour } from "@/types";

export const sampleTours: Tour[] = [
  {
    id: "tour-san-may-cau-dat",
    title: "Tour săn mây Cầu Đất",
    slug: "tour-san-may-cau-dat",
    description:
      "Khởi hành sớm để đón bình minh trên biển mây, ghé đồi chè Cầu Đất và thưởng thức cà phê nóng giữa không khí cao nguyên.",
    location: "Cầu Đất",
    duration: "1 ngày",
    price: 690000,
    rating: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
    itinerary: [
      "04:30 đón khách tại khách sạn trung tâm Đà Lạt",
      "05:30 săn mây và ngắm bình minh tại Cầu Đất",
      "07:30 ăn sáng, tham quan đồi chè và vườn hồng",
      "10:30 check-in quán cà phê view thung lũng",
      "12:00 trả khách tại trung tâm"
    ],
    included_services: [
      "Xe đưa đón",
      "Hướng dẫn viên địa phương",
      "Vé tham quan",
      "Nước suối"
    ],
    tour_type: "Săn mây"
  },
  {
    id: "tour-langbiang",
    title: "Tour Langbiang và văn hóa bản địa",
    slug: "tour-langbiang",
    description:
      "Chinh phục nóc nhà Đà Lạt, khám phá làng nghề địa phương và thưởng thức đặc sản cao nguyên trong hành trình nhẹ nhàng.",
    location: "Langbiang",
    duration: "1 ngày",
    price: 820000,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85",
    itinerary: [
      "08:00 đón khách tại khách sạn",
      "09:00 tham quan khu du lịch Langbiang",
      "11:30 ăn trưa với món địa phương",
      "13:30 ghé làng văn hóa và vườn dâu",
      "16:30 kết thúc tour"
    ],
    included_services: ["Xe du lịch", "Bữa trưa", "Vé cổng", "Bảo hiểm du lịch"],
    tour_type: "Khám phá"
  },
  {
    id: "tour-thac-datanla",
    title: "Tour thác Datanla mạo hiểm",
    slug: "tour-thac-datanla",
    description:
      "Trải nghiệm máng trượt xuyên rừng, ngắm thác Datanla và tham gia các hoạt động ngoài trời phù hợp nhóm bạn trẻ.",
    location: "Thác Datanla",
    duration: "Nửa ngày",
    price: 550000,
    rating: 4.7,
    image_url:
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1400&q=85",
    itinerary: [
      "08:30 đón khách tại trung tâm",
      "09:00 trải nghiệm máng trượt Datanla",
      "10:30 tham quan thác và chụp ảnh",
      "11:30 nghỉ cà phê ven rừng",
      "12:30 trả khách"
    ],
    included_services: ["Xe đưa đón", "Vé tham quan", "Hướng dẫn viên", "Nước suối"],
    tour_type: "Mạo hiểm"
  },
  {
    id: "tour-ho-tuyen-lam",
    title: "Tour hồ Tuyền Lâm chill trong ngày",
    slug: "tour-ho-tuyen-lam",
    description:
      "Một ngày chậm rãi bên hồ Tuyền Lâm, rừng thông và các điểm check-in yên tĩnh dành cho cặp đôi hoặc gia đình.",
    location: "Hồ Tuyền Lâm",
    duration: "1 ngày",
    price: 760000,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85",
    itinerary: [
      "08:00 đón khách",
      "09:00 dạo hồ Tuyền Lâm và rừng thông",
      "11:30 ăn trưa tại nhà hàng ven hồ",
      "14:00 ghé Thiền viện Trúc Lâm",
      "16:00 trả khách"
    ],
    included_services: ["Xe riêng", "Bữa trưa", "Vé điểm tham quan", "Hỗ trợ chụp ảnh"],
    tour_type: "Nghỉ dưỡng"
  },
  {
    id: "tour-city-da-lat-1-ngay",
    title: "Tour city Đà Lạt 1 ngày",
    slug: "tour-city-da-lat-1-ngay",
    description:
      "Lịch trình gọn, đẹp và đủ chất Đà Lạt với hồ Xuân Hương, nhà thờ Con Gà, quảng trường Lâm Viên và vườn hoa.",
    location: "Trung tâm Đà Lạt",
    duration: "1 ngày",
    price: 640000,
    rating: 4.6,
    image_url:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85",
    itinerary: [
      "08:00 đón khách",
      "08:30 hồ Xuân Hương và quảng trường Lâm Viên",
      "10:30 nhà thờ Con Gà, dinh Bảo Đại",
      "12:00 ăn trưa",
      "14:00 vườn hoa thành phố và chợ Đà Lạt"
    ],
    included_services: ["Xe đưa đón", "Bữa trưa", "Vé tham quan", "Hướng dẫn viên"],
    tour_type: "City tour"
  },
  {
    id: "tour-camping-da-lat",
    title: "Tour camping Đà Lạt",
    slug: "tour-camping-da-lat",
    description:
      "Cắm trại qua đêm giữa rừng thông, tiệc BBQ, lửa trại và ngắm bình minh trong không gian cao nguyên riêng tư.",
    location: "Rừng thông Đà Lạt",
    duration: "2 ngày 1 đêm",
    price: 1490000,
    rating: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1400&q=85",
    itinerary: [
      "Ngày 1: đón khách, trekking nhẹ, dựng trại",
      "Ngày 1: BBQ tối và lửa trại",
      "Ngày 2: ngắm bình minh, ăn sáng",
      "Ngày 2: cà phê rừng thông, trả khách"
    ],
    included_services: ["Lều trại", "BBQ tối", "Bữa sáng", "Xe đưa đón", "Hướng dẫn viên"],
    tour_type: "Camping"
  }
];

export const destinations: Destination[] = [
  {
    id: "ho-xuan-huong",
    name: "Hồ Xuân Hương",
    slug: "ho-xuan-huong",
    description: "Biểu tượng trung tâm Đà Lạt, phù hợp dạo bộ, đạp xe và ngắm hoàng hôn.",
    image_url:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    highlights: "Trung tâm thành phố"
  },
  {
    id: "doi-che-cau-dat",
    name: "Đồi chè Cầu Đất",
    slug: "doi-che-cau-dat",
    description: "Không gian xanh rộng, nổi tiếng với bình minh, biển mây và nông trại trà.",
    image_url:
      "https://images.unsplash.com/photo-1495578942200-c5f5d2137def?auto=format&fit=crop&w=1200&q=85",
    highlights: "Săn mây"
  },
  {
    id: "langbiang",
    name: "Langbiang",
    slug: "langbiang",
    description: "Điểm ngắm toàn cảnh thành phố và trải nghiệm văn hóa bản địa đặc trưng.",
    image_url:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
    highlights: "Núi cao"
  },
  {
    id: "thac-datanla",
    name: "Thác Datanla",
    slug: "thac-datanla",
    description: "Thác nước nổi tiếng với máng trượt, rừng thông và hoạt động mạo hiểm.",
    image_url:
      "https://images.unsplash.com/photo-1508459855340-fb63ac591728?auto=format&fit=crop&w=1200&q=85",
    highlights: "Mạo hiểm"
  },
  {
    id: "ho-tuyen-lam",
    name: "Hồ Tuyền Lâm",
    slug: "ho-tuyen-lam",
    description: "Mặt hồ rộng, rừng thông và resort yên tĩnh cho hành trình nghỉ dưỡng.",
    image_url:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85",
    highlights: "Nghỉ dưỡng"
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: "kinh-nghiem-san-may",
    title: "Kinh nghiệm săn mây Đà Lạt không bị lỡ bình minh",
    slug: "kinh-nghiem-san-may",
    excerpt:
      "Thời gian xuất phát, trang phục và các điểm săn mây dễ đi cho chuyến đầu tiên.",
    image_url:
      "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=85",
    published_at: "12/05/2026",
    read_time: "5 phút đọc"
  },
  {
    id: "lich-trinh-da-lat-3-ngay",
    title: "Lịch trình Đà Lạt 3 ngày 2 đêm cho nhóm bạn",
    slug: "lich-trinh-da-lat-3-ngay",
    excerpt:
      "Gợi ý lịch trình cân bằng giữa check-in, ăn uống, nghỉ ngơi và trải nghiệm thiên nhiên.",
    image_url:
      "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=85",
    published_at: "09/05/2026",
    read_time: "7 phút đọc"
  },
  {
    id: "mon-ngon-da-lat",
    title: "Những món nên thử khi đi Đà Lạt mùa lạnh",
    slug: "mon-ngon-da-lat",
    excerpt:
      "Bánh căn, lẩu gà lá é, sữa đậu nành và các món nóng hợp thời tiết cao nguyên.",
    image_url:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",
    published_at: "03/05/2026",
    read_time: "4 phút đọc"
  }
];
