import Link from "next/link";
import { Leaf } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours", label: "Tour" },
  { href: "/destinations", label: "Điểm đến" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Liên hệ" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-paper/85 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest text-white shadow-card">
            <Leaf className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-bold leading-5 text-ink">
              Dalat Trails
            </span>
            <span className="text-xs font-medium text-mist">Travel booking</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              className="text-sm font-medium text-mist transition hover:text-forest"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            className="text-sm font-semibold text-forest transition hover:text-earth"
            href="/login"
          >
            Đăng nhập
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
            href="/tours"
          >
            Đặt tour
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
