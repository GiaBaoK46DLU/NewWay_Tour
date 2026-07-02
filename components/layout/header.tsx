import Link from "next/link";
import { Heart, Leaf, User } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getCurrentProfile } from "@/lib/auth";
import { getWishlistCount } from "@/lib/wishlist";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours", label: "Tour" },
  { href: "/destinations", label: "Điểm đến" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Liên hệ" }
];

export async function Header() {
  const profile = await getCurrentProfile();
  const displayName = profile ? profile.username || profile.email : null;
  const wishlistCount = profile ? await getWishlistCount() : 0;

  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-paper/85 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest text-white shadow-card">
            <Leaf className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-bold leading-5 text-ink">
              NewWay Tourist
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
            href="/wishlist"
            aria-label="Tour yêu thích"
            className="inline-flex items-center gap-2 text-sm font-medium text-mist transition hover:text-forest"
          >
            <span className="relative inline-flex">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 ? (
                <span
                  data-testid="wishlist-count"
                  className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-earth px-1 text-[10px] font-bold text-white"
                >
                  {wishlistCount}
                </span>
              ) : null}
            </span>
            <span>Yêu thích</span>
          </Link>
          {displayName ? (
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-full border border-forest/15 bg-cream px-4 text-sm font-semibold text-forest transition hover:border-forest/30 hover:text-earth"
              href="/profile"
              title="Hồ sơ của tôi"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-white">
                <User className="h-4 w-4" />
              </span>
              <span className="max-w-[140px] truncate">{displayName}</span>
            </Link>
          ) : (
            <Link
              className="text-sm font-semibold text-forest transition hover:text-earth"
              href="/login"
            >
              Đăng nhập
            </Link>
          )}
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
            href="/tours"
          >
            Đặt tour
          </Link>
        </div>

        <MobileNav displayName={displayName} wishlistCount={wishlistCount} />
      </div>
    </header>
  );
}
