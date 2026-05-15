"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours", label: "Tour" },
  { href: "/destinations", label: "Điểm đến" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Liên hệ" }
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "Đóng menu" : "Mở menu"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream text-forest"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open ? (
        <div className="absolute left-4 right-4 top-20 rounded-3xl border border-forest/10 bg-white p-4 shadow-soft">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <Link
                className="rounded-2xl px-4 py-3 text-sm font-medium text-ink hover:bg-cream"
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            className="mt-3 flex h-11 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white"
            href="/login"
            onClick={() => setOpen(false)}
          >
            Đăng nhập
          </Link>
        </div>
      ) : null}
    </div>
  );
}
