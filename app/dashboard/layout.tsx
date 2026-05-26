import Link from "next/link";
import { LayoutDashboard, LogOut, MapPinned, Ticket } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/auth";

const dashboardLinks = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/dashboard/tours", label: "Quản lý tour", icon: MapPinned },
  { href: "/dashboard/bookings", label: "Booking", icon: Ticket }
];

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <section className="bg-cream py-10 lg:py-12">
      <div className="container-page grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-3xl border border-forest/10 bg-white p-5 shadow-card lg:sticky lg:top-28">
          <div className="mb-6 rounded-2xl bg-paper p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mist">
              Admin
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-ink">
              {user.email}
            </p>
          </div>
          <nav className="grid gap-2">
            {dashboardLinks.map((item) => (
              <Link
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-mist transition hover:bg-cream hover:text-forest"
                href={item.href}
                key={item.href}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout} className="mt-4">
            <button
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-earth transition hover:bg-cream"
              type="submit"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </form>
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}
