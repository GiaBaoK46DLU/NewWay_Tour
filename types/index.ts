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
  capacity?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
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

export type Review = {
  id: string;
  tour_id: string;
  user_id: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at?: string;
};

export type BookingStatus = "new" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  tour_id: string;
  user_id?: string | null;
  full_name: string;
  email: string;
  phone: string;
  travel_date: string;
  guests: number;
  note?: string | null;
  status: BookingStatus;
  created_at?: string;
  updated_at?: string;
  cancelled_at?: string | null;
  tours?: { id: string; title: string; slug?: string } | null;
};
