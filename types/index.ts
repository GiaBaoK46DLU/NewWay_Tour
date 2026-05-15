export type Tour = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  image_url: string;
  itinerary: string[];
  included_services: string[];
  tour_type?: string;
  created_at?: string;
};

export type Destination = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  highlights: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  published_at: string;
  read_time: string;
};

export type Booking = {
  id: string;
  tour_id: string;
  full_name: string;
  email: string;
  phone: string;
  travel_date: string;
  guests: number;
  note?: string;
  status: "new" | "confirmed" | "cancelled";
  created_at?: string;
};
