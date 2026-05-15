import Link from "next/link";
import { Facebook, Instagram, Leaf, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours", label: "Tour du lịch" },
  { href: "/destinations", label: "Điểm đến" },
  { href: "/blog", label: "Blog" },
  { href: "/dashboard", label: "Dashboard" }
];

export function Footer() {
  return (
    <footer className="bg-forest text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link className="mb-5 flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold">Dalat Trails</span>
          </Link>
          <p className="max-w-md text-sm leading-7 text-white/72">
            Nền tảng đặt tour Đà Lạt cho đồ án cuối kỳ, tập trung vào trải
            nghiệm du lịch thiên nhiên, lịch trình rõ ràng và giao diện hiện đại.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/18"
              href="#"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/18"
              href="#"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            Menu nhanh
          </h3>
          <div className="grid gap-3">
            {footerLinks.map((item) => (
              <Link
                className="text-sm text-white/72 transition hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            Liên hệ
          </h3>
          <div className="grid gap-4 text-sm text-white/72">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              01 Trần Quốc Toản, Phường 1, Đà Lạt
            </p>
            <p className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              0263 123 456
            </p>
            <p className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              hello@dalattrails.vn
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/55">
        © 2026 Dalat Trails. Built with Next.js, Tailwind CSS and Supabase.
      </div>
    </footer>
  );
}
